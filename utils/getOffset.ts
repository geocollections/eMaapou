export default function (page: number, perPage: number) {
  return (page - 1) * perPage;
}
