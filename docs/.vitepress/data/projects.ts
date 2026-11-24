
export interface DocumentationPage {
  title: string
  slug: string
}

export interface Project {
  slug: string
  title: string
  description: string
  platform: string
  category: string
  tags: string[]
  coverImage?: string
  docs?: DocumentationPage[]
}

export const projects: Project[] = [
  {
    slug: 'studio-helper',
    title: 'Studio Helper (Demo)',
    description: 'A demo Roblox Studio plugin.',
    platform: 'roblox',
    category: 'plugins',
    tags: ['Roblox Studio', 'Luau', 'Plugin'],
    docs: [
      { title: 'Installation', slug: 'installation' },
      { title: 'User Guide', slug: 'user-guide' },
      { title: 'API Reference', slug: 'api' },
      { title: 'Changelog', slug: 'changelog' }
    ]
  },

  {
    slug: 'my-first-plugin',
    title: 'My First Plugin (Demo)',
    description: 'An example developer tool.',
    platform: 'roblox',
    category: 'plugins',
    tags: ['Roblox Studio', 'Plugin']
  },

  {
    slug: 'signal-fastsetup',
    title: 'Signal_FastSetup',
    description:
      'A Roblox Studio plugin that simplifies Signal ' +
      'module imports with autocomplete and automatic setup.',
    platform: 'roblox',
    category: 'plugins',
    tags: [
      'Roblox Studio',
      'Luau',
      'Autocomplete',
      'Signal',
      'Developer Tools'
    ],
    docs: [
      { title: 'Installation', slug: 'installation' },
      { title: 'User Guide', slug: 'user-guide' },
      { title: 'Technical Reference', slug: 'reference' },
      { title: 'Changelog', slug: 'changelog' }
    ]
  }
]
