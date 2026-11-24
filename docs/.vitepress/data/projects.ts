
/* ==========================================
   DEVELOPER HUB — PROJECT DATA
   ========================================== */

// Projelerin geliştirme durumları
export type ProjectStatus =
  | 'in-development'
  | 'released'
  | 'archived'

// Projelerin dokümantasyon sayfaları
export interface DocumentationPage {
  title: string
  slug: string
}

// Projeye ait harici bağlantılar
export interface ProjectLinks {
  download?: string
  github?: string
  documentation?: string
  website?: string
}

// Ana proje veri modeli
export interface Project {
  // Temel bilgiler
  slug: string
  title: string
  description: string

  // Sınıflandırma
  platform: string
  category: string
  tags: string[]

  // Görsel
  coverImage?: string

  // Dokümantasyon sayfaları
  docs?: DocumentationPage[]

  // Proje yönetim bilgileri
  status?: ProjectStatus
  version?: string
  releaseDate?: string

  // Projeye özel bağlantılar
  links?: ProjectLinks
}

/* ==========================================
   PROJECT COLLECTION
   ========================================== */

export const projects: Project[] = [

  // ========================================
  // STUDIO HELPER — DEMO
  // ========================================
  {
    slug: 'studio-helper',
    title: 'Studio Helper (Demo)',

    description: 'A demo Roblox Studio plugin.',

    platform: 'roblox',
    category: 'plugins',

    tags: [
      'Roblox Studio',
      'Luau',
      'Plugin'
    ],

    status: 'in-development',

    docs: [
      {
        title: 'Installation',
        slug: 'installation'
      },
      {
        title: 'User Guide',
        slug: 'user-guide'
      },
      {
        title: 'API Reference',
        slug: 'api'
      },
      {
        title: 'Changelog',
        slug: 'changelog'
      }
    ]
  },

  // ========================================
  // MY FIRST PLUGIN — DEMO
  // ========================================
  {
    slug: 'my-first-plugin',
    title: 'My First Plugin (Demo)',

    description: 'An example developer tool.',

    platform: 'roblox',
    category: 'plugins',

    tags: [
      'Roblox Studio',
      'Plugin'
    ],

    status: 'in-development'
  },

  // ========================================
  // SIGNAL_FASTSETUP
  // ========================================
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

    status: "released",
    version: "1.0.0",
    releaseDate: "2026-11-3",

    docs: [
      {
        title: 'Installation',
        slug: 'installation'
      },
      {
        title: 'User Guide',
        slug: 'user-guide'
      },
      {
        title: 'Technical Reference',
        slug: 'reference'
      },
      {
        title: 'Changelog',
        slug: 'changelog'
      }
    ],

    // Bağlantılar hazır olduğunda eklenebilir:
    //
    links: {
       download: 'https://create.roblox.com/store/asset/95297540676869/FastSignal',
    //   github: 'https://...',
    //   documentation: 'https://...',
    //   website: 'https://...'
    },
  }

]
