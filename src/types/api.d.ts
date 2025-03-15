declare module "*/services/apiService" {
  export interface User {
    email: string;
    name: string;
    token?: string;
  }

  export interface LoginResponse {
    user: User;
    token: string;
  }

  export function registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<void>;
  export function loginUser(
    email: string,
    password: string
  ): Promise<LoginResponse>;
  export function getCurrentUser(): Promise<User>;
  export function changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void>;
  export function logoutUser(): Promise<boolean>;
}
