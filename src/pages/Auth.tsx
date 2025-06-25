
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await createUserInWebapp(session.user);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await createUserInWebapp(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const createUserInWebapp = async (user: User) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_TBE_BACKEND}/api/v1/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.user_metadata?.name || '',
          email: user.email,
          image: user.user_metadata?.avatar_url || '',
          provider: 'google',
          providerAccountId: user.id,
        }),
      });

      const data = await res.json();

      // 🔍 Now check if isOnboarded is true or false
      if (user.email) {
        const checkRes = await fetch(
          `${import.meta.env.VITE_TBE_BACKEND}/api/v1/user?email=${user.email}`
        );
        const checkData = await checkRes.json();

        console.log("this is data for",checkData?.data?.prepYatra?.pyOnboarded)
        

        if (checkData?.data?.prepYatra?.pyOnboarded) {
            console.log("✅ Onboarded. Navigating to dashboard...");

          navigate('/dashboard');
        } else {
            console.log("🛑 Not onboarded. Navigating to onboarding...");

          navigate('/onboarding');
        }
      }
    } catch (err) {
      console.error('Error creating/checking user in webapp:', err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-gray-300">Sign in to continue your journey</p>
        </div>

        <Button
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </Button>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
