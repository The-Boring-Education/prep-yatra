import React from "react"
import { ChallengesShowcase } from "@/components/challenges"

const ChallengesDemo = () => {
  // Mock user ID for testing
  const mockUserId = "demo-user-123"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🎯 Challenges Feature Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test the complete challenges functionality
          </p>
        </div>
        
        <ChallengesShowcase userId={mockUserId} />
      </div>
    </div>
  )
}

export default ChallengesDemo
