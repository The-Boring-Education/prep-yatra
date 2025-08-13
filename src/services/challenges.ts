import {
  Challenge,
  ChallengeLog,
  ChallengeProgress,
  ChallengesResponse,
  ChallengeLogsResponse,
  SingleChallengeResponse,
  CreateChallengeRequest,
  UpdateChallengeRequest,
  CreateChallengeLogRequest,
  SocialMediaTemplate
} from '@/types/challenges';
import { trackEvent } from '@/lib/analytics';

export const challengesService = {
  // Get all challenges for a user
  async getByUserId(userId: string): Promise<Challenge[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/prepyatra/challenges?userId=${userId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ChallengesResponse = await response.json();

      if (!result.status) {
        throw new Error('Failed to fetch challenges');
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching challenges:', error);
      throw error;
    }
  },

  // Create a new challenge
  async create(data: CreateChallengeRequest & { userId: string }): Promise<Challenge> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/prepyatra/challenges`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SingleChallengeResponse = await response.json();

      if (!result.status) {
        throw new Error('Failed to create challenge');
      }

      // Analytics
      try {
        trackEvent('challenge_create', {
          category: 'challenge',
          value: data.totalDays,
          challengeName: data.name,
          isPredefined: data.isPredefined,
          predefinedType: data.predefinedType
        });
      } catch {}

      return result.data;
    } catch (error) {
      console.error('Error creating challenge:', error);
      throw error;
    }
  },

  // Update a challenge
  async update(data: UpdateChallengeRequest): Promise<Challenge> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/prepyatra/challenges`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: SingleChallengeResponse = await response.json();

      if (!result.status) {
        throw new Error('Failed to update challenge');
      }

      // Analytics
      try {
        trackEvent('challenge_update', {
          category: 'challenge',
          challengeId: data.challengeId,
          updatedFields: Object.keys(data).filter(key => key !== 'challengeId')
        });
      } catch {}

      return result.data;
    } catch (error) {
      console.error('Error updating challenge:', error);
      throw error;
    }
  },

  // Delete a challenge
  async delete(challengeId: string): Promise<void> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/prepyatra/challenges?challengeId=${challengeId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.status) {
        throw new Error('Failed to delete challenge');
      }

      // Analytics
      try {
        trackEvent('challenge_delete', {
          category: 'challenge',
          challengeId
        });
      } catch {}
    } catch (error) {
      console.error('Error deleting challenge:', error);
      throw error;
    }
  },

  // Get challenge logs
  async getLogs(challengeId: string): Promise<ChallengeLog[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/prepyatra/challenge-logs?challengeId=${challengeId}`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ChallengeLogsResponse = await response.json();

      if (!result.status) {
        throw new Error('Failed to fetch challenge logs');
      }

      return result.data || [];
    } catch (error) {
      console.error('Error fetching challenge logs:', error);
      throw error;
    }
  },

  // Create a challenge log entry
  async createLog(data: CreateChallengeLogRequest & { userId: string }): Promise<ChallengeLog> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/prepyatra/challenge-logs`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.status) {
        throw new Error('Failed to create challenge log');
      }

      // Trigger prep-stats refetch for gamification
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('prep-stats-refetch'));
      }, 500);

      // Analytics
      try {
        trackEvent('challenge_log_create', {
          category: 'challenge_log',
          value: data.hoursSpent,
          challengeId: data.challengeId,
          copyToPrepLogs: data.copyToPrepLogs
        });
      } catch {}

      return result.data;
    } catch (error) {
      console.error('Error creating challenge log:', error);
      throw error;
    }
  },

  // Get challenge progress with analytics
  async getProgress(challengeId: string): Promise<ChallengeProgress> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TBE_WEBAPP_API_URL}/prepyatra/challenges/${challengeId}/progress`,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.status) {
        throw new Error('Failed to fetch challenge progress');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching challenge progress:', error);
      throw error;
    }
  },

  // Generate social media template
  generateSocialMediaTemplate(challenge: Challenge, currentLog: ChallengeLog, nextGoals: string[] = []): SocialMediaTemplate {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prepyatra.com';
    
    return {
      challengeName: challenge.name,
      currentDay: currentLog.day,
      progressText: currentLog.progressText,
      nextGoals: nextGoals.length > 0 ? nextGoals : ['Continue learning consistently', 'Apply new concepts in practice'],
      appUrl
    };
  },

  // Format social media message
  formatSocialMediaMessage(template: SocialMediaTemplate): string {
    const goals = template.nextGoals.map((goal, index) => `${index + 1}. ${goal}`).join('\n');
    
    return `Today was Day ${template.currentDay} of ${template.challengeName}

I worked on - 
${template.progressText}

My next goal is - 
${goals}

---
Learning it on Prep Yatra. Visit ${template.appUrl} to create your challenge.`;
  }
};