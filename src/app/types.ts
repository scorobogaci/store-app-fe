export type Nullable<T> = T | null;

export interface CompaniesResponse {
  companies: string[]
}

export interface AddUserRequest {
  email: string;
  username: string;
  company: string;
  isNewCompany: boolean;
  isCompanyAdministrator: boolean;
}

export interface AddUserResponse {
  success: boolean;
  errorMessage: string;
}

export interface DeleteFileRequest {
  key: string
}

export interface DeleteFileResponse {
  success: boolean;
  errorMessage: string;
}

export interface GetCompanyFilesResponse {
  companyFiles: File[]
}

export interface File {
  key: string;
  name: string;
  type: string;
  size: number;
  uploadTime: string;
}
