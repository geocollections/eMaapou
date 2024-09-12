export default function range(N: number) {
  // const results = new Array<number>(N);
  const results = Array.from<number>({ length: N });
  let i = 0;
  while (i < N) {
    results[i] = i;
    i++;
  }
  return results;
}
