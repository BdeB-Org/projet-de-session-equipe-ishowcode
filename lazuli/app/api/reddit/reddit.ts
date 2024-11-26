// pages/api/daily-reddit-post.ts
import { NextApiRequest, NextApiResponse } from 'next';

let cachedPost: any = null;

const fetchRedditPost = async () => {
  const res = await fetch('https://www.reddit.com/r/CryptoCurrency/top.json?limit=1');
  const data = await res.json();
  const topPost = data.data.children[0].data;

  return {
    title: topPost.title,
    selftext: topPost.selftext,
    permalink: `https://www.reddit.com${topPost.permalink}`,
    createdAt: topPost.created_utc,
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!cachedPost || Date.now() - cachedPost.createdAt > 24 * 60 * 60 * 1000) {
    try {
      const post = await fetchRedditPost();
      cachedPost = { ...post, createdAt: Date.now() };
      res.status(200).json(cachedPost);
    } catch (error) {
      console.error('Error fetching Reddit post:', error);
      res.status(500).json({ error: 'Failed to fetch Reddit post' });
    }
  } else {
    res.status(200).json(cachedPost);
  }
}
