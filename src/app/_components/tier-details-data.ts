import { TierType } from "@/lib/types";

export const TIER_DETAILS: Record<
  TierType,
  {
    skillLevel: string;
    percentage: string;
    characteristics: string[];
    tips: string[];
  }
> = {
  elite: {
    skillLevel: "최상위 실력자",
    percentage: "상위 1%",
    characteristics: [
      "모든 맵의 최적 라인 완벽하게 숙지",
      "고급 드리프트 테크닉 완벽 구사",
      "대회 출전 가능 수준의 실력",
      "아이템 운용 및 전략적 판단 탁월",
    ],
    tips: [
      "프로 레이서들의 플레이를 분석하고 학습하세요",
      "대회에 참가하여 실전 경험을 쌓아보세요",
      "커뮤니티에서 다른 플레이어들을 이끌어주세요",
    ],
  },
  master: {
    skillLevel: "고수",
    percentage: "상위 5%",
    characteristics: [
      "대부분의 맵에서 안정적인 주행",
      "고급 드리프트 기술 활용 가능",
      "랭킹전에서 일관된 성적 유지",
      "빠른 상황 판단과 대응",
    ],
    tips: [
      "약점 맵을 집중적으로 연습하세요",
      "최신 업데이트와 메타를 빠르게 익히세요",
      "리플레이를 분석하여 개선점을 찾아보세요",
    ],
  },
  diamond: {
    skillLevel: "숙련자",
    percentage: "상위 15%",
    characteristics: [
      "대부분의 맵에서 준수한 기록",
      "안정적인 드리프트 능력",
      "기본 라인과 지름길 활용",
      "아이템 활용도가 높음",
    ],
    tips: [
      "드리프트 타이밍을 더욱 정교하게 조절하세요",
      "각 맵의 최적 라인을 학습하세요",
      "타임어택으로 기본기를 다지세요",
    ],
  },
  platinum: {
    skillLevel: "중급자",
    percentage: "상위 30%",
    characteristics: [
      "주요 맵에서 안정적인 주행",
      "기본 드리프트 숙달",
      "일반적인 지름길 활용 가능",
      "아이템 기본 운용 이해",
    ],
    tips: [
      "드리프트 연습을 꾸준히 하세요",
      "다양한 맵을 경험해보세요",
      "고수들의 플레이 영상을 참고하세요",
    ],
  },
  gold: {
    skillLevel: "초중급자",
    percentage: "상위 50%",
    characteristics: [
      "기본적인 주행 능력 보유",
      "드리프트 개념 이해 및 연습 중",
      "일부 맵에 대한 이해도",
      "아이템 사용법 학습 중",
    ],
    tips: [
      "기본 드리프트부터 차근차근 익히세요",
      "자주 플레이하는 맵부터 마스터하세요",
      "튜토리얼과 연습 모드를 적극 활용하세요",
    ],
  },
  silver: {
    skillLevel: "초급자",
    percentage: "상위 75%",
    characteristics: [
      "게임 기본 조작 이해",
      "드리프트 학습 초기 단계",
      "맵 구조 파악 중",
      "아이템 효과 학습 중",
    ],
    tips: [
      "조작에 익숙해질 때까지 연습하세요",
      "쉬운 난이도의 맵부터 시작하세요",
      "기본 테크닉 영상을 시청하세요",
    ],
  },
  bronze: {
    skillLevel: "입문자",
    percentage: "하위 25%",
    characteristics: [
      "게임 입문 단계",
      "기본 조작 학습 중",
      "드리프트 개념 익히는 중",
      "다양한 맵과 아이템 체험 중",
    ],
    tips: [
      "천천히 게임에 적응하세요",
      "연습 모드에서 충분히 연습하세요",
      "부담 갖지 말고 즐기면서 플레이하세요",
    ],
  },
};
