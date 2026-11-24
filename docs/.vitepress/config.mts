
import { defineConfig } from 'vitepress'
import { platforms } from './data/platforms.ts'
import { projects } from './data/projects.ts'

// Üst menüdeki platformlar
const platformMenu = platforms.map((platform) => ({
  text: platform.name,
  link: `/projects/${platform.slug}/`
}))

// Platform yan menüleri
const platformSidebars = Object.fromEntries(
  platforms.map((platform) => [
    `/projects/${platform.slug}/`,
    [
      {
        text: platform.name,
        items: [
          {
            text: 'Overview',
            link: `/projects/${platform.slug}/`
          },
          ...platform.categories.map((category) => ({
            text: category.name,
            link: `/projects/${platform.slug}/${category.slug}/`
          }))
        ]
      }
    ]
  ])
)

// Her projenin kendi dokümantasyon menüsü
const projectSidebars = Object.fromEntries(
  projects.map((project) => {
    const projectPath =
      `/projects/${project.platform}/${project.category}/${project.slug}/`

    return [
      projectPath,
      [
        {
          text: project.title,
          items: [
            {
              text: 'Overview',
              link: projectPath
            },
            ...(project.docs ?? []).map((page) => ({
              text: page.title,
              link: `${projectPath}${page.slug}`
            }))
          ]
        },
        {
          text: 'Navigation',
          items: [
            {
              text: 'Back to Category',
              link: `/projects/${project.platform}/${project.category}/`
            }
          ]
        }
      ]
    ]
  })
)

// Bütün yan menüleri birleştir
const sidebars = {
  ...platformSidebars,
  ...projectSidebars
}

export default defineConfig({
  title: 'Developer Hub',

  description: 'My projects and documentation',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'All Projects', link: '/projects/' },
      {
        text: 'Platforms',
        items: platformMenu
      }
    ],

    sidebar: sidebars,

    search: {
      provider: 'local'
    }
  }
})
