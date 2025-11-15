# Kart License Codebase - Comprehensive Exploration Report

## Executive Summary

This is a Next.js web application for a Kart License measurement system with community features. The application tracks user measurements across different maps (races), calculates tier rankings, and includes social features like community posts and comments. Built with TypeScript, React, and MongoDB.

---

## 1. ALL PAGES (App Router Structure)

### Core Pages

| Path | File | Functionality |
|------|------|---------------|
| `/` | `src/app/page.tsx` | Home page with hero section, user profile card, tier introduction, recent measurements, and announcements |
| `/auth` | `src/app/auth/page.tsx` | Authentication page with login/signup tabs |
| `/measure` | `src/app/measure/page.tsx` | Main measurement input flow (select method → input → confirm) |
| `/result` | `src/app/result/page.tsx` | Loading screen for measurement results |
| `/result/[id]` | `src/app/result/[id]/page.tsx` | Detailed result page with tier reveal, user info, statistics, and action buttons (share, download QR, view stats) |
| `/records` | `src/app/records/page.tsx` | User records/history table with viewing and filtering options |
| `/community` | `src/app/community/page.tsx` | Community feed with infinite scroll, search, and category filtering |
| `/community/[id]` | `src/app/community/[id]/page.tsx` | Detailed community post with comments (create/edit/delete) and share functionality |
| `/statistics` | `src/app/statistics/page.tsx` | Global statistics dashboard with overview and filtered tabs |
| `/mypage` | `src/app/mypage/page.tsx` | User profile page with edit profile view and tabs for user data |
| `/userpage/[id]` | `src/app/userpage/[id]/page.tsx` | Public user profile page showing user's records and tier |
| `/admin` | `src/app/admin/page.tsx` | Admin dashboard with user management, measurement logs, feedback, and map data initialization |

---

## 2. ALL API ENDPOINTS

### Authentication Routes

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/user/login` | POST | `src/app/api/user/login/route.ts` | User login with credentials, returns JWT token in HTTP-only cookie |
| `/api/user/register` | POST | `src/app/api/user/register/route.ts` | User registration with name, id, password, optional profile image |
| `/api/user/logout` | POST | `src/app/api/user/logout/route.ts` | User logout, clears authentication token |
| `/api/user/auth` | GET | `src/app/api/user/auth/route.ts` | Check current user authentication status and retrieve user info |
| `/api/user/update` | PATCH | `src/app/api/user/update/route.ts` | Update user profile (name, password, profile picture) |

### User Management Routes

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/user/[id]` | GET | `src/app/api/user/[id]/route.ts` | Get specific user details by ID |
| `/api/user/manager/all` | GET | `src/app/api/user/manager/all/route.ts` | Admin: Get all users (pagination) |
| `/api/user/manager/[page]` | GET | `src/app/api/user/manager/[page]/route.ts` | Admin: Get users by page number |
| `/api/user/manager/find/[name]` | GET | `src/app/api/user/manager/find/[name]/route.ts` | Admin: Search users by name |
| `/api/users/[id]` | GET | `src/app/api/users/[id]/route.ts` | Get public user profile information |
| `/api/mypage/data` | GET | `src/app/api/mypage/data/route.ts` | Get current user's profile data for my page |

### Records Routes

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/records` | POST | `src/app/api/records/route.ts` | Save user's measurement record with maps and tier calculations |
| `/api/records` | GET | `src/app/api/records/route.ts` | Get all records with pagination and filtering |
| `/api/records/[id]` | GET | `src/app/api/records/[id]/route.ts` | Get specific record by ID with full details |
| `/api/records/latest` | GET | `src/app/api/records/latest/route.ts` | Get latest record (for current season) |
| `/api/records/recent` | GET | `src/app/api/records/recent/route.ts` | Get recent records (global feed) |
| `/api/records/user/[userId]` | GET | `src/app/api/records/user/[userId]/route.ts` | Get user's records (paginated) |
| `/api/records/statistics` | GET | `src/app/api/records/statistics/route.ts` | Get statistics for all records |
| `/api/records/statistics/users` | GET | `src/app/api/records/statistics/users/route.ts` | Get per-user statistics |

### Community Posts Routes

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/posts` | GET | `src/app/api/posts/route.ts` | Get posts with pagination, category filtering, and search |
| `/api/posts` | POST | `src/app/api/posts/route.ts` | Create new community post (requires authentication) |
| `/api/posts/[id]` | GET | `src/app/api/posts/[id]/route.ts` | Get specific post details |
| `/api/posts/[id]` | PUT | `src/app/api/posts/[id]/route.ts` | Update/edit post (author or admin only) |
| `/api/posts/[id]` | DELETE | `src/app/api/posts/[id]/route.ts` | Delete post (author or admin only) |

### Comments Routes

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/posts/[id]/comments` | GET | `src/app/api/posts/[id]/comments/route.ts` | Get all comments for a post |
| `/api/posts/[id]/comments` | POST | `src/app/api/posts/[id]/comments/route.ts` | Create comment on post (requires authentication) |
| `/api/comments/[id]` | PUT | `src/app/api/comments/[id]/route.ts` | Update/edit comment (author or admin only) |
| `/api/comments/[id]` | DELETE | `src/app/api/comments/[id]/route.ts` | Delete comment (author or admin only) |

### Feedback Routes

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/feedback` | POST | `src/app/api/feedback/route.ts` | Submit feedback on season (difficulty, balance, review) |
| `/api/feedback` | GET | `src/app/api/feedback/route.ts` | Get user's feedback for specific season |
| `/api/feedback/statistics` | GET | `src/app/api/feedback/statistics/route.ts` | Get feedback statistics by season |

### Map Data Routes

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/maps/init` | POST | `src/app/api/maps/init/route.ts` | Admin: Initialize/update season map data |
| `/api/maps/latest` | GET | `src/app/api/maps/latest/route.ts` | Get current season's map data |

### Statistics Routes

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/statistics/summary` | GET | `src/app/api/statistics/summary/route.ts` | Get overall statistics summary |

### Announcement Routes

| Endpoint | Method | File | Purpose |
|----------|--------|------|---------|
| `/api/announcements` | GET | `src/app/api/announcements/route.ts` | Get announcements for home page modal |

---

## 3. KEY USER ACTION POINTS THAT NEED LOGGING

### Authentication Flow

1. **User Registration** ✓ Already Logged
   - Location: `UserService.register()` in `/src/lib/services/user.service.ts` (lines 27-54)
   - Log Content: "회원가입 완료" (Registration completed)
   - Implementation: Saves Log document after user creation

2. **User Login**
   - Location: `/api/user/login/route.ts` 
   - **Status: NOT LOGGED** - Should add logging here
   - Action Point: After successful login with token generation
   - Log Content: "로그인" (Login)

3. **User Logout**
   - Location: `/api/user/logout/route.ts`
   - **Status: NOT LOGGED** - Should add logging here
   - Action Point: When user clears authentication
   - Log Content: "로그아웃" (Logout)

### Measurement Operations

4. **Measurement Completion** ✓ Should be Logged
   - Location: `/api/records/route.ts` (POST endpoint, lines 11-65)
   - Action Point: After `recordService.saveRecord()` completes
   - Log Content: Format: "시즌 [season] 측정 완료 - 최종 군: [finalTier]"
   - Recommendation: Add logging in record.service.ts post-save hook

### Community Posts CRUD

5. **Create Community Post**
   - Location: `/api/posts/route.ts` (POST, lines 53-137)
   - **Status: NOT LOGGED** - Should add logging here
   - Action Point: After `postService.createPost()` succeeds
   - Log Content: "게시글 작성 - [title] (카테고리: [category])"
   - User Context: `authResult.user._id` available

6. **Edit Community Post**
   - Location: `/api/posts/[id]/route.ts` (PUT, lines 56-125)
   - **Status: NOT LOGGED** - Should add logging here
   - Action Point: After `postService.updatePost()` succeeds
   - Log Content: "게시글 수정 - [postId]"
   - User Context: `authResult.user._id` available

7. **Delete Community Post**
   - Location: `/api/posts/[id]/route.ts` (DELETE, lines 131-197)
   - **Status: NOT LOGGED** - Should add logging here
   - Action Point: After `postService.deletePost()` succeeds
   - Log Content: "게시글 삭제 - [postId]"
   - User Context: `authResult.user._id` available

### Community Comments CRUD

8. **Create Comment**
   - Location: `/api/posts/[id]/comments/route.ts` (POST, lines 46-119)
   - **Status: NOT LOGGED** - Should add logging here
   - Action Point: After `commentService.createComment()` succeeds
   - Log Content: "댓글 작성 - 게시글 [postId]"
   - User Context: `authResult.user._id` available

9. **Edit Comment**
   - Location: `/api/comments/[id]/route.ts` (PUT, lines 10-95)
   - **Status: NOT LOGGED** - Should add logging here
   - Action Point: After `commentService.updateComment()` succeeds
   - Log Content: "댓글 수정 - [commentId]"
   - User Context: `authResult.user._id` available

10. **Delete Comment**
    - Location: `/api/comments/[id]/route.ts` (DELETE, lines 101-167)
    - **Status: NOT LOGGED** - Should add logging here
    - Action Point: After `commentService.deleteComment()` succeeds
    - Log Content: "댓글 삭제 - [commentId]"
    - User Context: `authResult.user._id` available

### User Profile Updates ✓ Already Logged

11. **Update Profile (Nickname, Password, Profile Picture)**
    - Location: `UserService.updateProfile()` in `/src/lib/services/user.service.ts` (lines 108-166)
    - **Status: PARTIALLY LOGGED** ✓
    - Log Content: Dynamically builds array of changes:
      - "닉네임 변경 (oldName -> newName)"
      - "비밀번호 변경"
      - "프로필 사진 변경"
    - Saves combined log after user update

### User Interaction Events

12. **Kakao Share Functionality**
    - Location: `/src/app/result/[id]/_components/share-content.tsx` (lines 139-180)
    - **Status: NOT LOGGED** - Toast shown but not logged
    - Action Point: In `handleKakaoShare()` function
    - Log Content: "카카오톡 공유 - [recordId]"
    - User Context: Can extract from `user._id` in props

13. **QR Code Download**
    - Location: `/src/app/result/[id]/_components/share-content.tsx` (lines 115-137)
    - **Status: NOT LOGGED** - Toast shown but not logged
    - Action Point: In `downloadQRCard()` function
    - Log Content: "QR 카드 다운로드 - [recordId]"
    - User Context: Can extract from `user._id` in props

14. **Link Copy (Share Link)**
    - Location: `/src/app/result/[id]/_components/share-content.tsx` (lines 103-113)
    - **Status: NOT LOGGED** - Toast shown but not logged
    - Action Point: In `handleCopyLink()` function
    - Log Content: "결과 링크 복사 - [recordId]"
    - User Context: Can extract from `user._id` in props

### Feedback Submission

15. **Feedback Submission**
    - Location: `/api/feedback/route.ts` (POST, lines 9-76)
    - **Status: NOT LOGGED** - Should add logging here
    - Action Point: After `feedbackService.saveFeedback()` succeeds
    - Log Content: "피드백 제출 - 시즌 [season] (난이도: [level], 밸런스: [balance])"
    - User Context: `userId` from request body

### Page Navigation Events

16. **Bottom Navigation Clicks (Vibration)**
    - Location: `/src/components/bottom-navigation.tsx` (lines 18-23)
    - **Status: VIBRATION TRIGGERED** ✓ (10ms vibrate)
    - Already implements `navigator.vibrate(10)` on navigation click
    - Could add page view events via Google Analytics (already configured)

---

## 4. CURRENT AUTHENTICATION/USER CONTEXT IMPLEMENTATION

### Authentication Architecture

**Authentication Method:** JWT Token (HTTP-only Cookies)

**Key Files:**
- `/src/lib/middleware/auth.ts` - Authentication middleware
- `/src/lib/api/auth.ts` - Auth API client
- `/src/hooks/use-auth.ts` - Auth React hook
- `/src/lib/services/user.service.ts` - User business logic

### Authentication Flow

```
Registration/Login → Token Generation → HTTP-only Cookie → Middleware Validation
```

**Registration:**
1. POST `/api/user/register` → `UserService.register()`
2. Creates User document with hashed password
3. Creates Log entry with "회원가입 완료"
4. Returns success status

**Login:**
1. POST `/api/user/login` → `UserService.login()`
2. Verifies credentials with `user.comparePassword()`
3. Generates JWT token via `user.generateToken()`
4. Sets HTTP-only cookie: `token` (maxAge: 30 days)
5. Returns userId and userName

**User Context (React):**
```typescript
// Hook: useAuth() - Query-based auth state
export function useAuth() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authAPI.auth,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5min cache
  });
  
  return {
    user,          // User object if authenticated
    isAuthenticated,
    isLoading,
    error,
    refetch,
    invalidate     // Manual invalidation (logout)
  };
}
```

**User Model Interface:**
```typescript
interface IUser {
  name: string;              // Nickname (max 16 chars)
  id: string;                // Username for login
  password: string;          // Hashed
  plainPassword: string;     // Plaintext (backup)
  image?: string;            // Profile picture URL
  license: string;           // Current tier (강주력, 주력, 1군, etc.)
  role: number;              // 0: User, 1: Operator, 2: Admin
  token?: string;            // JWT token
  tokenExp?: number;         // Token expiration
  authCount: number;         // Auth count
  recentSurvey: number;      // Last survey/feedback season
  createdAt: Date;
  updatedAt: Date;
}
```

**Protected Route Pattern:**
- All post/put/delete endpoints call `authenticateUser()`
- Extracts and validates token from cookies
- Returns: `{ isAuth: boolean, user: User | null }`
- 401 response if not authenticated

---

## 5. EXISTING LOGGING & ANALYTICS IMPLEMENTATIONS

### Logging System

**Database Model:** `Log` (MongoDB)

**Location:** `/src/lib/db/models/log.model.ts`

**Schema:**
```typescript
interface ILog extends Document {
  user: mongoose.Types.ObjectId;  // Reference to User
  content: string;                 // Log content/action description
  createdAt: Date;
  updatedAt: Date;
}
```

**Currently Logged Actions:**

| Action | Location | Log Content |
|--------|----------|-------------|
| User Registration | `UserService.register()` | "회원가입 완료" |
| Nickname Change | `UserService.updateProfile()` | "닉네임 변경 (old -> new)" |
| Password Change | `UserService.updateProfile()` | "비밀번호 변경" |
| Profile Picture Change | `UserService.updateProfile()` | "프로필 사진 변경" |

**Not Currently Logged:**
- Login/Logout
- Measurement creation
- Post/Comment CRUD operations
- Kakao share events
- QR download/copy events
- Feedback submission
- Page navigation

### Google Analytics Implementation

**Status:** ✓ Implemented (Production only)

**Tracking ID:** `G-SJV5D5CLXQ`

**Files:**
- `/src/lib/gtag.ts` - GA utility functions
- `/src/components/analytics.tsx` - GA script loader
- `/src/components/page-view-tracker.tsx` - Page view tracking

**Features:**

1. **Page View Tracking:**
   - Automatically tracks pathname changes
   - Sends to GA with page title
   - Debounced with 100ms delay
   - Uses MutationObserver for title changes

2. **Event Tracking:**
   ```typescript
   export const event = ({
     action: string,
     category: string,
     label?: string,
     value?: number,
   }) => {
     window.gtag("event", action, {
       event_category: category,
       event_label: label,
       value: value,
     });
   }
   ```

3. **Implementation Details:**
   - Only loads in production (`NODE_ENV === "production"`)
   - Uses Next.js Script component with `afterInteractive` strategy
   - Integrity attribute for security
   - CORS anonymous for cross-origin

**Current Event Tracking:**
- Limited - mainly automatic pageview tracking
- No explicit business event logging yet

---

## 6. TECHNICAL ARCHITECTURE SUMMARY

### Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Frontend:** React 18, Tailwind CSS, Motion (animations)
- **Database:** MongoDB with Mongoose ODM
- **State Management:** TanStack React Query
- **Auth:** JWT (HTTP-only cookies)
- **Payments/Integration:** Kakao Share API, Google Analytics
- **UI Components:** shadcn/ui
- **Code Generation:** QRCode (qrcode.react)

### Database Models

1. **User** - User accounts and profiles
2. **Record** - Measurement results with tier distribution
3. **Post** - Community posts with categories
4. **Comment** - Community post comments
5. **Feedback** - Season feedback submissions
6. **Log** - User action logs
7. **MapData** - Season-specific map information
8. **Announcement** - Home page announcements

### Services Layer

- `UserService` - Auth, profile management
- `RecordService` - Measurement records
- `PostService` - Community posts
- `CommentService` - Post comments
- `FeedbackService` - Season feedback

---

## 7. RECOMMENDATIONS FOR LOGGING ENHANCEMENTS

### High Priority

1. **Add Login/Logout Logging**
   - Log successful login attempts
   - Log logout actions
   - Could track login frequency/patterns

2. **Add Measurement Completion Logging**
   - Log when user completes measurement
   - Include final tier and season
   - Useful for engagement metrics

3. **Add Community Action Logging**
   - Track post/comment creation, edits, deletions
   - Monitor community activity
   - Detect spam/abuse patterns

4. **Add Share Event Logging**
   - Kakao Share clicks
   - QR code downloads
   - Link copies
   - Valuable for viral/referral metrics

### Medium Priority

5. **Add Feedback Submission Logging**
   - Track feedback submission patterns
   - Monitor user satisfaction trends

6. **Structured Log Format**
   - Consider adding action type field to Log model
   - Add metadata (IP, device, user agent)
   - Improve queryability and analysis

### Implementation Pattern

Current logging uses the pattern:
```typescript
const log = new Log({
  user: userId,
  content: "Action description"
});
await log.save();
```

**Better Pattern:**
```typescript
await LogService.log({
  userId: userId,
  actionType: "LOGIN",      // Enum
  actionDescription: "로그인",
  metadata: {
    ip: request.ip,
    userAgent: request.headers.get('user-agent'),
    recordId?: recordId,     // Context-specific
  }
});
```

---

## 8. FILES REFERENCE

### Core Application Files

**Pages:**
- `/src/app/page.tsx` - Home
- `/src/app/auth/page.tsx` - Auth
- `/src/app/measure/page.tsx` - Measurement input
- `/src/app/result/[id]/page.tsx` - Result detail
- `/src/app/community/[id]/page.tsx` - Post detail
- `/src/app/mypage/page.tsx` - User profile
- `/src/app/admin/page.tsx` - Admin dashboard

**API Routes:** (26 total)
- `/src/app/api/user/*` - Authentication and user management
- `/src/app/api/posts/*` - Community posts
- `/src/app/api/records/*` - Measurement records
- `/src/app/api/feedback/*` - Feedback
- `/src/app/api/maps/*` - Map data
- `/src/app/api/statistics/*` - Statistics
- `/src/app/api/comments/*` - Comments
- `/src/app/api/announcements/*` - Announcements

**Database Models:**
- `/src/lib/db/models/user.model.ts`
- `/src/lib/db/models/record.model.ts`
- `/src/lib/db/models/post.model.ts`
- `/src/lib/db/models/comment.model.ts`
- `/src/lib/db/models/feedback.model.ts`
- `/src/lib/db/models/log.model.ts`
- `/src/lib/db/models/announcement.model.ts`
- `/src/lib/db/models/map-data.model.ts`

**Services:**
- `/src/lib/services/user.service.ts`
- `/src/lib/services/record.service.ts`
- `/src/lib/services/post.service.ts`
- `/src/lib/services/comment.service.ts`
- `/src/lib/services/feedback.service.ts`

**Hooks:**
- `/src/hooks/use-auth.ts` - Authentication state
- `/src/hooks/use-posts.ts` - Community posts queries
- `/src/hooks/use-records.ts` - Records queries
- `/src/hooks/use-feedback.ts` - Feedback queries

---

## Conclusion

This is a well-structured full-stack Next.js application with a comprehensive set of features. The current logging implementation is minimal but functional for critical auth events. The recommendation is to expand logging to cover all user actions, particularly community interactions and sharing features, to enable better analytics, debugging, and user engagement tracking.

