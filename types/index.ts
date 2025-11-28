//school promps
export interface SchoolProps {
  id: string;
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
  type: string;
  district: string;
  province: string;
  numberOfStudents: number;
  numberOfTeachers: number;
  subscriptionYear: number;
  registrationCertificate: File | null;
  schoolLicense: File | null;
  otherDocuments: File | null;
  invoice: File | null;
  status: string;
}

// table prompts

export interface SchoolTableProps {
  id: string;
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolAddress: string;
  type: string;
  district: string;
  province: string;
  numberOfStudents: number;
  numberOfTeachers: number;
  subscriptionYear: number;
  registrationCertificate: File | null;
  schoolLicense: File | null;
  otherDocuments: File | null;
  invoice: File | null;
  status: string;
}
