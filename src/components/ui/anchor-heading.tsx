import * as React from "react"
import { cn } from "../../lib/utils"
import { useToast } from "../../hooks/use-toast"

interface AnchorHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  id?: string
  children: React.ReactNode
}

export function AnchorHeading({
  as = 'h2',
  id,
  children,
  className,
  ...props
}: AnchorHeadingProps) {
  const { toast } = useToast()
  const Component = as

  const handleCopyLink = async (event: React.MouseEvent) => {
    event.preventDefault()

    if (!id) return

    const url = `${window.location.origin}${window.location.pathname}#${id}`

    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Link copied!",
        description: "The anchor link has been copied to your clipboard.",
      })
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = url
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()

      try {
        document.execCommand('copy')
        toast({
          title: "Link copied!",
          description: "The anchor link has been copied to your clipboard.",
        })
      } catch (fallbackErr) {
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Unable to copy the link to clipboard.",
        })
      } finally {
        document.body.removeChild(textArea)
      }
    }
  }

  return (
    <Component
      id={id}
      className={cn("group relative cursor-pointer", className)}
      onClick={handleCopyLink}
      {...props}
    >
      <span className="inline-flex items-center">
        <span>{children}</span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-foreground ml-2 select-none">
          #
        </span>
      </span>
    </Component>
  )
}