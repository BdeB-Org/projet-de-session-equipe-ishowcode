// pages/balloons.js
"use client";
import { useEffect } from "react";
import Link from "next/link";

const BalloonsPage = () => {
  useEffect(() => {
    const balloons = document.querySelectorAll(".balloon");
    balloons.forEach((balloon) => {
      const randomX = Math.random() * 100; // Random horizontal position
      const randomY = Math.random() * 100; // Random vertical position
      /**balloon.style.transform = `translate(${randomX}vw, ${randomY}vh)`;**/
    });
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-blue-200">
      <h1 className="absolute top-10 text-4xl font-bold text-center">
        🎈 Bienvenue dans le monde des ballons ! 🎈
      </h1>
      <div className="absolute bottom-0 left-0 w-full flex justify-center">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="balloon" />
        ))}
      </div>
      <Link href="/" className="absolute top-5 left-5 text-lg text-blue-800">
        Retour
      </Link>
      <style jsx>{`
        .balloon {
          width: 50px;
          height: 70px;
          background-color: #ff6f61;
          border-radius: 50% 50% 0 0;
          position: absolute;
          animation: rise 5s infinite ease-in;
        }

        @keyframes rise {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-100vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BalloonsPage;
