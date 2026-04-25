import { type CategoryKey } from "@/constants/categories";
import {
  BookIcon,
  CheckIcon,
  RunIcon,
  StarIcon,
} from "./index";

/**
 * 4 카테고리를 4 픽셀 아이콘에 매핑.
 *   - exercise     -> RunIcon
 *   - study        -> BookIcon
 *   - creative     -> StarIcon
 *   - productivity -> CheckIcon
 */
const ICON_BY_CATEGORY = {
  exercise: RunIcon,
  study: BookIcon,
  creative: StarIcon,
  productivity: CheckIcon,
} as const;

type Props = {
  category: CategoryKey;
  size?: number;
};

export function CategoryIcon({ category, size = 16 }: Props) {
  const Comp = ICON_BY_CATEGORY[category];
  return <Comp size={size} />;
}
