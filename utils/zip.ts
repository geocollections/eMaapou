export default function zip(...arrs: any[][]) {
  const firstArray = arrs.shift()
  return (
    firstArray?.map((val: any, i: number) =>
      arrs.reduce((a: any, arr: any) => [...a, arr[i]], [val])
    ) ?? []
  )
}
