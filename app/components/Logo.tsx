export default function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <circle cx="30" cy="50" r="25" />
      <circle cx="70" cy="50" r="25" />
    </svg>
  )
}

