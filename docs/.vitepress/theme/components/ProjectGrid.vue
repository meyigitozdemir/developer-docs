
<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

import { projects } from '../../data/projects'
import { platforms } from '../../data/platforms'

// ARAMA VE FİLTRE DURUMU
const searchQuery = ref('')
const selectedPlatform = ref('all')
const selectedCategory = ref('all')

// Platform seçenekleri
const platformOptions = computed(() => {
  return platforms.map(platform => ({
    value: platform.slug,
    label: platform.name
  }))
})

// Seçili platforma göre kategori seçenekleri
const categoryOptions = computed(() => {
  const availableCategories = new Map<string, string>()

  // Platform bilgisinde tanımlı kategoriler
  for (const platform of platforms) {
    if (
      selectedPlatform.value !== 'all' &&
      platform.slug !== selectedPlatform.value
    ) {
      continue
    }

    for (const category of platform.categories) {
      availableCategories.set(
        category.slug,
        category.name
      )
    }
  }

  return Array.from(availableCategories, ([value, label]) => ({
    value,
    label
  }))
})

// Filtrelenmiş projeler
const filteredProjects = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()

  return projects.filter(project => {
    // Platform kontrolü
    const matchesPlatform =
      selectedPlatform.value === 'all' ||
      project.platform === selectedPlatform.value

    // Kategori kontrolü
    const matchesCategory =
      selectedCategory.value === 'all' ||
      project.category === selectedCategory.value

    // Arama kontrolü
    const searchableText = [
      project.title,
      project.description,
      project.platform,
      project.category,
      ...(project.tags ?? [])
    ].join(' ').toLocaleLowerCase()

    const matchesSearch =
      query === '' || searchableText.includes(query)

    return (
      matchesPlatform &&
      matchesCategory &&
      matchesSearch
    )
  })
})

// Platform değiştiğinde kategoriyi sıfırla
function selectPlatform(platform: string) {
  selectedPlatform.value = platform
  selectedCategory.value = 'all'
}

// Tüm filtreleri sıfırla
function resetFilters() {
  searchQuery.value = ''
  selectedPlatform.value = 'all'
  selectedCategory.value = 'all'
}

// Platform adını bul
function getPlatformName(slug: string): string {
  return platforms.find(
    platform => platform.slug === slug
  )?.name ?? slug
}

// Kategori adını bul
function getCategoryName(
  platformSlug: string,
  categorySlug: string
): string {
  const platform = platforms.find(
    item => item.slug === platformSlug
  )

  return platform?.categories.find(
    category => category.slug === categorySlug
  )?.name ?? categorySlug
}

// Platforma göre simge
function getProjectIcon(platform: string): string {
  const icons: Record<string, string> = {
    roblox: '🧩',
    blender: '🎨',
    godot: '🎮'
  }

  return icons[platform] ?? '📁'
}

// Proje dokümantasyon bağlantısı
function getProjectLink(project: typeof projects[number]): string {
  const defaultPath =
    `/projects/${project.platform}/${project.category}/${project.slug}/`

  const link =
    typeof project.docs === 'string' && project.docs.length > 0
      ? project.docs
      : defaultPath

  if (/^https?:\/\//i.test(link)) {
    return link
  }

  return withBase(link)
}
</script>

<template>
  <div class="project-gallery">

    <!-- ARAMA ALANI -->
    <div class="search-wrapper">
      <label for="project-search" class="search-label">
        Search Projects
      </label>

      <div class="search-field">
        <span class="search-icon" aria-hidden="true">⌕</span>

        <input
          id="project-search"
          v-model="searchQuery"
          type="search"
          placeholder="Search by name, description or tags..."
          autocomplete="off"
        />
      </div>
    </div>

    <!-- PLATFORM FİLTRELERİ -->
    <div class="filter-section">
      <h3>Platforms</h3>

      <div class="filter-buttons">
        <button
          type="button"
          class="filter-button"
          :class="{ active: selectedPlatform === 'all' }"
          :aria-pressed="selectedPlatform === 'all'"
          @click="selectPlatform('all')"
        >
          All Platforms
        </button>

        <button
          v-for="platform in platformOptions"
          :key="platform.value"
          type="button"
          class="filter-button"
          :class="{ active: selectedPlatform === platform.value }"
          :aria-pressed="selectedPlatform === platform.value"
          @click="selectPlatform(platform.value)"
        >
          {{ platform.label }}
        </button>
      </div>
    </div>

    <!-- KATEGORİ FİLTRELERİ -->
    <div v-if="categoryOptions.length > 0" class="filter-section">
      <h3>Categories</h3>

      <div class="filter-buttons">
        <button
          type="button"
          class="filter-button"
          :class="{ active: selectedCategory === 'all' }"
          :aria-pressed="selectedCategory === 'all'"
          @click="selectedCategory = 'all'"
        >
          All Categories
        </button>

        <button
          v-for="category in categoryOptions"
          :key="category.value"
          type="button"
          class="filter-button"
          :class="{ active: selectedCategory === category.value }"
          :aria-pressed="selectedCategory === category.value"
          @click="selectedCategory = category.value"
        >
          {{ category.label }}
        </button>
      </div>
    </div>

    <!-- SONUÇ SAYISI -->
    <div class="results-header">
      <p aria-live="polite">
        Showing
        <strong>{{ filteredProjects.length }}</strong>
        of
        <strong>{{ projects.length }}</strong>
        projects
      </p>

      <button
        v-if="
          searchQuery ||
          selectedPlatform !== 'all' ||
          selectedCategory !== 'all'
        "
        type="button"
        class="reset-button"
        @click="resetFilters"
      >
        Clear Filters
      </button>
    </div>

    <!-- PROJE KARTLARI -->
    <div v-if="filteredProjects.length > 0" class="projects-grid">
      <a
        v-for="project in filteredProjects"
        :key="project.slug"
        :href="getProjectLink(project)"
        class="project-card hub-card hub-card--interactive"
      >
        <div class="project-header">
          <div class="project-icon" aria-hidden="true">
            {{ getProjectIcon(project.platform) }}
          </div>

          <span class="project-arrow" aria-hidden="true">
            ↗
          </span>
        </div>

        <div class="project-content">
          <span class="project-platform">
            {{ getPlatformName(project.platform) }}
          </span>

          <h3>{{ project.title }}</h3>

          <p>{{ project.description }}</p>
        </div>

        <div v-if="project.tags?.length" class="project-tags">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="project-tag"
          >
            {{ tag }}
          </span>
        </div>

        <div class="project-footer">
          <span class="category-badge">
            {{ getCategoryName(project.platform, project.category) }}
          </span>

          <span class="view-project">
            View Project →
          </span>
        </div>
      </a>
    </div>

    <!-- SONUÇ BULUNAMADI -->
    <div v-else class="empty-state">
      <div class="empty-icon" aria-hidden="true">🔎</div>

      <h3>No projects found</h3>

      <p>
        Try another search term or change the selected filters.
      </p>

      <button
        type="button"
        class="empty-reset"
        @click="resetFilters"
      >
        Reset Filters
      </button>
    </div>

  </div>
</template>

<style scoped>
.project-gallery {
  width: 100%;
  margin: 24px 0 48px;
}

/* SEARCH */

.search-wrapper {
  margin-bottom: 26px;
}

.search-label {
  display: block;
  margin-bottom: 10px;
  color: var(--vp-c-text-1);
  font-size: 14px;
  font-weight: 600;
}

.search-field {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius-sm);
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s ease;
}

.search-field:focus-within {
  border-color: var(--vp-c-brand-1);
}

.search-icon {
  color: var(--vp-c-text-3);
  font-size: 25px;
}

.search-field input {
  width: 100%;
  min-width: 0;
  height: 48px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 14px;
}

.search-field input::placeholder {
  color: var(--vp-c-text-3);
}

/* FILTERS */

.filter-section {
  margin-bottom: 22px;
}

.filter-section h3 {
  margin: 0 0 12px;
  padding: 0;
  border: none;
  font-size: 14px;
  font-weight: 650;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
}

.filter-button {
  padding: 9px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--hub-transition);
}

.filter-button:hover,
.filter-button.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.filter-button.active {
  background: var(--vp-c-brand-soft);
}

.filter-button:focus-visible,
.reset-button:focus-visible,
.empty-reset:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

/* RESULTS */

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin: 28px 0 18px;
}

.results-header p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.results-header strong {
  color: var(--vp-c-text-1);
}

.reset-button {
  padding: 7px 10px;
  border: none;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* PROJECT GRID */

.projects-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 20px;
}

.project-card {
  display: flex;
  flex-direction: column;
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

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--hub-card-shadow-hover);
}

.project-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.project-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.project-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: var(--hub-radius-sm);
  background: var(--vp-c-bg);
  font-size: 27px;
}

.project-arrow {
  color: var(--vp-c-brand-1);
  font-size: 21px;
}

.project-content {
  flex: 1;
  min-width: 0;
}

.project-platform {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
}

.project-content h3 {
  margin: 9px 0;
  padding: 0;
  border: none;
  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.project-content p {
  margin: 0 0 18px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 18px;
}

.project-tag {
  padding: 5px 9px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 11px;
}

.project-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.category-badge {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.view-project {
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
}

/* EMPTY STATE */

.empty-state {
  padding: 48px 20px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: var(--hub-radius);
  text-align: center;
}

.empty-icon {
  font-size: 36px;
}

.empty-state h3 {
  margin: 12px 0 8px;
  font-size: 19px;
}

.empty-state p {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.empty-reset {
  margin-top: 14px;
  padding: 10px 18px;
  border: none;
  border-radius: var(--hub-radius-sm);
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* MOBILE */

@media (max-width: 640px) {
  .projects-grid {
    gap: 14px;
  }

  .project-card {
    padding: 20px;
  }

  .filter-buttons {
    gap: 7px;
  }
}

/* ACCESSIBILITY */

@media (prefers-reduced-motion: reduce) {
  .project-card,
  .filter-button {
    transition: none;
  }

  .project-card:hover {
    transform: none;
  }
}
</style>
