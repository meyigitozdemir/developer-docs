
export interface SocialAccount {
  platform: string
  name: string
  description: string
  url: string
  category: string
}

export const socials: SocialAccount[] = [
  {
    platform: 'YouTube',
    name: 'Maskeowl',
    description: 'My YouTube channel',
    url: 'https://www.youtube.com/@Maskeowl',
    category: 'Main Channel'
  },
  {
    platform: 'YouTube',
    name: 'Ropalwa',
    description: 'My YouTube channel',
    url: 'https://www.youtube.com/@Ropalwa',
    category: 'Alternative Channels'
  },
  {
    platform: 'Kick',
    name: 'Ropalwa',
    description: 'My Kick livestream channel',
    url: 'https://kick.com/ropalwa',
    category: 'Main Channel'
  }
]
