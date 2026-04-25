import { vars } from "nativewind";
import type { Palette } from "@/constants/themes";

/**
 * 팔레트를 NativeWind CSS 변수로 변환.
 * 루트 View의 `style={paletteToVars(palette)}`로 깔면 자식의
 * Tailwind 클래스(`bg-bg`, `text-gold` 등)가 런타임에 var()로 해석됨.
 */
export function paletteToVars(p: Palette) {
  return vars({
    "--color-bg": p.bg,
    "--color-bg-soft": p.bgSoft,
    "--color-bg-softer": p.bgSofter,
    "--color-bg-sunken": p.bgSunken,
    "--color-text": p.text,
    "--color-text-muted": p.textMuted,
    "--color-text-subtle": p.textSubtle,
    "--color-gold": p.gold,
    "--color-gold-dark": p.goldDark,
    "--color-gold-soft": p.goldSoft,
    "--color-ink": p.ink,
    "--color-ink-shadow": p.inkShadow,
    "--color-hp": p.hp,
    "--color-mp": p.mp,
    "--color-xp": p.xp,
    "--color-stamina": p.stamina,
    "--color-success": p.success,
    "--color-warning": p.warning,
    "--color-danger": p.danger,
    "--color-info": p.info,
    "--color-rarity-common": p.rarity.common,
    "--color-rarity-uncommon": p.rarity.uncommon,
    "--color-rarity-rare": p.rarity.rare,
    "--color-rarity-epic": p.rarity.epic,
    "--color-rarity-legendary": p.rarity.legendary,
    "--color-category-exercise": p.category.exercise,
    "--color-category-study": p.category.study,
    "--color-category-creative": p.category.creative,
    "--color-category-productivity": p.category.productivity,
  });
}
