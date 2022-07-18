const url =
  "https://newsapi.org/v2/top-headlines?country=sg&apiKey=dcd179161baf457db949c1e4890c6693";

export async function getNews() {
  const response = await fetch(url);
  const { articles } = await response.json();
  return articles;
}
