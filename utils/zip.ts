export default function zip(...arrs: any) {
  if (arrs.length < 1) return []
  return arrs[0].map((val: any, i: number) =>
    arrs.shift().reduce((a: any, arr: any) => [...a, arr[i]], [val])
  )
}
