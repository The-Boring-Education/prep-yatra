
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    linkedin_url: '',
    experience_level: ''
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate('/auth');
        return;
      }
      setUser(session.user);

      // Check if already onboarded
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single();

      if (profile?.onboarding_completed) {
        navigate('/dashboard');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    if (!formData.username || !formData.experience_level) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          linkedin_url: formData.linkedin_url || null,
          experience_level: formData.experience_level,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Welcome to PrepYatra!",
        description: "Your profile has been set up successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full animate-float"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-primary/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-primary/25 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="glass-dark rounded-2xl p-8 w-full max-w-md animate-scale-in relative z-10">
        <div className="text-center mb-8">
          <div className="text-center mb-6">
            <span className="block text-3xl font-bold text-primary">PrepYatra</span>
            <span className="block text-sm text-gray-300 mt-1">by The Boring Education</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-gray-300">Let's get you set up for success!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-white font-medium">
              Username *
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="mt-2 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div>
            <Label htmlFor="linkedin" className="text-white font-medium">
              LinkedIn Profile URL
            </Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/in/your-profile"
              value={formData.linkedin_url}
              onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
              className="mt-2 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Label className="text-white font-medium mb-4 block">
              Experience Level *
            </Label>
            <RadioGroup
              value={formData.experience_level}
              onValueChange={(value) => handleInputChange('experience_level', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="entry" id="entry" className="border-gray-400" />
                <Label htmlFor="entry" className="text-gray-300">Entry Level (0-2 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mid" id="mid" className="border-gray-400" />
                <Label htmlFor="mid" className="text-gray-300">Mid Level (2-5 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="senior" id="senior" className="border-gray-400" />
                <Label htmlFor="senior" className="text-gray-300">Senior Level (5-8 years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lead" id="lead" className="border-gray-400" />
                <Label htmlFor="lead" className="text-gray-300">Lead/Principal (8+ years)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="executive" id="executive" className="border-gray-400" />
                <Label htmlFor="executive" className="text-gray-300">Executive/Director</Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105"
          >
            {loading ? 'Setting up your profile...' : 'Complete Setup'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
