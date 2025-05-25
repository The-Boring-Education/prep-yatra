
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Waitlist submission:', { email, whatsapp, created_at: new Date().toISOString() });
    
    toast({
      title: "Welcome to PrepYatra! 🎉",
      description: "You're on the waitlist! We'll notify you when we launch.",
    });

    setEmail('');
    setWhatsapp('');
    setIsLoading(false);
  };

  return (
    <section id="waitlist" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-dark rounded-2xl p-8 md:p-12 animate-scale-in">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join the <span className="text-primary">Waitlist</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Be among the first to experience PrepYatra. Get early access and exclusive updates!
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg p-4 rounded-xl"
                />
              </div>
              
              <div>
                <Input
                  type="tel"
                  placeholder="WhatsApp number (optional)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-lg p-4 rounded-xl"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-4 font-semibold transform transition-transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
            
            <p className="text-gray-400 text-sm mt-6">
              We respect your privacy. No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;
