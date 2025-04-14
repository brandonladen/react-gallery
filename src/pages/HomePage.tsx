
import React from 'react';
import HomepageHero from '@/components/home/HomepageHero';
import ImageCarousel from '@/components/home/ImageCarousel';
import FeatureHighlights from '@/components/home/FeatureHighlights';

const HomePage = () => {
  return (
    <div className="container mx-auto">
      <HomepageHero />
      <ImageCarousel />
      <FeatureHighlights />
    </div>
  );
};

export default HomePage;
