import { User, AuthResponse } from "../types";
import { apiService } from "./api";

class AuthService {
  private user: User | null = null;
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("idToken");
    this.user = this.getUserFromStorage();
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  private setAuthData(response: AuthResponse): void {
    console.log("Setting auth data:", response);
    this.token = response.idToken;
    localStorage.setItem("idToken", response.idToken);
    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("tokenType", response.tokenType);
    localStorage.setItem("expiresIn", response.expiresIn.toString());
  }

  private clearAuthData(): void {
    this.user = null;
    this.token = null;
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("user");
  }

  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log("Attempting login for:", email);
      const response = await apiService.login({ email, password });
      console.log("Login response:", response);

      if (response.success && response.data) {
        console.log("Login successful, setting auth data");
        this.setAuthData(response.data);
        return { success: true };
      } else {
        console.log("Login failed:", response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  async signUp(userData: {
    email: string;
    username: string;
    password: string;
    name: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.signUp(userData);
      if (response.success) {
        // Don't automatically set auth data - user should log in explicitly
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Sign up failed",
      };
    }
  }

  async confirmEmail(
    email: string,
    confirmationCode: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.confirmEmail({
        email,
        confirmationCode,
      });
      return { success: response.success, error: response.error };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Email confirmation failed",
      };
    }
  }

  async forgotPassword(
    email: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.forgotPassword({ email });
      return { success: response.success, error: response.error };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Forgot password failed",
      };
    }
  }

  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.resetPassword({
        email,
        code,
        newPassword,
      });
      return { success: response.success, error: response.error };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Reset password failed",
      };
    }
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await apiService.changePassword({
        oldPassword,
        newPassword,
      });
      return { success: response.success, error: response.error };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Change password failed",
      };
    }
  }

  logout(): void {
    this.clearAuthData();
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  updateUser(user: User): void {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export const authService = new AuthService();
