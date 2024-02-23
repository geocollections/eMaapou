// NOTE: this function is copied from `echarts/lib/util/graphic.js`,
//  so we do not need to import the whole `graphic` module, which is really large
import type { ZRRectLike } from "echarts/types/src/util/types";

export default function clipRectByRect(targetRect: ZRRectLike, rect: ZRRectLike): ZRRectLike | undefined {
  const x = Math.max(targetRect.x, rect.x);
  const x2 = Math.min(targetRect.x + targetRect.width, rect.x + rect.width);
  const y = Math.max(targetRect.y, rect.y);
  const y2 = Math.min(targetRect.y + targetRect.height, rect.y + rect.height); // If the total rect is cliped, nothing, including the border,
  // should be painted. So return undefined.

  if (x2 >= x && y2 >= y) {
    return {
      x,
      y,
      width: x2 - x,
      height: y2 - y,
    };
  }
}
