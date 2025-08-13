import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Target, 
  Play, 
  Pause, 
  Trash2, 
  Edit3,
  Clock,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { Challenge } from '@/types/challenges';
import { challengesService } from '@/services/challenges';
import { toast } from 'sonner';

interface ChallengeCardProps {
  challenge: Challenge;
  onChallengeUpdated: () => void;
  onLogProgress: (challenge: Challenge) => void;
}

const ChallengeCard = ({ challenge, onChallengeUpdated, onLogProgress }: ChallengeCardProps) => {
  const [loading, setLoading] = useState(false);

  const getStatusColor = (isActive: boolean) => {
    if (isActive) return 'bg-green-500/20 text-green-300 border-green-500/30';
    return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  };

  const getStatusIcon = (isActive: boolean) => {
    if (isActive) return <Play className="w-3 h-3" />;
    return <Pause className="w-3 h-3" />;
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Active' : 'Paused';
  };

  const calculateProgress = () => {
    return Math.round((challenge.currentDay / challenge.totalDays) * 100);
  };

  const calculateDaysRemaining = () => {
    return Math.max(0, challenge.totalDays - challenge.currentDay);
  };

  const handlePauseResume = async () => {
    setLoading(true);
    try {
      // Since we can't update status directly, we'll toggle isActive
      // This would require updating the backend to handle isActive field
      // For now, we'll show a message that this feature needs backend support
      toast.info('Pause/Resume functionality requires backend support for isActive field');
      onChallengeUpdated();
    } catch (error) {
      console.error('Error updating challenge:', error);
      toast.error('Failed to update challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await challengesService.delete(challenge._id);
      toast.success('Challenge deleted successfully!');
      onChallengeUpdated();
    } catch (error) {
      console.error('Error deleting challenge:', error);
      toast.error('Failed to delete challenge');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const progress = calculateProgress();
  const daysRemaining = calculateDaysRemaining();

  return (
    <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg text-white line-clamp-1">
                {challenge.name}
              </CardTitle>
              {challenge.category && (
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  {challenge.category}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(challenge.isActive)}>
                {getStatusIcon(challenge.isActive)}
                <span className="ml-1">{getStatusText(challenge.isActive)}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Progress</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-700" />
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-primary font-semibold">{challenge.currentDay}</div>
              <div className="text-gray-400">Current Day</div>
            </div>
            <div className="text-center">
              <div className="text-white font-semibold">{daysRemaining}</div>
              <div className="text-gray-400">Days Left</div>
            </div>
            <div className="text-center">
              <div className="text-white font-semibold">{challenge.totalDays}</div>
              <div className="text-gray-400">Total Days</div>
            </div>
          </div>
        </div>

        {/* Date Information */}
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Started: {formatDate(challenge.startDate)}
          </div>
          {challenge.endDate && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Ended: {formatDate(challenge.endDate)}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {challenge.isActive && (
            <Button
              onClick={() => onLogProgress(challenge)}
              className="flex-1 bg-primary hover:bg-primary/90"
              size="sm"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Log Progress
            </Button>
          )}
          
          <Button
            onClick={handlePauseResume}
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-gray-600 text-white hover:bg-gray-700"
          >
            {challenge.isActive ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>

          <Button
            onClick={handleDelete}
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;