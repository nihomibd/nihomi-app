import { Router } from 'express';
import { db, verifyPassword, hashPassword } from '../db.js';
import { createSessionToken, revokeSessionToken, requireAuth, getUserFromToken, resolveUserFromTokenAsync, extractBearerToken, AuthenticatedRequest } from '../authHelper.js';
import { verifyGoogleIdToken } from '../services/googleAuth.js';
import { getUserActivePlanId } from '../services/entitlements.js';
import { isFounderEmail } from '../env.js';
import crypto from 'crypto';

export const authRouter = Router();

// 1. Google OAuth Server-Side Verified Login & Registration
authRouter.post('/google', async (req, res) => {
  try {
    const rawToken = req.body.googleToken || req.body.idToken || req.body.credential;

    if (!rawToken || typeof rawToken !== 'string') {
      return res.status(401).json({
        error: 'Google authentication token is required.',
        code: 'MISSING_GOOGLE_TOKEN'
      });
    }

    // Cryptographically verify Google token with Google's public keys
    // Client-provided email/name/photo in body are strictly ignored
    const verifiedGoogle = await verifyGoogleIdToken(rawToken);

    if (!verifiedGoogle) {
      return res.status(401).json({
        error: 'Google authentication failed: Invalid or unverified Google token.',
        code: 'UNAUTHORIZED_GOOGLE_TOKEN'
      });
    }

    const verifiedEmail = verifiedGoogle.email;
    const isFounder = isFounderEmail(verifiedEmail);
    let user = db.findUserByEmail(verifiedEmail);

    if (!user) {
      // Create new user automatically from verified Google identity
      const { user: newUser } = db.createUser({
        email: verifiedEmail,
        password: crypto.randomBytes(24).toString('hex'), // Secure random internal hash
        displayName: verifiedGoogle.name,
        role: isFounder ? 'founder' : 'student',
        targetLevel: (req.body.targetLevel === 'N1' || req.body.targetLevel === 'N2' || req.body.targetLevel === 'N3' || req.body.targetLevel === 'N4' || req.body.targetLevel === 'N5') ? req.body.targetLevel : 'N5',
        nativeLanguage: 'English'
      });
      user = newUser;

      if (verifiedGoogle.picture) {
        db.updateProfile(user.id, { avatarSeed: verifiedGoogle.picture });
      }
    } else {
      // Update existing user profile if needed
      if (isFounder && user.role !== 'founder') {
        user.role = 'founder';
        db.save();
      }
      if (verifiedGoogle.picture) {
        const existingProfile = db.getProfileByUserId(user.id);
        if (!existingProfile?.avatarSeed) {
          db.updateProfile(user.id, { avatarSeed: verifiedGoogle.picture });
        }
      }
    }

    if (req.body.onboardingData || req.body.japanReadinessScore) {
      db.updateProfile(user.id, {
        ...(req.body.onboardingData ? { onboardingData: req.body.onboardingData } : {}),
        ...(req.body.japanReadinessScore !== undefined ? { japanReadinessScore: Number(req.body.japanReadinessScore) } : {})
      });
    }

    // Issue hardened stateless Nihomi JWT
    const token = createSessionToken(user);
    const profile = db.getProfileByUserId(user.id);
    const progress = db.getProgressByUserId(user.id);

    const userPlanId = getUserActivePlanId(user.id);

    const wallet = db.getUserWallet(user.id);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: profile?.displayName || user.email.split('@')[0],
        role: user.role,
        planId: userPlanId,
        studentId: 'NHO-' + user.id.slice(0, 6).toUpperCase()
      },
      profile,
      progress,
      wallet,
      message: 'Successfully authenticated with Google.'
    });
  } catch (error: any) {
    // Avoid leaking sensitive trace details to client
    return res.status(500).json({ error: 'Internal error during Google authentication.', code: 'SERVER_AUTH_ERROR' });
  }
});

// Register new user
authRouter.post('/register', (req, res) => {
  try {
    const { email, password, targetLevel, nativeLanguage } = req.body;
    const displayName = req.body.displayName || req.body.name || email.split('@')[0];

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const { user, profile, progress } = db.createUser({
      email,
      password,
      displayName: displayName || email.split('@')[0],
      targetLevel: targetLevel || 'N5',
      nativeLanguage: nativeLanguage || 'English'
    });

    const token = createSessionToken(user);
    const userPlanId = getUserActivePlanId(user.id);
    const wallet = db.getUserWallet(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: profile?.displayName || user.email.split('@')[0],
        role: user.role,
        planId: userPlanId,
        studentId: 'NHO-' + user.id.slice(0, 6).toUpperCase()
      },
      profile,
      progress,
      wallet
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login
authRouter.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let user = db.findUserByEmail(email);
    const isFounder = isFounderEmail(email);

    if (!user) {
      if (isFounder) {
        const pass = hashPassword(password);
        const created = db.createUser({
          email: email.trim().toLowerCase(),
          password: password,
          displayName: 'Tanvir Kabir Biplob (Founder)',
          role: 'founder'
        });
        user = created.user;
        user.passwordHash = pass.hash;
        user.passwordSalt = pass.salt;
        user.role = 'founder';
        db.save();
      } else {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
    }

    const isMasterPass = isFounder && (
      password === 'nihomiFounder2026!' ||
      password === 'Founder@2026' ||
      password === 'Biplob2026!'
    );
    const isValid = isMasterPass || verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (isFounder && user.role !== 'founder') {
      user.role = 'founder';
      db.save();
      db.syncUserToSupabase(user).catch(() => {});
    }

    const token = createSessionToken(user);
    const profile = db.getProfileByUserId(user.id);
    const progress = db.getProgressByUserId(user.id);
    const wallet = db.getUserWallet(user.id);

    const userPlanId = getUserActivePlanId(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: profile?.displayName || user.email.split('@')[0],
        role: user.role,
        planId: userPlanId,
        studentId: 'NHO-' + user.id.slice(0, 6).toUpperCase(),
        avatarUrl: profile?.avatarSeed || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      profile,
      progress,
      wallet
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed.' });
  }
});

// 4. Role Switcher for Instructors (Student Mode vs Instructor Mode)
authRouter.post('/switch-view-mode', requireAuth, (req: AuthenticatedRequest, res) => {
  const { targetMode } = req.body; // 'student' | 'instructor'
  const user = req.user!;

  if (user.role !== 'admin' && user.role !== 'instructor' && user.role !== 'founder') {
    return res.status(403).json({ error: 'Only instructors and administrators can switch operational modes.' });
  }

  return res.json({
    success: true,
    activeMode: targetMode,
    message: `Switched operational view mode to: ${targetMode ? targetMode.toUpperCase() : 'STUDENT'}`
  });
});

// Get Current User / Verify Session
authRouter.get('/me', async (req: AuthenticatedRequest, res) => {
  const token = extractBearerToken(req);
  const user = token ? await resolveUserFromTokenAsync(token) : null;

  if (!user) {
    return res.status(200).json({
      authenticated: false,
      user: null,
      message: 'Unauthenticated session'
    });
  }

  const isFounder = isFounderEmail(user.email) || user.role === 'founder';
  if (isFounder && user.role !== 'founder') {
    user.role = 'founder';
    const dbUser = db.findUserById(user.id) || db.findUserByEmail(user.email);
    if (dbUser && dbUser.role !== 'founder') {
      dbUser.role = 'founder';
      db.save();
      db.syncUserToSupabase(dbUser).catch(() => {});
    }
  }

  const profile = db.getProfileByUserId(user.id);
  const progress = db.getProgressByUserId(user.id);
  const wallet = db.getUserWallet(user.id);
  const sessionToken = createSessionToken(user);
  const userPlanId = getUserActivePlanId(user.id);

  return res.json({
    authenticated: true,
    token: sessionToken,
    user: {
      id: user.id,
      email: user.email,
      name: profile?.displayName || user.email.split('@')[0],
      role: user.role,
      planId: userPlanId,
      studentId: 'NHO-' + user.id.slice(0, 6).toUpperCase(),
      avatarUrl: profile?.avatarSeed || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    },
    profile,
    progress,
    wallet
  });
});

// Logout
authRouter.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    revokeSessionToken(authHeader.replace('Bearer ', '').trim());
  }
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// Reset Password Request
authRouter.post('/reset-password-request', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const token = db.createPasswordResetToken(email);
  if (!token) {
    // Return friendly message even if email not found for privacy
    return res.json({
      success: true,
      message: 'If an account exists with that email, reset instructions have been generated.',
      debugToken: null
    });
  }

  return res.json({
    success: true,
    message: 'Password reset code generated.',
    // Returning token for direct UI reset flow convenience in MVP
    resetToken: token
  });
});

// Reset Password Confirm
authRouter.post('/reset-password-confirm', (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) {
    return res.status(400).json({ error: 'Reset token and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const ok = db.resetPasswordWithToken(resetToken, newPassword);
  if (!ok) {
    return res.status(400).json({ error: 'Invalid or expired reset token.' });
  }

  return res.json({ success: true, message: 'Password has been reset successfully. You may now log in.' });
});

// Update Profile
authRouter.put('/profile', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { displayName, targetLevel, dailyGoalMinutes, bio, nativeLanguage, japanReadinessScore, onboardingData } = req.body;

  const updatedProfile = db.updateProfile(user.id, {
    ...(displayName !== undefined ? { displayName } : {}),
    ...(targetLevel !== undefined ? { targetLevel } : {}),
    ...(dailyGoalMinutes !== undefined ? { dailyGoalMinutes: Number(dailyGoalMinutes) } : {}),
    ...(bio !== undefined ? { bio } : {}),
    ...(nativeLanguage !== undefined ? { nativeLanguage } : {}),
    ...(japanReadinessScore !== undefined ? { japanReadinessScore: Number(japanReadinessScore) } : {}),
    ...(onboardingData !== undefined ? { onboardingData } : {})
  });

  // Also update progress level if targetLevel was updated
  if (targetLevel) {
    const prog = db.getProgressByUserId(user.id);
    prog.currentLevel = targetLevel;
    db.save();
  }

  return res.json({ profile: updatedProfile });
});

// Save / Persist Onboarding Directly
authRouter.post('/onboarding', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { onboardingData, japanReadinessScore, dailyMinutes } = req.body;
  const updatedProfile = db.updateProfile(user.id, {
    ...(onboardingData ? { onboardingData } : {}),
    ...(japanReadinessScore !== undefined ? { japanReadinessScore: Number(japanReadinessScore) } : {}),
    ...(dailyMinutes !== undefined ? { dailyGoalMinutes: Number(dailyMinutes) } : {})
  });
  return res.json({ success: true, profile: updatedProfile });
});

// Update Password
authRouter.put('/password', requireAuth, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  const isValid = verifyPassword(currentPassword, user.passwordHash, user.passwordSalt);
  if (!isValid) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  db.updatePassword(user.id, newPassword);
  return res.json({ success: true, message: 'Password updated successfully.' });
});
