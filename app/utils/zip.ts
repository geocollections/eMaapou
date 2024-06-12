export default function zip<T>(...arrs: T[][]) {
  const firstArray = arrs.shift();
  return (
    firstArray?.map((val, i: number) =>
      arrs.reduce((a, arr) => [...a, arr[i]], [val]),
    ) ?? []
  );
}
