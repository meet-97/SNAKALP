export type Mode = 'brand' | 'creator'

// Full class names are written out so Tailwind can find them
export const THEME = {
  creator: {
    button: 'bg-orange-500 hover:bg-orange-600 focus-visible:outline-orange-500',
    field: 'focus:border-orange-400 focus:ring-orange-200',
    link: 'text-orange-600 hover:text-orange-700',
    tabActive: 'border-orange-500 text-stone-900',
  },
  brand: {
    button: 'bg-indigo-600 hover:bg-indigo-700 focus-visible:outline-indigo-600',
    field: 'focus:border-indigo-400 focus:ring-indigo-200',
    link: 'text-indigo-600 hover:text-indigo-700',
    tabActive: 'border-indigo-600 text-stone-900',
  },
} as const

export const COPY = {
  brand: {
    eyebrow: 'For brands & agencies',
    title: 'Hire AI creators you can actually verify.',
    body: 'Post a brief, see exactly how every piece was made, and shortlist the creators whose workflow fits.',
    signupTitle: 'Create your brand account',
    signupBody: 'Post briefs and hire verified AI creators.',
  },
  creator: {
    eyebrow: 'For AI creators',
    title: 'Show the work behind the work.',
    body: 'Share your models, seeds and workflows, prove your craft, and get hired by brands that value it.',
    signupTitle: 'Create your creator account',
    signupBody: 'Build a profile that proves how you work.',
  },
} as const
