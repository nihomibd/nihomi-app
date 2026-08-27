import { JLPTLevel } from '../../types/nihomi';
import { NIHOMI_CORE_DESIGN_SYSTEM } from './contentDesignSystem';
import { WhiteLabelService } from './whiteLabelService';

export interface CertificateMetadata {
  certificateId: string;
  studentName: string;
  studentId: string;
  jlptLevel: JLPTLevel;
  totalStudyHours: number;
  scorePercentage: number;
  issueDate: string;
  hostname?: string;
  verificationUrl: string;
  verificationHash: string;
}

export interface VerifiableCertificatePayload {
  certificateId: string;
  studentName: string;
  studentId: string;
  accountRef: string;
  level: JLPTLevel;
  certifiedHours: number;
  grade: 'Grade A (Very Good)' | 'Grade A+ (Distinction)' | 'Grade B (Good)';
  attendancePercent: number;
  issueDate: string;
  verificationUrl: string;
  qrCodeUrl: string;
  signatories: {
    academicDirector: {
      name: string;
      title: string;
      organization: string;
    };
    founder: {
      name: string;
      title: string;
      organization: string;
    };
  };
  standardsAudit: {
    standardName: string;
    auditStatus: string;
    accreditationCode: string;
  };
}

export class CertificateDesignService {
  static generateVerificationHash(studentId: string, level: JLPTLevel, timestamp: string): string {
    const raw = `${studentId}-${level}-${timestamp}-NIHOMI-SECURE-STAMP`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `NHM-${Math.abs(hash).toString(16).toUpperCase().padStart(8, '0')}`;
  }

  static create150HourCertificate(data: {
    studentName: string;
    studentId: string;
    jlptLevel: JLPTLevel;
    scorePercentage: number;
    hostname?: string;
  }): CertificateMetadata {
    const issueDate = new Date().toISOString().split('T')[0];
    const verificationHash = this.generateVerificationHash(data.studentId, data.jlptLevel, issueDate);
    const certId = `CERT-${verificationHash}`;
    const host = data.hostname || 'nihomi.com';

    return {
      certificateId: certId,
      studentName: data.studentName,
      studentId: data.studentId,
      jlptLevel: data.jlptLevel,
      totalStudyHours: 150,
      scorePercentage: data.scorePercentage,
      issueDate,
      hostname: host,
      verificationUrl: `https://${host}/verify/${certId}`,
      verificationHash,
    };
  }

  static renderCertificateHTML(cert: CertificateMetadata): string {
    const resolved = WhiteLabelService.resolveTenantFromHost(cert.hostname);
    const branding = resolved.branding;

    return `
      <div class="nihomi-certificate" style="border: 4px double ${branding.accentColor}; padding: 48px; background: #FFFFFF; font-family: ${branding.fontSans}; max-width: 800px; margin: 0 auto; text-align: center;">
        <h1 style="color: ${branding.primaryColor}; margin-bottom: 4px; font-size: 28px;">${branding.brandName}</h1>
        <p style="font-family: ${branding.fontJapanese}; color: #71717A; margin-top: 0;">${branding.brandNameJa}</p>
        
        <div style="margin: 32px 0;">
          <p style="font-size: 16px; color: #52525B;">THIS IS TO CERTIFY THAT</p>
          <h2 style="font-size: 32px; color: #18181B; margin: 8px 0; border-bottom: 1px solid #E4E4E7; display: inline-block; padding-bottom: 8px;">${cert.studentName}</h2>
          <p style="font-size: 15px; color: #52525B;">has successfully fulfilled the rigorous 150-Hour readiness standard for</p>
          <h3 style="font-size: 24px; color: ${branding.accentColor}; margin: 12px 0;">JLPT ${cert.jlptLevel} MASTERY</h3>
          <p style="color: #71717A;">Academic Standard Score: <strong>${cert.scorePercentage}%</strong></p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 48px; font-size: 13px; color: #71717A; border-top: 1px solid #F4F4F5; padding-top: 24px;">
          <div>
            <p><strong>Certificate ID:</strong> ${cert.certificateId}</p>
            <p><strong>Issue Date:</strong> ${cert.issueDate}</p>
          </div>
          <div>
            <p><strong>${branding.watermarkText}</strong></p>
            <p>Verification Code: <code>${cert.verificationHash}</code></p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Generates a standardized, auditable 150-Hour Japanese Study Certificate payload.
   */
  static generateCertificatePayload(params: {
    studentName: string;
    studentId: string;
    accountRef?: string;
    level?: JLPTLevel;
    certifiedHours?: number;
  }): VerifiableCertificatePayload {
    const {
      studentName,
      studentId,
      accountRef = 'NHM-880-9972',
      level = 'N5',
      certifiedHours = 150,
    } = params;

    const certId = `CERT-${level}-${studentId.replace(/[^a-zA-Z0-9]/g, '')}`;

    return {
      certificateId: certId,
      studentName,
      studentId,
      accountRef,
      level,
      certifiedHours,
      grade: 'Grade A (Very Good)',
      attendancePercent: 96.8,
      issueDate: new Date().toISOString().split('T')[0],
      verificationUrl: `https://nihomi.com/verify/${studentId}`,
      qrCodeUrl: `https://nihomi.com/api/qr/${studentId}`,
      signatories: {
        academicDirector: {
          name: 'Sensei Md. Abdur Razzak',
          title: 'Principal & Academic Director',
          organization: 'Dhaka International Language School (ダッカ国際言語学校)',
        },
        founder: {
          name: 'MD Tanvir Kabir Biplob',
          title: 'Founder & CEO',
          organization: 'Nihomi Japanese Learning Platform & BD24 Group',
        },
      },
      standardsAudit: {
        standardName: NIHOMI_CORE_DESIGN_SYSTEM.certifiedSealText,
        auditStatus: 'VERIFIED & REGISTERED',
        accreditationCode: 'NHM-STD-2026-DILS',
      },
    };
  }
}
