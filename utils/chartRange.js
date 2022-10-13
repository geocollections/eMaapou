export default function chartRange(maxs, mins) {
  const [maxDepth, minDepth] = [-Math.min(...mins), -Math.max(...maxs)]
  return [maxDepth, minDepth]
}
