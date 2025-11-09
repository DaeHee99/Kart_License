/**
 * API 타입 정의
 */

// 공통 응답 타입
export interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// 유저 타입
export interface User {
  _id: string;
  name: string;
  id: string;
  image?: string;
  license: string;
  role: number;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth 관련 타입
export interface LoginRequest {
  id: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  userId?: string;
  name?: string;
  message?: string;
}

export interface RegisterRequest {
  name: string;
  id: string;
  password: string;
  plainPassword: string;
  image?: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

export interface AuthResponse {
  _id: string;
  isAuth: boolean;
  name: string;
  image?: string;
  license: string;
  role: number;
  isAdmin: boolean;
  message?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  password?: string;
  image?: string;
}
