import React from 'react';
import { DailyStreakTracker } from './DailyStreakTracker';

export interface DailyStreakCalendarWidgetProps {
  onStreakUpdated?: (streak: number) => void;
}

export const DailyStreakCalendarWidget: React.FC<DailyStreakCalendarWidgetProps> = ({
  onStreakUpdated
}) => {
  return (
    <div id="daily-streak-calendar-widget" className="w-full">
      <DailyStreakTracker inline={true} onStreakUpdated={onStreakUpdated} />
    </div>
  );
};

export default DailyStreakCalendarWidget;
