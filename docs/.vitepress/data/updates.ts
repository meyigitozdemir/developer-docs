
export interface DevelopmentUpdate {
  id: string
  title: string
  description: string
  category: string
  date: string
  link?: string
}

export const updates: DevelopmentUpdate[] = [
  {
    id: 'socials-hub',
    title: 'Socials & Content Hub',
    description:
      'Added a dedicated page for YouTube, Kick and alternative channels.',
    category: 'New Feature',
    date: '2026-11-24',
    link: '/socials/'
  },
  {
    id: 'category-cards',
    title: 'Dynamic Roblox Category Cards',
    description:
      'Introduced dynamic category cards with automatic project counts.',
    category: 'Website Improvement',
    date: '2026-11-24',
    link: '/projects/roblox/'
  },
  {
    id: 'developer-hub-launch',
    title: 'Developer Hub Launched',
    description:
      'Published the Developer Hub portfolio and documentation website.',
    category: 'Milestone',
    date: '2026-11-24',
    link: '/'
  }
]
