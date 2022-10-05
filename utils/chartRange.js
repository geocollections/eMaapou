export default function chartRange(maxs, mins) {
  let minDepth = Math.min(...mins)
  let maxDepth = Math.max(...maxs)
  if (maxDepth > 0 && minDepth >= 0)
    [maxDepth, minDepth] = [-minDepth, -maxDepth]
  return [maxDepth, minDepth]
}
