import { Github, Twitter } from "lucide-react"

export default function SocialLinks() {
  return (
    <div className="text-neutral-400">
      <p className="flex items-center gap-2">
        For any queries, reach out at
        <a
          href="https://twitter.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-white"
        >
          <Twitter className="h-5 w-5" />
        </a>
        or
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-white"
        >
          <Github className="h-5 w-5" />
        </a>
      </p>
    </div>
  )
}

