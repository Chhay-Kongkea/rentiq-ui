export interface SubmitKycRequest {
  nationalIdNumber: string;
  nationalIdType: string;
  nationalIdCountry?: string;
}

export interface KycResponse extends SubmitKycRequest {
  id: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  phoneNumber?: string;
  emailVerified?: boolean;
  verificationStatus?: string;
  rejectionReason?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KycSubmission {
  data: SubmitKycRequest;
  frontImage?: File;
  backImage?: File;
}