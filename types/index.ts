export type SchoolStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface School {
  id: string;
  school_id?: string;
  school_name: string;
  school_email: string;
  school_phone: string;
  status: SchoolStatus;
  isActive: boolean;
  level: string;
  school_type: string;
  number_of_students?: number;
  number_of_teachers?: number;
  subscription: string;
  subscription_year?: string;
  activation_date: string;
  province: string;
  district?: string;
  sector: string;
  cell: string;
  village: string;
  // Part 2: Headmaster Information
  headmaster_name: string;
  headmaster_email: string;
  headmaster_phone: string;
  // Part 3: Documents
  registration_certificate?: File | string | null;
  payment_proof?: File | string | null;
  invoice?: File | string | null;
  other_documents?: File | string | null;
  // Metadata
  registration_date: string;
  rejection_reason?: string;
  reject_message?: string;
  created_at?: string;
  updated_at?: string;
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

export type UserRole = 'onboarding' | 'compliance' | 'admin' | 'superadmin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'onboarding' | 'compliance' | 'admin';
  status: 'Active' | 'Inactive';
  createdDate: string;
  createdBy?: string;
}