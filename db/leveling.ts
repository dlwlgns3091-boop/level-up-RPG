export function xpForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/**
 * XP를 추가하면서 누적 레벨업을 처리한다.
 * 입력 character는 변경하지 않고 새 객체를 반환한다.
 */
export function applyXpGain(params: {
  level: number;
  current_xp: number;
  xp_to_add: number;
}): {
  level: number;
  current_xp: number;
  levels_gained: number;
} {
  let level = params.level;
  let current_xp = params.current_xp + params.xp_to_add;
  let levels_gained = 0;

  while (current_xp >= xpForNextLevel(level)) {
    current_xp -= xpForNextLevel(level);
    level += 1;
    levels_gained += 1;
  }

  return { level, current_xp, levels_gained };
}
