export type SchoolStatus = 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected';

export interface School {
  id: string;
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  level: string;
  type:string;
  numberOfStudents?: number;
  subscription: string;
  region: string;
  district?: string;
  sector: string;
  cell: string;
  village: string;
  // Part 2: Headmaster Information
  headmasterName: string;
  headmasterEmail: string;
  headmasterPhone: string;
  // Part 3: Documents
  registrationCertificate: File | null;
  paymentProof: File | null;
  // Metadata
  registrationDate: string;
  status: SchoolStatus;
  rejectionReason?: string;
}

export interface LocationData {
  [region: string]: {
    [district: string]: {
      [sector: string]: {
        [cell: string]: string[];
      };
    };
  };
}

export type UserRole = 'onboarding' | 'compliance';
