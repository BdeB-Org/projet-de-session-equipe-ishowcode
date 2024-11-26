// app/InfoDuJour/InfoDuJour.server.tsx
import React from 'react';

const fetchRedditPost = async () => {
  try {
    const res = await fetch('https://www.reddit.com/r/CryptoCurrency/top.json?limit=1');
    if (!res.ok) throw new Error('Failed to fetch Reddit post');
    const data = await res.json();
    const topPost = data.data.children[0].data;
    return {
      title: topPost.title,
      selftext: topPost.selftext,
      permalink: `https://www.reddit.com${topPost.permalink}`,
    };
  } catch (error) {
    console.error('Error fetching Reddit post:', error);
    return null;
  }
};

const InfoDuJourServer = async () => {
  const news = await fetchRedditPost();
  
  return news;
};

export default InfoDuJourServer;
