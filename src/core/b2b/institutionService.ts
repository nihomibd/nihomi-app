import { StudentSeat, InstitutionLicense, InstitutionAnalytics } from '../../types/institution';

export const DILS_INSTITUTION_LICENSE: InstitutionLicense = {
  licenseId: 'LIC-DILS-2026-BD',
  institutionName: 'Dhaka International Language School (DILS)',
  institutionCode: 'DILS-DHAKA',
  mushakBinNumber: '003892183-0101',
  totalSeatsPurchased: 200,
  allocatedSeatsCount: 142,
  contractStart: '2026-01-01',
  contractEnd: '2027-01-01',
  campusLocations: ['bti Central Plaza, Farmgate, Dhaka', 'Road 11, Banani, Dhaka'],
  contactEmail: 'admissions@dils.edu.bd',
  status: 'ACTIVE'
};

export const DILS_STUDENT_ROSTER: StudentSeat[] = [
  {
    seatId: 'SEAT-DILS-001',
    studentId: 'DILS-2026-N5042',
    studentName: 'Md. Tanvir Kabir Biplob',
    studentEmail: 'mdtanvirkabirbiplob@gmail.com',
    currentLevel: 'N5',
    allocatedAt: '2026-01-15',
    streakDays: 42,
    totalHours: 154,
    status: 'ACTIVE',
    visaStatus: 'VISA_APPROVED',
    lastActiveDaysAgo: 0,
    examReadinessScore: 98
  },
  {
    seatId: 'SEAT-DILS-002',
    studentId: 'DILS-2026-N5043',
    studentName: 'Rahimul Hasan',
    studentEmail: 'rahim.hasan@dils.edu.bd',
    currentLevel: 'N5',
    allocatedAt: '2026-02-01',
    streakDays: 19,
    totalHours: 128,
    status: 'ACTIVE',
    visaStatus: 'COE_PREPARATION',
    lastActiveDaysAgo: 1,
    examReadinessScore: 88
  },
  {
    seatId: 'SEAT-DILS-003',
    studentId: 'DILS-2026-N4011',
    studentName: 'Nusrat Jahan Shimu',
    studentEmail: 'nusrat.jahan@gmail.com',
    currentLevel: 'N4',
    allocatedAt: '2026-02-10',
    streakDays: 31,
    totalHours: 142,
    status: 'ACTIVE',
    visaStatus: 'EMBASSY_SUBMITTED',
    lastActiveDaysAgo: 0,
    examReadinessScore: 92
  },
  {
    seatId: 'SEAT-DILS-004',
    studentId: 'DILS-2026-N3005',
    studentName: 'Farhan Chowdhury',
    studentEmail: 'farhan.japan@outlook.com',
    currentLevel: 'N3',
    allocatedAt: '2026-01-20',
    streakDays: 64,
    totalHours: 180,
    status: 'ACTIVE',
    visaStatus: 'VISA_APPROVED',
    lastActiveDaysAgo: 0,
    examReadinessScore: 96
  },
  {
    seatId: 'SEAT-DILS-005',
    studentId: 'DILS-2026-N5088',
    studentName: 'Sadia Akter',
    studentEmail: 'sadia.akter@dils.edu.bd',
    currentLevel: 'N5',
    allocatedAt: '2026-03-01',
    streakDays: 7,
    totalHours: 85,
    status: 'ACTIVE',
    visaStatus: 'COE_PREPARATION',
    lastActiveDaysAgo: 2,
    examReadinessScore: 81
  },
  {
    seatId: 'SEAT-DILS-006',
    studentId: 'DILS-2026-N5102',
    studentName: 'Mohammad Al-Amin',
    studentEmail: 'alamin.dils@gmail.com',
    currentLevel: 'N5',
    allocatedAt: '2026-03-12',
    streakDays: 0,
    totalHours: 42,
    status: 'INACTIVE',
    visaStatus: 'COE_PREPARATION',
    lastActiveDaysAgo: 9,
    examReadinessScore: 54
  },
  {
    seatId: 'SEAT-DILS-007',
    studentId: 'DILS-2026-N4022',
    studentName: 'Kazi Tanzeem Ahmed',
    studentEmail: 'tanzeem.ahmed@yahoo.com',
    currentLevel: 'N4',
    allocatedAt: '2026-02-18',
    streakDays: 0,
    totalHours: 58,
    status: 'INACTIVE',
    visaStatus: 'COE_PREPARATION',
    lastActiveDaysAgo: 11,
    examReadinessScore: 61
  }
];

class InstitutionServiceImpl {
  private license: InstitutionLicense = { ...DILS_INSTITUTION_LICENSE };
  private roster: StudentSeat[] = [...DILS_STUDENT_ROSTER];

  getLicense(): InstitutionLicense {
    return { ...this.license };
  }

  getRoster(): StudentSeat[] {
    return [...this.roster];
  }

  getAnalytics(): InstitutionAnalytics {
    const totalAllocated = this.license.allocatedSeatsCount;
    const remaining = Math.max(0, this.license.totalSeatsPurchased - totalAllocated);
    const totalHoursSum = this.roster.reduce((acc, curr) => acc + curr.totalHours, 0);
    const avgHours = this.roster.length > 0 ? Math.round(totalHoursSum / this.roster.length) : 124;
    const inactiveCount = this.roster.filter((s) => s.status === 'INACTIVE' || s.lastActiveDaysAgo >= 7).length;
    const readyCount = this.roster.filter((s) => s.examReadinessScore >= 80).length;
    const readinessRate = this.roster.length > 0 ? Math.round((readyCount / this.roster.length) * 1000) / 10 : 94.5;
    const coeReady = this.roster.filter((s) => s.visaStatus === 'VISA_APPROVED' || s.visaStatus === 'EMBASSY_SUBMITTED').length;

    return {
      totalSeatsRemaining: remaining,
      averageStudyHours: avgHours,
      jlptReadinessRate: readinessRate,
      inactiveLearnersCount: inactiveCount,
      activeLearnersCount: this.roster.length - inactiveCount,
      coeReadyCount: coeReady
    };
  }

  allocateNewSeat(name: string, email: string, level: 'N5' | 'N4' | 'N3'): StudentSeat {
    const newSeq = this.roster.length + 1;
    const studentId = `DILS-2026-${level}${String(newSeq).padStart(3, '0')}`;
    const newSeat: StudentSeat = {
      seatId: `SEAT-DILS-${String(newSeq).padStart(3, '0')}`,
      studentId,
      studentName: name,
      studentEmail: email,
      currentLevel: level,
      allocatedAt: new Date().toISOString().split('T')[0],
      streakDays: 1,
      totalHours: 0,
      status: 'ACTIVE',
      visaStatus: 'COE_PREPARATION',
      lastActiveDaysAgo: 0,
      examReadinessScore: 70
    };

    this.roster = [newSeat, ...this.roster];
    this.license.allocatedSeatsCount = Math.min(
      this.license.totalSeatsPurchased,
      this.license.allocatedSeatsCount + 1
    );

    return newSeat;
  }
}

export const InstitutionService = new InstitutionServiceImpl();
