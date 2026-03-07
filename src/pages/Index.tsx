import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CropRecommendation from "@/components/CropRecommendation";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <div id="about">
        <AboutSection />
      </div>
      <CropRecommendation />
      <div id="features">
        <FeaturesSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
