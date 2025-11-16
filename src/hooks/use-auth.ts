/**
 * 인증 관련 Hooks
 * 유저 정보를 전역적으로 관리하는 중앙 hook
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "@/lib/api/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
} from "@/lib/api/types";
import { clearGuestMeasurement } from "@/lib/guest-storage";

// Query Key
export const AUTH_QUERY_KEY = ["auth"] as const;

/**
 * 유저 인증 상태 및 정보 조회
 * 모든 페이지에서 사용 가능
 */
export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authAPI.auth,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분
  });

  const user = data?.isAuth ? data : null;
  const isAuthenticated = data?.isAuth ?? false;

  // 유저 정보 무효화 (로그아웃 등에서 사용)
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    refetch,
    invalidate,
  };
}

/**
 * 로그인 Mutation
 */
export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authAPI.login(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("로그인 성공!");
        // 유저 정보 즉시 refetch
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });

        // 비로그인 상태에서 저장한 측정 데이터 삭제
        clearGuestMeasurement();

        // redirect 쿼리 파라미터 확인하여 원래 페이지로 이동
        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get("redirect");
        router.replace(redirectUrl || "/");
      } else {
        toast.error(data.message || "로그인에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "로그인 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 회원가입 Mutation
 */
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authAPI.register(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("회원가입이 완료되었습니다!");
        router.push("/auth?tab=login"); // 로그인 탭으로 이동
      } else {
        toast.error(data.message || "회원가입에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "회원가입 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 로그아웃 Mutation
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout(),
    onSuccess: () => {
      toast.success("로그아웃 되었습니다.");
      // 유저 정보 캐시 삭제
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.clear();
      router.push("/auth");
    },
    onError: (error: any) => {
      toast.error(error.message || "로그아웃 중 오류가 발생했습니다.");
    },
  });
}

/**
 * 프로필 업데이트 Mutation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authAPI.updateProfile(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("프로필이 업데이트되었습니다!");
        // 유저 정보 refetch
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      } else {
        toast.error(data.message || "프로필 업데이트에 실패했습니다.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "프로필 업데이트 중 오류가 발생했습니다.");
    },
  });
}
