
import { Flame, Calendar, Target, Award } from 'lucide-react';

const ProfileShowcase = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Track Your <span className="text-primary">Progress</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay motivated with streak counters, progress tracking, and achievement badges.
          </p>
        </div>
        
        <div className="max-w-md mx-auto">
          <div className="glass-dark rounded-2xl p-8 animate-scale-in">
            {/* Profile Header */}
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground">
                AK
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-bold text-white">Alex Kumar</h3>
                <p className="text-gray-400">Full Stack Developer</p>
              </div>
            </div>
            
            {/* Streak Counter */}
            <div className="glass rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Flame className="w-6 h-6 text-orange-500 mr-2" />
                  <span className="text-white font-semibold">Current Streak</span>
                </div>
                <span className="text-2xl font-bold text-primary">15 days</span>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center">
                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">142</div>
                <div className="text-gray-400 text-sm">Hours Logged</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">8</div>
                <div className="text-gray-400 text-sm">Interviews</div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="glass rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Award className="w-5 h-5 text-primary mr-2" />
                <span className="text-white font-medium">Recent Activity</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-gray-300">• Completed DSA practice - 3 hours</div>
                <div className="text-sm text-gray-300">• Added contact: Google Recruiter</div>
                <div className="text-sm text-gray-300">• Shared system design resource</div>
              </div>
            </div>
            
            {/* Achievement Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-primary rounded-full text-primary-foreground font-semibold">
                🏆 Consistency Champion
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileShowcase;
