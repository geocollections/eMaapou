export default function chartRange(maxs, mins) {
  let minDepth = Math.min(...mins)
  let maxDepth = Math.max(...maxs)
  const reversed = maxDepth > 0 && minDepth >= 0
  if (reversed) [maxDepth, minDepth] = [-minDepth, -maxDepth]

  return [maxDepth, minDepth, reversed]
}
