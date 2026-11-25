export default function range(N: number) {
  const results = Array.from<number>({ length: N });
  let i = 0;
  while (i < N) {
    results[i] = i;
    i++;
  }
  return results;
}
