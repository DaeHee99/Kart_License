/**
 * 로그 액션 타입 enum (클라이언트/서버 양쪽에서 안전하게 사용 가능)
 *
 * NOTE: log.service.ts는 mongoose / bcrypt 같은 서버 전용 의존성을 포함하므로
 *       클라이언트 컴포넌트에서 직접 import하면 번들 에러가 발생한다.
 *       enum만 분리하여 이 모듈에서 import해 사용한다.
 */
export enum LogActionType {
  // Authentication
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",
  WITHDRAW = "WITHDRAW",

  // Measurement
  MEASUREMENT_COMPLETE = "MEASUREMENT_COMPLETE",

  // Community Posts
  POST_CREATE = "POST_CREATE",
  POST_EDIT = "POST_EDIT",
  POST_DELETE = "POST_DELETE",

  // Community Comments
  COMMENT_CREATE = "COMMENT_CREATE",
  COMMENT_EDIT = "COMMENT_EDIT",
  COMMENT_DELETE = "COMMENT_DELETE",

  // Share & Download
  KAKAO_SHARE_RESULT = "KAKAO_SHARE_RESULT",
  KAKAO_SHARE_POST = "KAKAO_SHARE_POST",
  QR_DOWNLOAD_RESULT = "QR_DOWNLOAD_RESULT",
  QR_DOWNLOAD_POST = "QR_DOWNLOAD_POST",
  LINK_COPY_RESULT = "LINK_COPY_RESULT",
  LINK_COPY_POST = "LINK_COPY_POST",
  IMAGE_DOWNLOAD = "IMAGE_DOWNLOAD",

  // User Profile
  NICKNAME_UPDATE = "NICKNAME_UPDATE",
  PASSWORD_UPDATE = "PASSWORD_UPDATE",
  PROFILE_PICTURE_UPDATE = "PROFILE_PICTURE_UPDATE",

  // Admin Actions
  ADMIN_PASSWORD_RESET = "ADMIN_PASSWORD_RESET",

  // Feedback
  FEEDBACK_SUBMIT = "FEEDBACK_SUBMIT",
}
