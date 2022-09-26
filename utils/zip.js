export default function zip(arr, ...arrs) {
  return arr.map((val, i) => arrs.reduce((a, arr) => [...a, arr[i]], [val]))
}
