import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { challengesService } from '@/services/challenges';
import { PREDEFINED_CHALLENGES, PredefinedChallenge, CreateChallengeRequest } from '@/types/challenges';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { Code, Coffee, Briefcase, Plus, Sparkles, Calendar, Target } from 'lucide-react';

interface CreateChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChallengeCreated: () => void;
  userId: string;
}

const CreateChallengeModal = ({
  isOpen,
  onClose,
  onChallengeCreated,
  userId
}: CreateChallengeModalProps) => {
  const { showCelebration } = useGamificationContext();
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('predefined');

  // Custom challenge form data
  const [customForm, setCustomForm] = useState({
    name: '',
    description: '',
    totalDays: ''
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCustomForm({ name: '', description: '', totalDays: '' });
      setSelectedTab('predefined');
    }
  }, [isOpen]);

  const handleCustomInputChange = (field: string, value: string) => {
    setCustomForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePredefinedChallengeSelect = async (challengeType: PredefinedChallenge) => {
    const challengeData = PREDEFINED_CHALLENGES[challengeType];
    
    setLoading(true);
    try {
      await challengesService.create({
        ...challengeData,
        isPredefined: true,
        predefinedType: challengeType,
        userId
      });

      showCelebration(15);
      toast.success('Challenge created successfully! 🎉');
      onChallengeCreated();
      onClose();
    } catch (error) {
      console.error('Error creating predefined challenge:', error);
      toast.error('Failed to create challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customForm.name || !customForm.totalDays) {
      toast.error('Challenge name and duration are required');
      return;
    }

    const totalDays = parseInt(customForm.totalDays);
    if (totalDays < 1 || totalDays > 365) {
      toast.error('Duration must be between 1 and 365 days');
      return;
    }

    setLoading(true);
    try {
      await challengesService.create({
        name: customForm.name,
        description: customForm.description || undefined,
        totalDays,
        isPredefined: false,
        userId
      });

      showCelebration(15);
      toast.success('Custom challenge created successfully! 🎉');
      onChallengeCreated();
      onClose();
    } catch (error) {
      console.error('Error creating custom challenge:', error);
      toast.error('Failed to create challenge. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const predefinedChallenges = [
    {
      type: '21DaysPython' as PredefinedChallenge,
      icon: <Code className="w-8 h-8 text-blue-400" />,
      gradient: 'from-blue-500 to-cyan-500',
      color: 'blue'
    },
    {
      type: '21DaysJava' as PredefinedChallenge,
      icon: <Coffee className="w-8 h-8 text-orange-400" />,
      gradient: 'from-orange-500 to-red-500',
      color: 'orange'
    },
    {
      type: '50DaysInternship' as PredefinedChallenge,
      icon: <Briefcase className="w-8 h-8 text-green-400" />,
      gradient: 'from-green-500 to-emerald-500',
      color: 'green'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto glass-dark border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Create Your Challenge
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose from popular challenges or create your own custom learning journey
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
            <TabsTrigger value="predefined" className="data-[state=active]:bg-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Popular Challenges
            </TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predefined" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {predefinedChallenges.map(({ type, icon, gradient, color }) => {
                const challenge = PREDEFINED_CHALLENGES[type];
                return (
                  <Card
                    key={type}
                    className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border-gray-700 bg-gray-800/50 hover:bg-gray-800/70"
                    onClick={() => handlePredefinedChallengeSelect(type)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-20`}>
                            {icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-white">{challenge.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className={`bg-${color}-500/20 text-${color}-300 border-${color}-500/30`}>
                                <Calendar className="w-3 h-3 mr-1" />
                                {challenge.totalDays} days
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Target className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-300 line-clamp-2">
                        {challenge.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="text-center text-sm text-gray-400 mt-4">
              Click on any challenge to start your journey! 🚀
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-6">
            <form onSubmit={handleCustomChallengeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Challenge Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={customForm.name}
                  onChange={(e) => handleCustomInputChange('name', e.target.value)}
                  placeholder="e.g., 30 Days of React Development"
                  className="bg-gray-800 border-gray-600 text-white focus:border-primary"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  value={customForm.description}
                  onChange={(e) => handleCustomInputChange('description', e.target.value)}
                  placeholder="Describe what you want to achieve in this challenge..."
                  className="bg-gray-800 border-gray-600 text-white focus:border-primary resize-none"
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalDays" className="text-white">
                  Duration (Days) <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="totalDays"
                  type="number"
                  value={customForm.totalDays}
                  onChange={(e) => handleCustomInputChange('totalDays', e.target.value)}
                  placeholder="e.g., 30"
                  className="bg-gray-800 border-gray-600 text-white focus:border-primary"
                  min="1"
                  max="365"
                />
                <p className="text-xs text-gray-400">Choose between 1 to 365 days</p>
              </div>

              <DialogFooter className="flex flex-col-reverse md:flex-row gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-gray-300 text-white hover:bg-gray-100 hover:text-gray-900"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Creating..." : "Create Challenge"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChallengeModal;