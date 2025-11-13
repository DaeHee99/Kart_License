/**
 * server-asis mapData.js 데이터를 새로운 형식으로 변환하는 유틸리티
 */

interface OldMapData {
  name: string;
  record: string[]; // 7개 요소: [elite, master, diamond, platinum, gold, silver, bronze]
  image: string;
}

interface NewMapData {
  name: string;
  difficulty: "루키" | "L3" | "L2" | "L1";
  imageUrl: string;
  tierRecords: {
    elite: string;
    master: string;
    diamond: string;
    platinum: string;
    gold: string;
    silver: string;
    bronze: string;
  };
}

/**
 * 맵 난이도 정보
 * server-asis/mapData.js의 mapCount 기준
 * - Rookie: 8개 (0-7)
 * - L3: 27개 (8-34)
 * - L2: 30개 (35-64)
 * - L1: 13개 (65-77)
 */
const mapDifficultyRanges = {
  Rookie: { start: 0, count: 8 },
  L3: { start: 8, count: 27 },
  L2: { start: 35, count: 30 },
  L1: { start: 65, count: 13 },
};

/**
 * 인덱스를 기반으로 맵 난이도 결정
 */
function getMapDifficulty(index: number): "루키" | "L3" | "L2" | "L1" {
  if (index < 8) return "루키";
  if (index < 35) return "L3";
  if (index < 65) return "L2";
  return "L1";
}

/**
 * 이미지 파일명을 URL로 변환
 * 실제 이미지 경로에 맞게 수정 필요
 */
function convertImageToUrl(imageName: string): string {
  // TODO: 실제 이미지 호스팅 경로로 변경
  return `/images/maps/${imageName}`;
}

/**
 * 기존 맵 데이터를 새로운 형식으로 변환
 */
export function convertMapData(
  oldMaps: OldMapData[],
  season: number = 35
): {
  season: number;
  maps: NewMapData[];
} {
  const newMaps: NewMapData[] = oldMaps.map((oldMap, index) => {
    return {
      name: oldMap.name,
      difficulty: getMapDifficulty(index),
      imageUrl: convertImageToUrl(oldMap.image),
      tierRecords: {
        elite: oldMap.record[0],
        master: oldMap.record[1],
        diamond: oldMap.record[2],
        platinum: oldMap.record[3],
        gold: oldMap.record[4],
        silver: oldMap.record[5],
        bronze: oldMap.record[6],
      },
    };
  });

  return {
    season,
    maps: newMaps,
  };
}
