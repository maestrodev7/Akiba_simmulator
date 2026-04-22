export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthData {
  token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  data: AuthData;
  message: string;
}

export interface AuthInfo {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
}
