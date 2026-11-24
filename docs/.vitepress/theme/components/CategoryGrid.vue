
<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

import { platforms } from '../../data/platforms'
import { projects } from '../../data/projects'

// Hangi platformun kategorileri gösterilecek?
const props = defineProps<{
  platform: string
}>()

// Platform bilgilerini bul
const currentPlatform = computed(() => {
  return platforms.find(
    platform => platform.slug === props.platform
  )
})

// Kategorileri ve proje sayılarını oluştur
const categories = computed(() => {
  if (!currentPlatform.value) {
    return []
  }

  return currentPlatform.value.categories.map(category => {
    const projectCount = projects.filter(project => {
      return (
        project.platform === props.platform &&
        project.category === category.slug
      )
    }).length

    return {
      name: category.name,
      slug: category.slug,
      count: projectCount,
      link: withBase(
        `/projects/${props.platform}/${category.slug}/`
      )
    }
  })
})

// Kategori simgeleri
function getIcon(slug: string): string {
  const icons: Record<string, string> = {
    plugins: '🧩',
    models: '📦',
    buildings: '🏗️'
  }

  return icons[slug] ?? '📁'
}

// Kategori açıklamaları
function getDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    plugins: 'Tools and extensions for Roblox Studio.',
    models: 'Reusable assets, models and creations.',
    buildings: 'Buildings, structures and environments.'
  }

  return descriptions[slug] ??
    'Explore projects in this category.'
}
</script>

<template>
  <div v-if="categories.length > 0" class="category-grid">
    <a
      v-for="category in categories"
      :key="category.slug"
      :href="category.link"
      class="category-card hub-card hub-card--interactive"
    >
      <div class="category-icon" aria-hidden="true">
        {{ getIcon(category.slug) }}
      </div>

      <div class="category-content">
        <h3 class="category-title">
          {{ category.name }}
        </h3>

        <p class="category-description">
          {{ getDescription(category.slug) }}
        </p>

        <div class="category-footer">
          <span class="project-count">
            {{ category.count }}
            {{ category.count === 1 ? 'project' : 'projects' }}
          </span>

          <span class="category-arrow" aria-hidden="true">
            ↗
          </span>
        </div>
      </div>
    </a>
  </div>

  <p v-else class="category-empty">
    No categories available yet.
  </p>
</template>

<style scoped>
.category-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 260px), 1fr)
  );
  gap: 20px;
  margin: 24px 0;
}

.category-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  padding: 24px;

  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);
  box-shadow: var(--hub-card-shadow);

  color: var(--vp-c-text-1);
  text-decoration: none;

  transition: var(--hub-transition);
}

.category-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--hub-card-shadow-hover);
}

.category-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 56px;
  height: 56px;

  border-radius: var(--hub-radius-sm);
  background: var(--vp-c-bg);

  font-size: 28px;
}

.category-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.category-title {
  margin: 0;
  padding: 0;
  border: none;

  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: 650;
}

.category-description {
  flex: 1;
  margin: 10px 0 20px;

  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.category-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.project-count {
  display: inline-flex;
  align-items: center;
  padding: 5px 11px;

  border-radius: 999px;
  background: var(--vp-c-bg);

  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 500;
}

.category-arrow {
  color: var(--vp-c-brand-1);
  font-size: 20px;
  font-weight: 600;
}

.category-empty {
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .category-grid {
    gap: 14px;
  }

  .category-card {
    padding: 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .category-card {
    transition: none;
  }

  .category-card:hover {
    transform: none;
  }
}
</style>
