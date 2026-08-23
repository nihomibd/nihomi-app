import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Volume2,
  X
} from 'lucide-react';

interface ReminderSettings {
  enabled: boolean;
  time: string; // HH:mm format, e.g. "20:00"
  lastTriggerDate?: string;
}

export const DailyStudyReminder: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    try {
      const raw = localStorage.getItem('nihomi_study_reminder_v1');
      if (raw) return JSON.parse(raw);
    } catch {}
    return { enabled: true, time: '20:00' };
  });
  const [testSent, setTestSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const saveSettings = (newSettings: ReminderSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem('nihomi_study_reminder_v1', JSON.stringify(newSettings));
    } catch {}
  };

  const handleRequestPermission = async () => {
    setErrorMsg(null);
    if (!('Notification' in window)) {
      setErrorMsg('This browser does not support desktop notifications.');
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        saveSettings({ ...settings, enabled: true });
        sendBrowserNotification('Nihomi Japanese Reminder Activated 🌸', {
          body: `Daily study reminder set for ${settings.time}. Let's master Japanese together!`
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Permission request failed.');
    }
  };

  const sendBrowserNotification = (title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options
        });
      } catch (err) {
        console.warn('Notification trigger error:', err);
      }
    }
  };

  const handleSendTestNotification = () => {
    if (permission !== 'granted') {
      handleRequestPermission();
      return;
    }
    setTestSent(true);
    sendBrowserNotification('🌸 Nihomi Daily Study Nudge', {
      body: 'Time for your 15-minute Japanese lesson! Keep your study streak alive 🔥'
    });
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div id="daily-study-reminder" className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 dark:border-amber-900">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-serif text-stone-900 dark:text-white">
                Daily Study Reminder
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                permission === 'granted' && settings.enabled
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
              }`}>
                {permission === 'granted' && settings.enabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Browser push notification nudges to help you maintain your daily Japanese study streak.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {permission !== 'granted' ? (
            <button
              onClick={handleRequestPermission}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Notifications</span>
            </button>
          ) : (
            <button
              onClick={handleSendTestNotification}
              className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{testSent ? 'Notification Sent!' : 'Send Test Nudge'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Reminder Config Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              <span>Preferred Nudge Time</span>
            </span>
            <p className="text-[11px] text-stone-500">Everyday at this time</p>
          </div>
          <input
            type="time"
            value={settings.time}
            onChange={(e) => saveSettings({ ...settings, time: e.target.value })}
            className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-xs font-mono font-bold"
          />
        </div>

        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="font-bold text-stone-900 dark:text-stone-100">
              Notification Status
            </span>
            <p className="text-[11px] text-stone-500">
              {permission === 'granted'
                ? 'Permission granted in browser'
                : permission === 'denied'
                ? 'Blocked in browser settings'
                : 'Click enable to activate'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled && permission === 'granted'}
              onChange={(e) => {
                if (permission !== 'granted') {
                  handleRequestPermission();
                } else {
                  saveSettings({ ...settings, enabled: e.target.checked });
                }
              }}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
