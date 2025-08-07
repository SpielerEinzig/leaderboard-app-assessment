// User related types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserAttributes {
  email: string;
  email_verified: string;
  preferred_username: string;
  name: string;
  sub: string;
}

export interface UserProfile {
  username: string;
  attributes: UserAttributes;
}

export interface UserProfileExtended {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  bio?: string;
  dateOfBirth?: string;
  location?: string;
  website?: string;
}

// Profile update types
export interface UpdateProfileRequest {
  name: string;
  preferred_username: string;
}

export interface UpdateProfileResponse {
  message: string;
}

// Change password types
export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

// Score types
export interface ScoreSubmission {
  score: number;
}

export interface ScoreResponse {
  id: string;
  user_id: string;
  user_name: string;
  score: number;
  timestamp: number;
}

// Authentication types
export interface SignUpRequest {
  email: string;
  username: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface SignUpResponse {
  message: string;
  userSub: string;
}

export interface ConfirmEmailRequest {
  email: string;
  confirmationCode: string;
}

export interface ConfirmEmailResponse {
  message: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Form types
export interface FormField {
  value: string;
  error?: string;
  touched: boolean;
}

export interface FormState {
  [key: string]: FormField;
}

// Navigation types
export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  protected?: boolean;
}

// Common types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}
