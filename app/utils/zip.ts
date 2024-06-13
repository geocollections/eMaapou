export default function zip<T>(...arrs: T[][]) {
  const firstArray = arrs.shift();
  return (
    firstArray?.map((val, i: number) =>
      // @ts-expect-error - Do not know why this is a error
      arrs.reduce((a, arr) => [...a, arr[i]], [val]),
    ) ?? []
  );
}
