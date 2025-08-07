import {
  ApiResponse,
  AuthResponse,
  UserProfile,
  UserProfileExtended,
  SignUpRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ScoreSubmission,
  ScoreResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  SignUpResponse,
  ConfirmEmailRequest,
  ConfirmEmailResponse,
} from "../types";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://r16dlxvgpd.execute-api.us-east-1.amazonaws.com";

class ApiService {
  private baseURL: string;
  private onTokenExpired?: () => void;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setTokenExpiredCallback(callback: () => void) {
    this.onTokenExpired = callback;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("accessToken");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          console.log("Token expired, redirecting to login");
          this.onTokenExpired?.();
          return {
            success: false,
            error: "Session expired. Please log in again.",
          };
        }
        throw new Error(data.error || "An error occurred");
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  }

  // Authentication endpoints
  async signUp(data: SignUpRequest): Promise<ApiResponse<SignUpResponse>> {
    try {
      const url = `${this.baseURL}/auth/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: Sign up failed`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign up failed",
      };
    }
  }

  async confirmEmail(
    data: ConfirmEmailRequest
  ): Promise<ApiResponse<ConfirmEmailResponse>> {
    try {
      const url = `${this.baseURL}/auth/confirm`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Email confirmation failed`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Email confirmation failed",
      };
    }
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const url = `${this.baseURL}/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: Login failed`
        );
      }

      const result = await response.json();

      // The API returns the tokens directly, not wrapped in a success field
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const url = `${this.baseURL}/auth/forgot-password`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to send reset code`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to send reset code",
      };
    }
  }

  async resetPassword(
    data: ResetPasswordRequest
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const url = `${this.baseURL}/auth/reset-password`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: Failed to reset password`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to reset password",
      };
    }
  }

  async changePassword(
    data: ChangePasswordRequest
  ): Promise<ApiResponse<ChangePasswordResponse>> {
    try {
      const url = `${this.baseURL}/auth/change-password`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          console.log("Token expired, redirecting to login");
          this.onTokenExpired?.();
          return {
            success: false,
            error: "Session expired. Please log in again.",
          };
        }

        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to change password`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to change password",
      };
    }
  }

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const url = `${this.baseURL}/auth/me`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          console.log("Token expired, redirecting to login");
          this.onTokenExpired?.();
          return {
            success: false,
            error: "Session expired. Please log in again.",
          };
        }

        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to fetch user profile`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch user profile",
      };
    }
  }

  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<ApiResponse<UpdateProfileResponse>> {
    try {
      const url = `${this.baseURL}/auth/update-profile`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          console.log("Token expired, redirecting to login");
          this.onTokenExpired?.();
          return {
            success: false,
            error: "Session expired. Please log in again.",
          };
        }

        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: Failed to update profile`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update profile",
      };
    }
  }

  async updateUserProfile(
    data: Partial<UserProfileExtended>
  ): Promise<ApiResponse<UserProfileExtended>> {
    return this.request<UserProfileExtended>("/user/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getConfirmationCode(): Promise<ApiResponse<{ code: string }>> {
    return this.request<{ code: string }>("/auth/confirmation-code");
  }

  // Score endpoints
  async submitScore(
    data: ScoreSubmission
  ): Promise<ApiResponse<ScoreResponse>> {
    try {
      const url = `${this.baseURL}/scores`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          console.log("Token expired, redirecting to login");
          this.onTokenExpired?.();
          return {
            success: false,
            error: "Session expired. Please log in again.",
          };
        }

        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP ${response.status}: Failed to submit score`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to submit score",
      };
    }
  }

  async getTopScore(): Promise<ApiResponse<ScoreResponse>> {
    try {
      const url = `${this.baseURL}/scores/top`;
      const token = localStorage.getItem("accessToken");

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        // Handle token expiration
        if (response.status === 401) {
          console.log("Token expired, redirecting to login");
          this.onTokenExpired?.();
          return {
            success: false,
            error: "Session expired. Please log in again.",
          };
        }

        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to fetch top score`
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch top score",
      };
    }
  }
}

export const apiService = new ApiService(API_BASE_URL);
