import React, { useState } from "react"
import { Challenge, ChallengeLog } from "@/types/challenges"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  Copy, 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Instagram,
  ExternalLink
} from "lucide-react"

interface SocialShareModalProps {
  isOpen: boolean
  onClose: () => void
  challenge: Challenge
  log: ChallengeLog
}

const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  challenge,
  log
}) => {
  const [copied, setCopied] = useState(false)

  // Generate the social media template
  const generateTemplate = () => {
    const progressPoints = log.progressText.split('.').filter(point => point.trim()).slice(0, 2)
    const nextGoals = log.nextGoals.slice(0, 2)
    
    let template = `Today was Day ${log.day} of ${challenge.name} 🎯\n\n`
    
    if (progressPoints.length > 0) {
      template += `I worked on:\n`
      progressPoints.forEach((point, index) => {
        template += `${index + 1}. ${point.trim()}\n`
      })
      template += '\n'
    }
    
    if (nextGoals.length > 0) {
      template += `My next goal is:\n`
      nextGoals.forEach((goal, index) => {
        template += `${index + 1}. ${goal}\n`
      })
      template += '\n'
    }
    
    template += `---\n`
    template += `Learning it on Prep Yatra. Visit ${window.location.origin} to create your challenge! 🚀`
    
    return template
  }

  const [message, setMessage] = useState(generateTemplate())

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      toast.success("Message copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy message")
    }
  }

  const handleShare = async (platform: string) => {
    const encodedMessage = encodeURIComponent(message)
    const url = window.location.origin
    
    let shareUrl = ""
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodedMessage}`
        break
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we copy to clipboard
        handleCopy()
        toast.info("Instagram doesn't support direct sharing. Message copied to clipboard!")
        return
      default:
        return
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400')
  }

  const handleRegenerate = () => {
    const newTemplate = generateTemplate()
    setMessage(newTemplate)
    toast.success("Message regenerated!")
  }

  const handleClose = () => {
    onClose()
    setCopied(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            🚀 Share Your Progress
          </DialogTitle>
          <DialogDescription>
            Share your challenge progress on social media and inspire others!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Challenge Info */}
          <div className="bg-secondary/30 p-4 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">
                {challenge.name}
              </h3>
              <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                Day {log.day} of {challenge.totalDays}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {log.hoursSpent} hours of focused learning today
            </p>
          </div>

          {/* Message Preview */}
          <div className="space-y-2">
            <Label htmlFor="message">Your Social Media Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="font-mono text-sm bg-background border-primary/20 text-foreground"
              placeholder="Generating your message..."
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{message.length} characters</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                className="h-6 px-2 text-xs text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                🔄 Regenerate
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <Label>Quick Share</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('twitter')}
                className="flex items-center space-x-2 border-primary/20 text-foreground hover:bg-secondary/50"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                <span>Twitter</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('linkedin')}
                className="flex items-center space-x-2 border-primary/20 text-foreground hover:bg-secondary/50"
              >
                <Linkedin className="h-4 w-4 text-blue-600" />
                <span>LinkedIn</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('facebook')}
                className="flex items-center space-x-2 border-primary/20 text-foreground hover:bg-secondary/50"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                <span>Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('instagram')}
                className="flex items-center space-x-2 border-primary/20 text-foreground hover:bg-secondary/50"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
                <span>Instagram</span>
              </Button>
            </div>
          </div>

          {/* Copy to Clipboard */}
          <div className="space-y-2">
            <Button
              onClick={handleCopy}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Copy and paste this message anywhere you want to share
            </p>
          </div>

          {/* Pro Tip */}
          <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
            <p className="text-sm text-primary">
              💡 <strong>Pro Tip:</strong> Sharing your progress publicly increases accountability and can inspire others to start their own learning journey!
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleCopy}>
              <Share2 className="h-4 w-4 mr-2" />
              Copy & Share
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SocialShareModal
