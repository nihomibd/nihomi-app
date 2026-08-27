/**
 * NIHOMI PUSH NOTIFICATION & DAILY STREAK REMINDER ENGINE
 * Handles browser-based Web Notifications API, streak alerts,
 * and service worker push subscriptions.
 */

export interface NotificationSettings {
  enabled: boolean;
  preferredTime: string; // "HH:MM" e.g. "20:00"
  streakAlerts: boolean;
  studyCircleInvites: boolean;
  lastNotifiedDate?: string;
}

const STORAGE_KEY = 'nihomi_push_settings_v1';

export class PushNotificationService {
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public static getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const settings = this.getSettings();
        settings.enabled = true;
        this.saveSettings(settings);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public static getSettings(): NotificationSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {}
    return {
      enabled: false,
      preferredTime: '20:00',
      streakAlerts: true,
      studyCircleInvites: true
    };
  }

  public static saveSettings(settings: NotificationSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }

  /**
   * Send a rich local push notification with icon and vibration
   */
  public static sendLocalNotification(title: string, options: NotificationOptions = {}): void {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return;
    }

    try {
      const defaultOptions: any = {
        icon: '/assets/icon-192.png',
        badge: '/favicon.svg',
        tag: 'nihomi-study-alert',
        renotify: true,
        ...options
      };

      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(title, defaultOptions);
        });
      } else {
        new Notification(title, defaultOptions);
      }
    } catch (e) {
      console.warn('Failed to dispatch notification:', e);
    }
  }

  /**
   * Evaluate if user hasn't studied today and trigger daily streak protection notification
   */
  public static checkAndTriggerDailyStreakReminder(currentStreak: number = 0): void {
    const settings = this.getSettings();
    if (!settings.enabled || !settings.streakAlerts) return;
    if (Notification.permission !== 'granted') return;

    const todayStr = new Date().toISOString().split('T')[0];
    if (settings.lastNotifiedDate === todayStr) {
      return; // Already alerted today
    }

    const lastActive = localStorage.getItem('nihomi_last_active_date');
    if (lastActive !== todayStr) {
      // User hasn't completed study session today
      this.sendLocalNotification('🔥 Nihomi: আপনার স্টাডি স্ট্রিক রক্ষা করুন!', {
        body: `আজকের জাপানি লেসন বা কুইজ এখনো সম্পন্ন করেননি! আপনার ${currentStreak || 1} দিনের স্ট্রিক চালু রাখতে এখনই ৫ মিনিট রিভিশন দিন।`,
        data: { url: '/dashboard' }
      });
      settings.lastNotifiedDate = todayStr;
      this.saveSettings(settings);
    }
  }
}
