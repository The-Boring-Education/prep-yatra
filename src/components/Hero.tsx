
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist');
    waitlistSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="container mx-auto text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Turn <span className="text-primary">Hustle</span>
            <br />
            Into <span className="text-primary">Hires</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The ultimate community platform for job hunters to store recruiter contacts, 
            share prep logs, and crowdsource resources together.
          </p>
          
          <div className="animate-scale-in">
            <Button 
              onClick={scrollToWaitlist}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4 font-semibold transform transition-transform hover:scale-105"
            >
              Start Free
            </Button>
          </div>
        </div>
        
        <div className="mt-16 animate-float">
          <div className="glass rounded-2xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-2">Join the Movement</h3>
            <p className="text-gray-300 text-sm">Be part of the community that's revolutionizing job hunting</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
