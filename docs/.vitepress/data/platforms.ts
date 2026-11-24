
export interface Category {
  name: string
  slug: string
}

export interface Platform {
  name: string
  slug: string
  categories: Category[]
}

export const platforms: Platform[] = [
  {
    name: 'Roblox Studio',
    slug: 'roblox',
    categories: [
      { name: 'Plugins', slug: 'plugins' },
      { name: 'Models', slug: 'models' },
      { name: 'Buildings', slug: 'buildings' }
    ]
  },

  {
    name: 'Blender',
    slug: 'blender',
    categories: []
  },

  {
    name: 'Godot',
    slug: 'godot',
    categories: []
  }
]
