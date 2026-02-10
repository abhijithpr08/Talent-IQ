import React from "react";
import HomeNavbar from "../components/home/HomeNavbar";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-base-100">
      <HomeNavbar />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
export default HomePage;