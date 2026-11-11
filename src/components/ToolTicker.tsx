import { ALL_TOOLS } from '@/data/options'

// A band of tool names that scrolls forever (the list is doubled so the loop has no gap)
export default function ToolTicker() {
  const items = [...ALL_TOOLS, ...ALL_TOOLS]
  return (
    <div className="overflow-hidden bg-ink py-5 text-paper" aria-hidden>
      <div className="anim-marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {items.map((tool, index) => (
              <span key={`${copy}-${index}`} className="px-8 font-mono text-[11px] uppercase tracking-wider">
                {tool} <span className="text-lime">&#8226;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
