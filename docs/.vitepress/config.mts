
import { defineConfig } from 'vitepress'
import { platforms } from './data/platforms.ts'
import { projects } from './data/projects.ts'

// Ãœst menÃ¼deki platformlar
const platformMenu = platforms.map((platform) => ({
  text: platform.name,
  link: `/projects/${platform.slug}/`
}))

// Platform yan menÃ¼leri
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

// Her projenin kendi dokÃ¼mantasyon menÃ¼sÃ¼
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

// BÃ¼tÃ¼n yan menÃ¼leri birleÅŸtir
const sidebars = {
  ...platformSidebars,
  ...projectSidebars
}

export default defineConfig({
  base: '/developer-docs/',
  title: 'Developer Hub',

  description: 'My projects and documentation',

  themeConfig: {
    
    nav: [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'All Projects',
        link: '/projects/'
      },
      {
        text: 'Platforms',
        items: platformMenu
      },
      {
        text: 'Socials',
        link: '/socials/'
      }
    ],


    sidebar: sidebars,

    search: {
      provider: 'local'
    }
  }
})

