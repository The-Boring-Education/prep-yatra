import React from "react"
import { Button } from "@/components/ui/button"
import { useOnboarding } from "@/hooks/useOnboarding"
import StepProfile from "@/components/onboarding/StepProfile"
import StepBasicInfo from "@/components/onboarding/StepBasicInfo"
import StepExperience from "@/components/onboarding/StepExperience"
import StepGoal from "@/components/onboarding/StepGoal"
import StepCompanies from "@/components/onboarding/StepCompanies"
import StepCategories from "@/components/onboarding/StepCategories"

const Onboarding = () => {
    const {
        user,
        loading,
        currentStep,
        totalSteps,
        formData,
        handleInputChange,
        toggleArrayField,
        isStepValid,
        handleNext,
        handlePrevious
    } = useOnboarding()

    if (!user) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-white'>Loading...</div>
            </div>
        )
    }

    const showStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <StepProfile
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                )
            case 2:
                return (
                    <StepBasicInfo
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                )
            case 3:
                return (
                    <StepExperience
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                )
            case 4:
                return (
                    <StepGoal
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                )
            case 5:
                return (
                    <StepCompanies
                        formData={formData}
                        toggleArrayField={toggleArrayField}
                    />
                )
            case 6:
                return (
                    <StepCategories
                        formData={formData}
                        toggleArrayField={toggleArrayField}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center px-4 relative overflow-hidden'>
            {/* Background Animation Elements */}
            <div className='absolute inset-0 opacity-10'>
                <div className='absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full animate-float'></div>
                <div
                    className='absolute top-60 right-20 w-24 h-24 bg-primary/30 rounded-full animate-float'
                    style={{ animationDelay: "1s" }}></div>
                <div
                    className='absolute bottom-40 left-1/4 w-20 h-20 bg-primary/25 rounded-full animate-float'
                    style={{ animationDelay: "2s" }}></div>
            </div>
            <div className='glass-dark rounded-2xl p-8 w-full max-w-2xl animate-scale-in relative z-10'>
                {/* Header */}
                <div className='text-center mb-6'>
                    <div className='text-center mb-4'>
                        <span className='block text-3xl font-bold text-primary'>
                            PrepYatra
                        </span>
                        <span className='block text-sm text-gray-300 mt-1'>
                            by The Boring Education
                        </span>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className='mb-8'>
                    <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm text-gray-300'>
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span className='text-sm text-gray-300'>
                            {Math.round((currentStep / totalSteps) * 100)}%
                        </span>
                    </div>
                    <div className='w-full bg-gray-700 rounded-full h-2'>
                        <div
                            className='bg-primary h-2 rounded-full transition-all duration-300'
                            style={{
                                width: `${(currentStep / totalSteps) * 100}%`
                            }}
                        />
                    </div>
                </div>
                {showStep()}
                <div className='flex justify-between mt-8'>
                    <Button
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                        variant='outline'
                        className='px-6 py-3 border-gray-600 text-black-300 hover:bg-white-700 disabled:opacity-50 disabled:cursor-not-allowed'>
                        Previous
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={!isStepValid() || loading}
                        className='px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed'>
                        {loading
                            ? "Setting up your profile..."
                            : currentStep === totalSteps
                            ? "Complete Setup"
                            : "Next"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Onboarding
