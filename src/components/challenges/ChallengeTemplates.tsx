import React from "react"
import { ChallengeTemplate } from "@/types/challenges"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ChallengeTemplatesProps {
  onSelectTemplate: (template: ChallengeTemplate) => void
  onCustomChallenge: () => void
}

const ChallengeTemplates: React.FC<ChallengeTemplatesProps> = ({
  onSelectTemplate,
  onCustomChallenge
}) => {
  const templates = [
    {
      id: 'python-21',
      name: '21 Days of Learning Python',
      totalDays: 21,
      category: 'Programming',
      description: 'Master Python fundamentals in 21 days',
      icon: '🐍',
      color: 'bg-primary',
      features: ['Basic Syntax', 'Data Structures', 'Functions', 'OOP', 'File Handling']
    },
    {
      id: 'java-21',
      name: '21 Days of Learning Java',
      totalDays: 21,
      category: 'Programming',
      description: 'Learn Java programming basics',
      icon: '☕',
      color: 'bg-primary',
      features: ['Java Basics', 'Classes & Objects', 'Inheritance', 'Interfaces', 'Collections']
    },
    {
      id: 'internship-50',
      name: '50 Days of Cracking Internship',
      totalDays: 50,
      category: 'Career',
      description: 'Prepare for internship interviews',
      icon: '💼',
      color: 'bg-primary',
      features: ['DSA Practice', 'System Design', 'Behavioral Prep', 'Mock Interviews', 'Resume Building']
    },
    {
      id: 'dsa-30',
      name: '30 Days of DSA',
      totalDays: 30,
      category: 'Programming',
      description: 'Master Data Structures and Algorithms',
      icon: '⚡',
      color: 'bg-primary',
      features: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Dynamic Programming', 'Greedy Algorithms']
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-foreground">
          Choose Your Challenge
        </h3>
        <p className="text-muted-foreground">
          Pick from our pre-defined challenges or create your own
        </p>
      </div>

      {/* Pre-defined Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20 glass-dark border-primary/20"
            onClick={() => onSelectTemplate(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full ${template.color} flex items-center justify-center text-2xl text-primary-foreground`}>
                  {template.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {template.name}
                  </CardTitle>
                  <Badge variant="secondary" className="mt-1 bg-secondary/50 text-secondary-foreground border-primary/20">
                    {template.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                {template.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {template.totalDays} days
                </span>
                <span className="text-sm text-primary font-medium">
                  {template.features.length} topics
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.features.slice(0, 3).map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs bg-secondary/30 text-secondary-foreground border-primary/20"
                  >
                    {feature}
                  </Badge>
                ))}
                {template.features.length > 3 && (
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-secondary/30 text-secondary-foreground border-primary/20"
                  >
                    +{template.features.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Custom Challenge Option */}
      <div className="text-center">
        <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 hover:border-primary/50 transition-colors">
          <h4 className="text-lg font-semibold text-foreground mb-2">
            Create Your Own Challenge
          </h4>
          <p className="text-muted-foreground mb-4">
            Design a personalized learning challenge that fits your goals
          </p>
          <Button 
            onClick={onCustomChallenge}
            variant="outline"
            className="border-primary/20 text-foreground hover:bg-secondary/50"
          >
            Start Custom Challenge
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChallengeTemplates
