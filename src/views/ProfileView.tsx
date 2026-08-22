import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { JLPTLevel } from '../types.js';
import {
  User as UserIcon,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';

interface ProfileViewProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const { user, profile, updateProfile } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [targetLevel, setTargetLevel] = useState<JLPTLevel>(profile?.targetLevel || 'N5');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(profile?.dailyGoalMinutes || 20);
  const [nativeLanguage, setNativeLanguage] = useState(profile?.nativeLanguage || 'English');
  const [bio, setBio] = useState(profile?.bio || '');

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setErrorMsg(null);

    try {
      await updateProfile({
        displayName: displayName.trim(),
        targetLevel,
        dailyGoalMinutes: Number(dailyGoalMinutes),
        nativeLanguage: nativeLanguage.trim(),
        bio: bio.trim()
      });
      setSavedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="nihomi-profile-view" className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Bento Top Header */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
              User Settings
            </span>
            <span className="text-xs text-stone-500 font-semibold">
              Role: {user?.role.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            Learner Profile & Goals
          </h1>
          <p className="text-xs text-stone-500">
            Configure your target JLPT benchmark, daily study habit goals, and personal learning preferences.
          </p>
        </div>

        {/* Feedback Messages */}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile and learning goals updated successfully!</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Container Bento */}
        <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Display Name / Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-500 cursor-not-allowed"
              />
            </div>

            {/* Target Level */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Target JLPT Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['N5', 'N4', 'N3'] as JLPTLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setTargetLevel(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      targetLevel === lvl
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    JLPT {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Goal Minutes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Daily Study Goal (Minutes / Day)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 20, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyGoalMinutes(mins)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border ${
                      dailyGoalMinutes === mins
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Native Language */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Native Language
              </label>
              <input
                type="text"
                value={nativeLanguage}
                onChange={(e) => setNativeLanguage(e.target.value)}
                placeholder="English, Vietnamese, Indonesian, Chinese..."
                className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Learning Goal / Bio
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. Planning to work in Tokyo as a software engineer in 2027. Targeting JLPT N3."
                className="w-full p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
