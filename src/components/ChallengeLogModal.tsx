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
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { challengesService } from '@/services/challenges';
import { Challenge } from '@/types/challenges';
import { useGamificationContext } from '@/contexts/GamificationContext';
import { 
  Clock, 
  Share2, 
  Copy, 
  Calendar,
  Target,
  TrendingUp,
  CheckCircle2,
  Twitter,
  Linkedin,
  Facebook
} from 'lucide-react';

interface ChallengeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgressLogged: () => void;
  challenge: Challenge;
  userId: string;
}

const ChallengeLogModal = ({
  isOpen,
  onClose,
  onProgressLogged,
  challenge,
  userId
}: ChallengeLogModalProps) => {
  const { showCelebration } = useGamificationContext();
  const [loading, setLoading] = useState(false);
  const [showSocialPreview, setShowSocialPreview] = useState(false);
  const [socialMessage, setSocialMessage] = useState('');

  const [formData, setFormData] = useState({
    progressText: '',
    hoursSpent: '',
    nextGoals: ['', ''],
    copyToPrepLogs: true
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        progressText: '',
        hoursSpent: '',
        nextGoals: ['', ''],
        copyToPrepLogs: true
      });
      setShowSocialPreview(false);
      setSocialMessage('');
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextGoalChange = (index: number, value: string) => {
    const newGoals = [...formData.nextGoals];
    newGoals[index] = value;
    setFormData(prev => ({ ...prev, nextGoals: newGoals }));
  };

  const generateSocialMessage = () => {
    const nextDay = challenge.currentDay + 1;
    const goals = formData.nextGoals
      .filter(goal => goal.trim())
      .map((goal, index) => `${index + 1}. ${goal}`)
      .join('\n');

    const defaultGoals = goals || '1. Continue learning consistently\n2. Apply new concepts in practice';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prepyatra.com';

    return `Today was Day ${nextDay} of ${challenge.name}

I worked on - 
${formData.progressText}

My next goal is - 
${defaultGoals}

---
Learning it on Prep Yatra. Visit ${appUrl} to create your challenge.`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.progressText || !formData.hoursSpent) {
      toast.error('Progress description and hours spent are required');
      return;
    }

    const hours = parseFloat(formData.hoursSpent);
    if (hours <= 0 || hours > 24) {
      toast.error('Hours spent must be between 0 and 24');
      return;
    }

    setLoading(true);
    try {
      await challengesService.addLog(challenge._id, {
        challengeId: challenge._id,
        userId,
        day: challenge.currentDay + 1,
        progressText: formData.progressText,
        hoursSpent: hours,
        nextGoals: formData.nextGoals || []
      });

      // Generate social media message
      const socialMsg = generateSocialMessage();
      setSocialMessage(socialMsg);
      setShowSocialPreview(true);

      // Show celebration for completing another day
      showCelebration(20);
      toast.success('Progress logged successfully! 🎉');
      onProgressLogged();
    } catch (error) {
      console.error('Error logging progress:', error);
      toast.error('Failed to log progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard! 📋');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedText = encodeURIComponent(socialMessage);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prepyatra.com';
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(appUrl)}&summary=${encodedText}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}&quote=${encodedText}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const nextDay = challenge.currentDay + 1;
  const progressPercentage = Math.round((nextDay / challenge.totalDays) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto glass-dark border-primary/20">
        {!showSocialPreview ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Log Day {nextDay} Progress
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Record your progress for "{challenge.name}"
              </DialogDescription>
            </DialogHeader>

            {/* Challenge Info */}
            <Card className="bg-gray-800/30 border-gray-600">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">{challenge.name}</CardTitle>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Day {nextDay} of {challenge.totalDays}
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {progressPercentage}% Complete
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Active
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="progressText" className="text-white">
                  What did you work on today? <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="progressText"
                  value={formData.progressText}
                  onChange={(e) => handleInputChange('progressText', e.target.value)}
                  placeholder="e.g., Completed Python fundamentals chapter, solved 5 coding problems, built a simple calculator..."
                  className="bg-gray-800 border-gray-600 text-white focus:border-primary resize-none"
                  rows={4}
                  maxLength={500}
                />
                <div className="text-xs text-gray-400 text-right">
                  {formData.progressText.length}/500
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hoursSpent" className="text-white">
                  Hours Spent <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="hoursSpent"
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={formData.hoursSpent}
                  onChange={(e) => handleInputChange('hoursSpent', e.target.value)}
                  placeholder="e.g., 2.5"
                  className="bg-gray-800 border-gray-600 text-white focus:border-primary"
                />
              </div>

              <Separator className="bg-gray-600" />

              <div className="space-y-3">
                <Label className="text-white">Tomorrow's Goals (Optional)</Label>
                <div className="space-y-2">
                  {formData.nextGoals.map((goal, index) => (
                    <Input
                      key={index}
                      value={goal}
                      onChange={(e) => handleNextGoalChange(index, e.target.value)}
                      placeholder={`Goal ${index + 1}...`}
                      className="bg-gray-800 border-gray-600 text-white focus:border-primary"
                      maxLength={100}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  These will be included in your social media post
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="copyToPrepLogs"
                  checked={formData.copyToPrepLogs}
                  onCheckedChange={(checked) => handleInputChange('copyToPrepLogs', checked)}
                  className="border-gray-600"
                />
                <Label htmlFor="copyToPrepLogs" className="text-white text-sm">
                  Also add to Prep Logs
                </Label>
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
                  {loading ? "Logging..." : "Log Progress"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Progress Logged Successfully!
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Share your achievement with the world
              </DialogDescription>
            </DialogHeader>

            <Card className="bg-gray-800/30 border-gray-600">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-primary" />
                  Social Media Post
                </CardTitle>
                <CardDescription>
                  Ready-to-share message for your social networks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                  <pre className="text-sm text-gray-200 whitespace-pre-wrap font-sans">
                    {socialMessage}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <Button
                    onClick={() => copyToClipboard(socialMessage)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                  </Button>
                  
                  <Button
                    onClick={() => shareToSocial('twitter')}
                    variant="outline"
                    size="sm"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  
                  <Button
                    onClick={() => shareToSocial('linkedin')}
                    variant="outline"
                    size="sm"
                    className="border-blue-600/50 text-blue-500 hover:bg-blue-600/10"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  
                  <Button
                    onClick={() => shareToSocial('facebook')}
                    variant="outline"
                    size="sm"
                    className="border-blue-700/50 text-blue-600 hover:bg-blue-700/10"
                  >
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button
                onClick={onClose}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeLogModal;