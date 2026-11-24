
<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

import { projects } from '../../data/projects'
import type { Project, ProjectStatus } from '../../data/projects'
import { platforms } from '../../data/platforms'

// =====================================
// SEARCH AND FILTER STATE
// =====================================

const searchQuery = ref('')
const selectedPlatform = ref('all')
const selectedCategory = ref('all')
const selectedStatus = ref('all')

// =====================================
// STATUS CONFIGURATION
// =====================================

const statusOptions: {
  value: ProjectStatus
  label: string
}[] = [
  { value: 'in-development', label: 'In Development' },
  { value: 'released', label: 'Released' },
  { value: 'archived', label: 'Archived' }
]

function getStatusLabel(status?: ProjectStatus): string {
  if (!status) return 'Not Specified'

  return statusOptions.find(
    option => option.value === status
  )?.label ?? 'Not Specified'
}

function getStatusClass(status?: ProjectStatus): string {
  return status ?? 'unspecified'
}

// =====================================
// PLATFORM AND CATEGORY FILTERS
// =====================================

const platformOptions = computed(() => {
  return platforms.map(platform => ({
    value: platform.slug,
    label: platform.name
  }))
})

const categoryOptions = computed(() => {
  const result = new Map<string, string>()

  for (const platform of platforms) {
    if (
      selectedPlatform.value !== 'all' &&
      platform.slug !== selectedPlatform.value
    ) {
      continue
    }

    for (const category of platform.categories) {
      result.set(category.slug, category.name)
    }
  }

  return Array.from(result, ([value, label]) => ({
    value,
    label
  }))
})

// =====================================
// PROJECT FILTERING
// =====================================

const filteredProjects = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()

  return projects.filter(project => {
    const matchesPlatform =
      selectedPlatform.value === 'all' ||
      project.platform === selectedPlatform.value

    const matchesCategory =
      selectedCategory.value === 'all' ||
      project.category === selectedCategory.value

    const matchesStatus =
      selectedStatus.value === 'all' ||
      project.status === selectedStatus.value ||
      (selectedStatus.value === 'unspecified' && !project.status)

    const searchableText = [
      project.title,
      project.description,
      project.platform,
      project.category,
      project.version ?? '',
      ...(project.tags ?? [])
    ].join(' ').toLocaleLowerCase()

    const matchesSearch =
      query === '' || searchableText.includes(query)

    return (
      matchesPlatform &&
      matchesCategory &&
      matchesStatus &&
      matchesSearch
    )
  })
})

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value.trim() !== '' ||
    selectedPlatform.value !== 'all' ||
    selectedCategory.value !== 'all' ||
    selectedStatus.value !== 'all'
  )
})

// =====================================
// FILTER ACTIONS
// =====================================

function selectPlatform(platform: string) {
  selectedPlatform.value = platform
  selectedCategory.value = 'all'
}

function resetFilters() {
  searchQuery.value = ''
  selectedPlatform.value = 'all'
  selectedCategory.value = 'all'
  selectedStatus.value = 'all'
}

// =====================================
// PROJECT DISPLAY HELPERS
// =====================================

function getPlatformName(slug: string): string {
  return platforms.find(
    platform => platform.slug === slug
  )?.name ?? slug
}

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

function getProjectIcon(platform: string): string {
  const icons: Record<string, string> = {
    roblox: '🧩',
    blender: '🎨',
    godot: '🎮'
  }

  return icons[platform] ?? '📁'
}

function getProjectLink(project: Project): string {
  return withBase(
    `/projects/${project.platform}/${project.category}/${project.slug}/`
  )
}

function getDocumentationLink(project: Project): string | undefined {
  if (!project.docs?.length) return undefined

  const firstPage = project.docs[0]

  return withBase(
    `/projects/${project.platform}/${project.category}/${project.slug}/${firstPage.slug}`
  )
}

function formatReleaseDate(date?: string): string | undefined {
  if (!date) return undefined

  const parsedDate = new Date(`${date}T00:00:00Z`)

  if (Number.isNaN(parsedDate.getTime())) {
    return date
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(parsedDate)
}
</script>

<template>
  <div class="project-gallery">

    <!-- SEARCH -->
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
          placeholder="Search projects by name, description or tags..."
          autocomplete="off"
        />
      </div>
    </div>

    <!-- PLATFORM FILTERS -->
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

    <!-- CATEGORY FILTERS -->
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

    <!-- STATUS FILTERS -->
    <div class="filter-section">
      <h3>Project Status</h3>

      <div class="filter-buttons">
        <button
          type="button"
          class="filter-button"
          :class="{ active: selectedStatus === 'all' }"
          :aria-pressed="selectedStatus === 'all'"
          @click="selectedStatus = 'all'"
        >
          All Statuses
        </button>

        <button
          v-for="status in statusOptions"
          :key="status.value"
          type="button"
          class="filter-button"
          :class="{ active: selectedStatus === status.value }"
          :aria-pressed="selectedStatus === status.value"
          @click="selectedStatus = status.value"
        >
          {{ status.label }}
        </button>

        <button
          type="button"
          class="filter-button"
          :class="{ active: selectedStatus === 'unspecified' }"
          :aria-pressed="selectedStatus === 'unspecified'"
          @click="selectedStatus = 'unspecified'"
        >
          Not Specified
        </button>
      </div>
    </div>

    <!-- RESULTS -->
    <div class="results-header">
      <p aria-live="polite">
        Showing
        <strong>{{ filteredProjects.length }}</strong>
        of
        <strong>{{ projects.length }}</strong>
        projects
      </p>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="reset-button"
        @click="resetFilters"
      >
        Clear Filters
      </button>
    </div>

    <!-- PROJECT CARDS -->
    <div v-if="filteredProjects.length > 0" class="projects-grid">
      <article
        v-for="project in filteredProjects"
        :key="`${project.platform}/${project.category}/${project.slug}`"
        class="project-card hub-card"
      >
        <div class="project-header">
          <div class="project-icon" aria-hidden="true">
            {{ getProjectIcon(project.platform) }}
          </div>

          <span
            class="status-badge"
            :class="getStatusClass(project.status)"
          >
            {{ getStatusLabel(project.status) }}
          </span>
        </div>

        <div class="project-content">
          <span class="project-platform">
            {{ getPlatformName(project.platform) }}
            ·
            {{ getCategoryName(project.platform, project.category) }}
          </span>

          <h3>
            <a :href="getProjectLink(project)" class="project-title-link">
              {{ project.title }}
            </a>
          </h3>

          <p>{{ project.description }}</p>
        </div>

        <!-- VERSION AND DATE -->
        <div class="project-meta">
          <span class="version-badge">
            {{ project.version ? `v${project.version.replace(/^v/i, '')}` : 'Version not set' }}
          </span>

          <time
            v-if="project.releaseDate"
            :datetime="project.releaseDate"
            class="release-date"
          >
            {{ formatReleaseDate(project.releaseDate) }}
          </time>
        </div>

        <!-- TAGS -->
        <div v-if="project.tags.length > 0" class="project-tags">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="project-tag"
          >
            {{ tag }}
          </span>
        </div>

        <!-- ACTION LINKS -->
        <div class="project-actions">
          <a
            :href="getProjectLink(project)"
            class="project-action primary-action"
          >
            View Project →
          </a>

          <a
            v-if="getDocumentationLink(project)"
            :href="getDocumentationLink(project)"
            class="project-action secondary-action"
          >
            Docs
          </a>

          <a
            v-if="project.links?.github"
            :href="project.links.github"
            target="_blank"
            rel="noopener noreferrer"
            class="project-action secondary-action"
          >
            GitHub ↗
          </a>

          <a
            v-if="project.links?.download"
            :href="project.links.download"
            target="_blank"
            rel="noopener noreferrer"
            class="project-action secondary-action"
          >
            Download ↗
          </a>

          <a
            v-if="project.links?.website"
            :href="project.links.website"
            target="_blank"
            rel="noopener noreferrer"
            class="project-action secondary-action"
          >
            Website ↗
          </a>
        </div>
      </article>
    </div>

    <!-- EMPTY STATE -->
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
.empty-reset:focus-visible,
.project-action:focus-visible,
.project-title-link:focus-visible {
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

/* PROJECT CARDS */

.projects-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 20px;
}

.project-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding: 24px;
  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);
  box-shadow: var(--hub-card-shadow);
}

.project-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.project-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: var(--hub-radius-sm);
  background: var(--vp-c-bg);
  font-size: 27px;
}

.status-badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 650;
  white-space: nowrap;
}

.status-badge.in-development {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.status-badge.released {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.status-badge.archived {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.status-badge.unspecified {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
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
  margin: 10px 0;
  padding: 0;
  border: none;
  font-size: 20px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.project-title-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.project-title-link:hover {
  color: var(--vp-c-brand-1);
}

.project-content p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

/* VERSION AND DATE */

.project-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.version-badge {
  display: inline-flex;
  padding: 5px 10px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
}

.release-date {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

/* TAGS */

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.project-tag {
  padding: 5px 9px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 11px;
}

/* ACTION LINKS */

.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.project-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 12px;
  border-radius: var(--hub-radius-sm);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.project-action:hover {
  opacity: 0.85;
}

.primary-action {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
}

.secondary-action {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
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

/* REDUCED MOTION */

@media (prefers-reduced-motion: reduce) {
  .filter-button,
  .project-action {
    transition: none;
  }
}
</style>
