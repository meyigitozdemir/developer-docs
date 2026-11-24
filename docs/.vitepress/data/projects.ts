
/* ==========================================
   DEVELOPER HUB — PROJECT DATA
   ========================================== */

import { versions } from './versions.ts'

// ==========================================
// TYPES
// ==========================================

export type ProjectStatus =
  | 'in-development'
  | 'released'
  | 'archived'

export interface DocumentationPage {
  title: string
  slug: string
}

export interface ProjectLinks {
  download?: string
  github?: string
  documentation?: string
  website?: string
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

  status?: ProjectStatus
  version?: string
  releaseDate?: string

  links?: ProjectLinks
}

// ==========================================
// VERSION HELPERS
// ==========================================

// Sürüm numarasının başındaki v harfini kaldır
function normalizeVersion(version: string): string {
  return version.replace(/^v/i, '')
}

// Numaralı sürümleri karşılaştır
// Örnek: 1.10.0 > 1.9.0
function compareVersions(a: string, b: string): number {
  const first = normalizeVersion(a)
    .split('.')
    .map(value => Number.parseInt(value, 10) || 0)

  const second = normalizeVersion(b)
    .split('.')
    .map(value => Number.parseInt(value, 10) || 0)

  for (let index = 0; index < 3; index++) {
    const difference =
      (second[index] ?? 0) - (first[index] ?? 0)

    if (difference !== 0) {
      return difference
    }
  }

  return 0
}

// Projeye ait en güncel sürümü bul
function getLatestRelease(projectSlug: string) {
  const projectReleases = versions
    .filter(release => release.projectSlug === projectSlug)
    .sort((a, b) => compareVersions(a.version, b.version))

  return projectReleases[0]
}

// ==========================================
// PROJECT COLLECTION
// ==========================================

// Projelerin temel bilgileri
const projectRecords: Project[] = [

  // ----------------------------------------
  // STUDIO HELPER — DEMO
  // ----------------------------------------
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

  // ----------------------------------------
  // MY FIRST PLUGIN — DEMO
  // ----------------------------------------
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

  // ----------------------------------------
  // SIGNAL_FASTSETUP
  // ----------------------------------------
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

    status: 'released',

    links: {
      download:
        'https://create.roblox.com/store/asset/95297540676869/FastSignal'
    },

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
    ]
  }

]

// ==========================================
// AUTOMATIC VERSION SYNCHRONIZATION
// ==========================================

// Her projenin en güncel sürüm bilgilerini
// versions.ts üzerinden otomatik oluştur.
export const projects: Project[] = projectRecords.map(project => {
  const latestRelease = getLatestRelease(project.slug)

  if (!latestRelease) {
    return project
  }

  return {
    ...project,

    version: latestRelease.version,

    releaseDate:
      latestRelease.date ?? project.releaseDate
  }
})
