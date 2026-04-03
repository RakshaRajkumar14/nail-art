import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import FeaturedServices from '../components/FeaturedServices';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="w-full bg-white">
      <Navigation />
      <HeroSection />
      <FeaturedServices />
      <Gallery />
      <Testimonials />
      <Footer />
    </div>
  );
}
