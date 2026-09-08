import React from 'react';
import { DashboardPage as DashboardFeaturePage } from '../features/student-dashboard/DashboardPage';
import { NavTab } from '../features/student-dashboard/components/MobileBottomNavigation';

export interface DashboardPageProps {
  onNavigateTab?: (tab: NavTab) => void;
  onNavigate?: (view: string) => void;
  onResumeLesson?: (lessonId: string) => void;
  onOpenMistakeBook?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  return <DashboardFeaturePage {...props} />;
};

export default DashboardPage;
