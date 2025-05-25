
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';
import ProfileShowcase from '@/components/ProfileShowcase';
import WaitlistForm from '@/components/WaitlistForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeatureCards />
      <ProfileShowcase />
      <WaitlistForm />
      <Footer />
    </div>
  );
};

export default Index;
