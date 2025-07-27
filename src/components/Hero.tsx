import React from 'react';

interface HeroProps {
  imageUrl?: string;
  headline?: string;
  subtext?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  imageUrl = 'https://placehold.co/1200x400',
  headline = 'Welcome to NATI',
  subtext = 'D2C Headless Commerce, Artisan-Made',
  ctaText = 'Shop Now',
  onCtaClick,
}) => (
  <section className="relative w-full h-96 flex items-center justify-center">
    <img
      src={imageUrl}
      alt="Hero background"
      className="absolute inset-0 w-full h-full object-cover object-center z-0"
    />
    <div className="relative z-10 text-center text-off-white bg-black/40 p-8 rounded">
      <h1 className="font-heading text-4xl mb-2">{headline}</h1>
      <p className="mb-4 text-lg">{subtext}</p>
      <button
        className="bg-turmeric text-indigo font-bold px-6 py-2 rounded hover:bg-clay-red transition"
        onClick={onCtaClick}
      >
        {ctaText}
      </button>
    </div>
  </section>
);

export default Hero; 