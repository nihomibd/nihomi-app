/**
 * NIHOMI HAPTIC FEEDBACK ENGINE (Tactile Engagement API)
 * Utilizes the Navigator Vibration API on mobile / touch devices with
 * graceful no-op fallbacks for unsupported platforms.
 */

export type HapticPattern = 
  | 'light'
  | 'medium'
  | 'heavy'
  | 'warning'
  | 'success'
  | 'achievement'
  | 'error'
  | 'kanji_stroke'
  | 'kanji_complete'
  | 'quiz_pass'
  | 'streak_flame';

class HapticFeedbackService {
  private isSupported(): boolean {
    return typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator;
  }

  /**
   * Trigger a predefined tactile feedback vibration pattern
   */
  public trigger(pattern: HapticPattern): void {
    if (!this.isSupported()) return;

    try {
      switch (pattern) {
        case 'light':
          // Subtle touch tap
          navigator.vibrate(15);
          break;
        case 'medium':
          // Standard button press or card flip
          navigator.vibrate(30);
          break;
        case 'heavy':
          // Modal opening or destructive warning
          navigator.vibrate(60);
          break;
        case 'warning':
          // Warning countdown vibration
          navigator.vibrate([20, 20, 20]);
          break;
        case 'kanji_stroke':
          // Individual accurate kanji brush stroke
          navigator.vibrate(20);
          break;
        case 'kanji_complete':
          // Full kanji traced accurately - Double pulse
          navigator.vibrate([30, 40, 50]);
          break;
        case 'success':
          // Correct quiz answer or task completed
          navigator.vibrate([25, 30, 45]);
          break;
        case 'quiz_pass':
          // Quiz passed / 100% score celebration
          navigator.vibrate([40, 40, 60, 40, 80]);
          break;
        case 'achievement':
          // Unlocking a Nihomi milestone trophy or badge
          navigator.vibrate([50, 50, 50, 50, 100]);
          break;
        case 'streak_flame':
          // Daily streak ignition
          navigator.vibrate([30, 30, 45, 30, 60]);
          break;
        case 'error':
          // Mistake or wrong quiz choice - Quick double buzz
          navigator.vibrate([60, 50, 60]);
          break;
        default:
          navigator.vibrate(20);
      }
    } catch (e) {
      // Non-blocking catch for devices where vibrate is restricted by user interaction policies
    }
  }
}

export const haptic = new HapticFeedbackService();
