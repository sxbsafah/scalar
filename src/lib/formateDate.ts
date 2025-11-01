export default function formatDate(timestamp: number) {
  const date = new Date(timestamp * 1000);
  const formated = date.toLocaleDateString('en-US', {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  return formated;
}
