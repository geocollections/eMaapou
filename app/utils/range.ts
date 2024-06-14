export default function range(N: number) {
  const results = Array<number>(N);
  let i = 0;
  while (i < N) {
    results[i] = i;
    i++;
  }
  return results;
}
