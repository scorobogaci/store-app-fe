export type Nullable<T> = T | null;

export interface CompaniesResponse {
  companies: Company[]
}

export interface Company {
  name: string;
  alias: string;
}

export interface AddUserRequest {
  email: string;
  companyAlias: string;
  isNewCompany: boolean;
  isCompanyAdministrator: boolean;
  companyIdentifier: string;
  username: string;
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
  markedForDelete: boolean;
}
