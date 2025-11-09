/**
 * Auth API 함수들
 */

import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  AuthResponse,
  UpdateProfileRequest,
  APIResponse,
} from "./types";

const API_BASE = "/api/user";

export const authAPI = {
  // 회원가입
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient<RegisterResponse>(`${API_BASE}/register`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // 로그인
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient<LoginResponse>(`${API_BASE}/login`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // 인증 확인 (유저 정보 가져오기)
  auth: async (): Promise<AuthResponse> => {
    return apiClient<AuthResponse>(`${API_BASE}/auth`, {
      method: "GET",
    });
  },

  // 로그아웃
  logout: async (): Promise<APIResponse> => {
    return apiClient<APIResponse>(`${API_BASE}/logout`, {
      method: "GET",
    });
  },

  // 유저 정보 수정
  updateProfile: async (data: UpdateProfileRequest): Promise<APIResponse> => {
    return apiClient<APIResponse>(`${API_BASE}/update`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};
