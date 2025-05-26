
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!profileData?.onboarding_completed) {
        navigate('/onboarding');
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };

    checkAuthAndProfile();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {profile?.username}! 🚀
            </h1>
            <p className="text-gray-300">Ready to turn your hustle into hires?</p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-dark rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">👤 Your Profile</h3>
            <div className="space-y-2 text-gray-300">
              <p><strong>Username:</strong> {profile?.username}</p>
              <p><strong>Experience:</strong> {profile?.experience_level}</p>
              {profile?.linkedin_url && (
                <p><strong>LinkedIn:</strong> 
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" 
                     className="text-primary hover:underline ml-1">
                    View Profile
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="glass-dark rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">📞 Recruiter Contacts</h3>
            <p className="text-gray-300 mb-4">Manage your recruiter network</p>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Add Contact
            </Button>
          </div>

          <div className="glass-dark rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">📝 Prep Logs</h3>
            <p className="text-gray-300 mb-4">Track your preparation progress</p>
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Add Log
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="glass-dark rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-4">🎯 Your Journey Starts Here</h2>
            <p className="text-gray-300 mb-6">
              PrepYatra is your companion in turning hustle into hires. 
              Start by adding your first recruiter contact or logging your prep session!
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                🚀 Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
