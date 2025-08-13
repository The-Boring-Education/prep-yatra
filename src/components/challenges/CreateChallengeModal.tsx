import React, { useState, useEffect } from "react"
import { Challenge, ChallengeTemplate, CreateChallengeDTO, UpdateChallengeDTO } from "@/types/challenges"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { CHALLENGE_TEMPLATES } from "@/types/challenges"

interface CreateChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateChallengeDTO | UpdateChallengeDTO) => Promise<void>
  editChallenge?: Challenge | null
  selectedTemplate?: ChallengeTemplate | null
  userId: string
}

const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editChallenge,
  selectedTemplate,
  userId
}) => {
  const [formData, setFormData] = useState({
    name: "",
    totalDays: "",
    category: "",
    description: ""
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"template" | "custom" | "form">("template")

  // Initialize form data when editing or template is selected
  useEffect(() => {
    if (editChallenge) {
      setFormData({
        name: editChallenge.name,
        totalDays: editChallenge.totalDays.toString(),
        category: editChallenge.category || "",
        description: ""
      })
      setStep("form")
    } else if (selectedTemplate) {
      setFormData({
        name: selectedTemplate.name,
        totalDays: selectedTemplate.totalDays.toString(),
        category: selectedTemplate.category,
        description: selectedTemplate.description
      })
      setStep("form")
    } else {
      setFormData({
        name: "",
        totalDays: "",
        category: "",
        description: ""
      })
      setStep("template")
    }
  }, [editChallenge, selectedTemplate, isOpen])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTemplateSelect = (template: ChallengeTemplate) => {
    setFormData({
      name: template.name,
      totalDays: template.totalDays.toString(),
      category: template.category,
      description: template.description
    })
    setStep("form")
  }

  const handleCustomChallenge = () => {
    setFormData({
      name: "",
      totalDays: "",
      category: "",
      description: ""
    })
    setStep("form")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.totalDays) {
      toast.error("Please fill in all required fields")
      return
    }

    const totalDays = parseInt(formData.totalDays)
    if (totalDays < 1 || totalDays > 365) {
      toast.error("Challenge duration must be between 1 and 365 days")
      return
    }

    setLoading(true)

    try {
      const submitData = {
        name: formData.name.trim(),
        totalDays,
        category: formData.category.trim() || undefined,
        userId: userId
      }

      await onSubmit(submitData)
      onClose()
      setFormData({ name: "", totalDays: "", category: "", description: "" })
      setStep("template")
    } catch (error) {
      console.error("Error submitting challenge:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setFormData({ name: "", totalDays: "", category: "", description: "" })
    setStep("template")
  }

  if (step === "template") {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              🎯 Create Your First Challenge
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Choose from our pre-defined challenges or create your own
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Pre-defined Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHALLENGE_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-full ${template.color} flex items-center justify-center text-2xl`}>
                      {template.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{template.name}</h3>
                      <span className="text-sm text-gray-600">{template.category}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{template.totalDays} days</span>
                    <Button size="sm" variant="outline">
                      Select Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Challenge Option */}
            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleCustomChallenge}
                className="border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-secondary/50 text-foreground"
              >
                ✨ Create Custom Challenge
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editChallenge ? "Edit Challenge" : "Create Challenge"}
          </DialogTitle>
          <DialogDescription>
            {editChallenge 
              ? "Update your challenge details" 
              : "Set up your learning challenge"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Challenge Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., 30 Days of DSA"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalDays">Duration (Days) *</Label>
            <Input
              id="totalDays"
              type="number"
              min="1"
              max="365"
              value={formData.totalDays}
              onChange={(e) => handleInputChange("totalDays", e.target.value)}
              placeholder="e.g., 30"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Programming">Programming</SelectItem>
                <SelectItem value="Career">Career</SelectItem>
                <SelectItem value="Fitness">Fitness</SelectItem>
                <SelectItem value="Learning">Learning</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe what you want to achieve..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : editChallenge ? "Update Challenge" : "Create Challenge"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChallengeModal
