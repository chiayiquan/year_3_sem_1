import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { getNews } from "./components/news";
import Article from "./components/article";

export default function App() {
  const [articles, setArticles] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  useEffect(() => {
    (async () => {
      return fetchNews();
    })();
  }, []);

  async function fetchNews() {
    const articles = await getNews();
    setArticles(articles);
    return setRefreshing(false);
  }

  function handleRefresh() {
    setRefreshing(true);
    return fetchNews();
  }
  return (
    <FlatList
      data={articles}
      renderItem={(item) => <Article article={item} />}
      keyExtractor={(item) => item.url}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
}
