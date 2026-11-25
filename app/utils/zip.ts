export default function zip<T>(...arrs: T[][]) {
  const firstArray = arrs.shift();
  return firstArray?.map((value, index) => [
    value,
    ...arrs.map(array => array[index]),
  ]) ?? [];
}
