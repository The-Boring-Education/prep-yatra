import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  OnboardingData,
} from '@/types/onboarding';
import { useAuth } from '@/contexts/AuthContext';

export function useOnboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
      const { user } = useAuth()
  const [centralUserId, setCentralUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState<OnboardingData>({
    linkedInUrl: '',
    workExperience: '',
    workDomain: '',
    name: '',
    username: '',
    experienceLevel: 'fresher',
    goal: '6Months',
    targetCompanies: [],
    preferredCategories: [],
  });

  useEffect(() => {
      const checkAuthAndFetchCentralUser = async () => {
        if (!user) {
            navigate("/auth")
            return
        }

        try {
            const res = await fetch(
                `${
                    import.meta.env.VITE_TBE_WEBAPP_API_URL
                }/api/v1/user?email=${user.email}`
            )
            const result = await res.json()

            if (!result?.status || !result?.data?._id) {
                throw new Error("User not found in central DB")
            }

            setCentralUserId(result.data._id)
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not verify user. Please try again.",
                variant: "destructive"
            })
            navigate("/auth")
        }
    }

    checkAuthAndFetchCentralUser();
  }, [navigate, toast]);

  const handleInputChange = (
    field: keyof OnboardingData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleArrayField = (
    field: 'targetCompanies' | 'preferredCategories',
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.workExperience && formData.workDomain;
      case 2:
        return formData.name.trim() && formData.username.trim();
      case 3:
        return formData.experienceLevel;
      case 4:
        return formData.goal;
      case 5:
        return formData.targetCompanies.length > 0;
      case 6:
        return formData.preferredCategories.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !centralUserId) return;

    try {
      setLoading(true);

      // Step 1: Update central user
      const step1Response = await fetch(
        `${import.meta.env.VITE_TBE_WEBAPP_API_URL}/api/v1/user/onbording?userId=${centralUserId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workExperience: parseInt(formData.workExperience),
            workDomain: formData.workDomain,
            linkedInUrl: formData.linkedInUrl,
          }),
        }
      );
      const step1Result = await step1Response.json();
      if (!step1Result.status) {
        throw new Error(step1Result.message || 'Step 1 onboarding failed');
      }

      // Step 2-6: PrepYatra onboarding
      const prepYatraResponse = await fetch(
        `${import.meta.env.VITE_TBE_WEBAPP_API_URL}/api/v1/prepyatra/onboarding`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supabaseUserId: user.id,
            name: formData.name,
            username: formData.username,
            goal: formData.goal,
            targetCompanies: formData.targetCompanies,
            preferredCategories: formData.preferredCategories,
          }),
        }
      );
      const prepYatraResult = await prepYatraResponse.json();
      if (!prepYatraResult.status) {
        throw new Error(prepYatraResult.message || 'PrepYatra onboarding failed');
      }

      toast({
        title: 'Welcome to PrepYatra!',
        description: 'Your profile has been set up successfully.',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    currentStep,
    totalSteps,
    formData,
    setFormData,
    handleInputChange,
    toggleArrayField,
    isStepValid,
    handleNext,
    handlePrevious,
    handleSubmit,
  };
} 