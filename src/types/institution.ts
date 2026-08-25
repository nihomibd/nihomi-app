export interface StudentSeat {
  seatId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  currentLevel: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  allocatedAt: string;
  streakDays: number;
  totalHours: number;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  visaStatus: 'COE_PREPARATION' | 'EMBASSY_SUBMITTED' | 'VISA_APPROVED' | 'ENROLLED';
  lastActiveDaysAgo: number;
  examReadinessScore: number;
}

export interface InstitutionLicense {
  licenseId: string;
  institutionName: string;
  institutionCode: string;
  mushakBinNumber: string;
  totalSeatsPurchased: number;
  allocatedSeatsCount: number;
  contractStart: string;
  contractEnd: string;
  campusLocations: string[];
  contactEmail: string;
  status: 'ACTIVE' | 'EXPIRED' | 'RENEWAL_DUE';
}

export interface InstitutionAnalytics {
  totalSeatsRemaining: number;
  averageStudyHours: number;
  jlptReadinessRate: number;
  inactiveLearnersCount: number;
  activeLearnersCount: number;
  coeReadyCount: number;
}
