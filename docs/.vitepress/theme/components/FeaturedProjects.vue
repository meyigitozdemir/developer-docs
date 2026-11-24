
<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { projects } from '../../data/projects'

// Ana sayfada en fazla kaç proje gösterilecek?
const maxProjects = 3

// Özellikle öne çıkarmak istediğimiz projeler
const featuredSlugs = ['signal-fastsetup']

// Öncelikli projeleri ilk sıraya getir
const featuredProjects = computed(() => {
  const sortedProjects = [...projects].sort((a, b) => {
    const aIndex = featuredSlugs.indexOf(a.slug)
    const bIndex = featuredSlugs.indexOf(b.slug)

    if (aIndex !== -1 && bIndex === -1) return -1
    if (aIndex === -1 && bIndex !== -1) return 1

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }

    return 0
  })

  return sortedProjects.slice(0, maxProjects)
})

// Projenin dokümantasyon bağlantısı
function getProjectLink(project: {
  platform: string
  category: string
  slug: string
}) {
  return withBase(
    `/projects/${project.platform}/${project.category}/${project.slug}/`
  )
}
</script>

<template>
  <section class="featured-projects">
    <div class="section-header">
      <div>
        <h2>Featured Projects</h2>
        <p>
          Explore some of my projects, tools and experiments.
        </p>
      </div>

      <a
        :href="withBase('/projects/')"
        class="all-projects-link"
      >
        View All Projects →
      </a>
    </div>

    <div class="featured-grid">
      <a
        v-for="project in featuredProjects"
        :key="project.slug"
        :href="getProjectLink(project)"
        class="featured-card"
      >
        <div class="card-header">
          <span class="project-icon" aria-hidden="true">
            🚀
          </span>

          <span class="project-platform">
            {{ project.platform }}
          </span>
        </div>

        <h3>{{ project.title }}</h3>

        <p class="project-description">
          {{ project.description }}
        </p>

        <div class="project-tags">
          <span
            v-for="tag in project.tags.slice(0, 3)"
            :key="tag"
            class="project-tag"
          >
            {{ tag }}
          </span>
        </div>

        <div class="card-footer">
          <span>View Documentation</span>
          <span aria-hidden="true">↗</span>
        </div>
      </a>
    </div>

    <p v-if="featuredProjects.length === 0">
      No projects available yet.
    </p>
  </section>
</template>

<style scoped>
.featured-projects {
  margin: 48px 0;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 26px;
  font-weight: 700;
}

.section-header p {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.all-projects-link {
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 280px), 1fr)
  );
  gap: 20px;
}

.featured-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.featured-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.project-icon {
  font-size: 28px;
}

.project-platform {
  padding: 5px 10px;
  border-radius: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  text-transform: capitalize;
}

.featured-card h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 650;
  overflow-wrap: anywhere;
}

.project-description {
  flex: 1;
  margin: 12px 0 20px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 20px;
}

.project-tag {
  padding: 5px 9px;
  border-radius: 7px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
}
</style>
