export type Nullable<T> = T | null;

export interface CompaniesResponse {
  companies: string[]
}

export interface AddUserRequest {
  email: string;
  username: string
  company: string
  isNewCompany: boolean
  isCompanyAdministrator: boolean
}

export interface AddUserResponse {
  success: boolean
  errorMessage: string
}
