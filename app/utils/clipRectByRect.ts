import type { ZRRectLike } from "echarts/types/src/util/types.js";

export default function clipRectByRect(targetRect: ZRRectLike, rect: ZRRectLike): ZRRectLike | undefined {
  const x = Math.max(targetRect.x, rect.x);
  const x2 = Math.min(targetRect.x + targetRect.width, rect.x + rect.width);
  const y = Math.max(targetRect.y, rect.y);
  const y2 = Math.min(targetRect.y + targetRect.height, rect.y + rect.height);

  if (x2 >= x && y2 >= y) {
    return {
      x,
      y,
      width: x2 - x,
      height: y2 - y,
    };
  }
}
