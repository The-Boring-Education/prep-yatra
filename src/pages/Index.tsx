
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import FeatureCards from '@/components/FeatureCards';
import RecruiterContactsShowcase from '@/components/RecruiterContactsShowcase';
import PrepLogsShowcase from '@/components/PrepLogsShowcase';
import ResourceSharingShowcase from '@/components/ResourceSharingShowcase';
import ProfileShowcase from '@/components/ProfileShowcase';
import WaitlistForm from '@/components/WaitlistForm';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <FeatureCards />
      <RecruiterContactsShowcase />
      <PrepLogsShowcase />
      <ResourceSharingShowcase />
      <ProfileShowcase />
      <WaitlistForm />
      <Footer />
    </div>
  );
};

export default Index;
