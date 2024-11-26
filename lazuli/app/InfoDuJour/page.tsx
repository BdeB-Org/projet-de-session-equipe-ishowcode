// app/InfoDuJour/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import InfoDuJourServer from './InfoDuJour.server';

const InfoDuJour = () => {
  const [news, setNews] = useState<any>(null);

  useEffect(() => {
    const getRedditPost = async () => {
      const post = await InfoDuJourServer();
      setNews(post);
    };
    
    getRedditPost();
  }, []);

  return (
    <div className="info-du-jour bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#5d3fd3]">Info du Jour</h2>

      {news ? (
        <div>
          <h3 className="text-xl font-semibold">{news.title}</h3>
          <p className="text-sm text-gray-700">{news.selftext}</p>
          <a
            href={news.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5d3fd3] hover:text-[#4629a6]"
          >
            Read More
          </a>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default InfoDuJour;
