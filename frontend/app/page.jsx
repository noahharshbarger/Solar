'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [
    '/house.jpg',
    '/house2.jpg',
    '/house3.jpg',
    '/house4.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <main className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">
      {/* Background Image Carousel */}
      {backgroundImages.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${image}')`,
          }}
        />
      ))}
      
      {/* Content Overlay */}
      <section className="relative w-full max-w-2xl mx-auto text-center py-16 px-6 rounded-xl shadow-2xl bg-gray-200 z-10">
        <div className="flex justify-center mb-8">
          <Image
            src="/ucandr-logo.png"
            alt="Unified Construction and Restoration Logo"
            width={180}
            height={140}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <h1 className="text-6xl md:text-4xl font-bold text-[#08284f] mb-4">
          UCR Sales Portal
        </h1>
        <p className="text-base md:text-lg text-[#08284f] max-w-xl mx-auto mb-8">
          Welcome to the Sales Portal! Streamline part selection and ordering for your sales team with a professional, easy-to-use interface.
        </p>
        <a
          href="/feoc-calculator"
          className="inline-block bg-[#053e7f] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#08284f] transition"
        >
          Get Started
        </a>
      </section>
    </main>
  );
}