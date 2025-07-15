import { MessageCircle, ThumbsUp, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Comment } from "@/lib/types"

interface CommentSectionProps {
  comments: Comment[]
}

export function CommentSection({ comments }: CommentSectionProps) {
  return (
    <section className="border-t pt-8 mb-12">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Comments ({comments.length})</h2>
      </div>

      <div className="mb-8">
        <Textarea placeholder="Share your thoughts..." className="mb-4" />
        <Button>Post Comment</Button>
      </div>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b pb-6 last:border-b-0">
            <div className="flex space-x-4">
              <Avatar>
                <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                <AvatarFallback>{comment.author[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-sm text-muted-foreground">{comment.date}</span>
                </div>

                <p className="text-sm mb-3">{comment.content}</p>

                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {comment.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
