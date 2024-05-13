export default function removeNonAlphanumeric(str: string) {
  return str.replace(/[^\p{L}\d]/gu, "");
}
