export type UserType = 'student' | 'fresher' | 'professional'

export interface AuthUser {
  _id: string
  email: string
  userType: UserType
  name?: string
  onboardingCompleted: boolean
  authProvider?: string
  status?: string
}

export interface SendOtpResponse {
  success: boolean
  message: string
}

export interface SignupPayload {
  email: string
  password: string
  userType: UserType
  otp: string
}

export interface SignupResponse {
  message: string
  user: AuthUser
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  token: string
  user: AuthUser
}

export interface MeResponse {
  user: AuthUser | null
}



