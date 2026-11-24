
<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

import { projects } from '../../data/projects.ts'
import { platforms } from '../../data/platforms.ts'

import type {
  Project,
  ProjectStatus
} from '../../data/projects.ts'

// =====================================
// FILTER STATE
// =====================================

const searchQuery = ref('')
const selectedPlatform = ref('all')
const selectedCategory = ref('all')
const selectedStatus = ref('all')

// =====================================
// PROJECT STATUS
// =====================================

const statusOptions: {
  value: ProjectStatus
  label: string
}[] = [
  {
    value: 'released',
    label: 'Released'
  },
  {
    value: 'in-development',
    label: 'In Development'
  },
  {
    value: 'archived',
    label: 'Archived'
  }
]

function getStatusLabel(status?: ProjectStatus): string {
  if (!status) return 'Not Specified'

  return statusOptions.find(
    option => option.value === status
  )?.label ?? 'Not Specified'
}

// =====================================
// PLATFORM AND CATEGORY FILTERS
// =====================================

const categoryOptions = computed(() => {
  const categories = new Map<string, string>()

  for (const platform of platforms) {
    if (
      selectedPlatform.value !== 'all' &&
      platform.slug !== selectedPlatform.value
    ) {
      continue
    }

    for (const category of platform.categories) {
      categories.set(
        category.slug,
        category.name
      )
    }
  }

  return [...categories].map(([value, label]) => ({
    value,
    label
  }))
})

function changePlatform(platform: string) {
  selectedPlatform.value = platform
  selectedCategory.value = 'all'
}

// =====================================
// PROJECT SEARCH AND FILTERING
// =====================================

const filteredProjects = computed(() => {
  const query = searchQuery.value
    .trim()
    .toLocaleLowerCase()

  return projects.filter(project => {
    const matchesPlatform =
      selectedPlatform.value === 'all' ||
      project.platform === selectedPlatform.value

    const matchesCategory =
      selectedCategory.value === 'all' ||
      project.category === selectedCategory.value

    const matchesStatus =
      selectedStatus.value === 'all' ||
      (
        selectedStatus.value === 'unspecified'
          ? !project.status
          : project.status === selectedStatus.value
      )

    const searchableText = [
      project.title,
      project.description,
      project.platform,
      project.category,
      project.status ?? '',
      project.version ?? '',
      ...project.tags
    ].join(' ').toLocaleLowerCase()

    return (
      matchesPlatform &&
      matchesCategory &&
      matchesStatus &&
      searchableText.includes(query)
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

function resetFilters() {
  searchQuery.value = ''
  selectedPlatform.value = 'all'
  selectedCategory.value = 'all'
  selectedStatus.value = 'all'
}

// =====================================
// PROJECT INFORMATION
// =====================================

function getPlatformName(slug: string): string {
  return platforms.find(
    platform => platform.slug === slug
  )?.name ?? slug
}

function getCategoryName(project: Project): string {
  const platform = platforms.find(
    item => item.slug === project.platform
  )

  return platform?.categories.find(
    category => category.slug === project.category
  )?.name ?? project.category
}

function getProjectUrl(project: Project): string {
  return withBase(
    `/projects/${project.platform}/${project.category}/${project.slug}/`
  )
}

function getDocsUrl(project: Project): string | undefined {
  const firstDocument = project.docs?.[0]

  if (!firstDocument) {
    return undefined
  }

  return withBase(
    `/projects/${project.platform}/${project.category}/${project.slug}/${firstDocument.slug}`
  )
}

function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    roblox: '🧩',
    blender: '🎨',
    godot: '🎮'
  }

  return icons[platform] ?? '📁'
}

function getVersionLabel(project: Project): string {
  if (!project.version) {
    return 'Version not set'
  }

  return `v${project.version.replace(/^v/i, '')}`
}

// =====================================
// PROJECT COVER IMAGES
// =====================================

const failedImages = ref<Record<string, boolean>>({})

function getProjectKey(project: Project): string {
  return `${project.platform}/${project.category}/${project.slug}`
}

function getCoverUrl(path?: string): string | undefined {
  if (!path) return undefined

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  return withBase(
    path.startsWith('/') ? path : `/${path}`
  )
}

function hasCover(project: Project): boolean {
  return Boolean(
    project.coverImage &&
    !failedImages.value[getProjectKey(project)]
  )
}

function handleCoverError(project: Project) {
  failedImages.value[getProjectKey(project)] = true
}
</script>

<template>
  <div class="project-gallery">

    <!-- SEARCH -->
    <div class="search-section">
      <label for="project-search">
        Search Projects
      </label>

      <input
        id="project-search"
        v-model="searchQuery"
        type="search"
        placeholder="Search projects, technologies and tags..."
        autocomplete="off"
      />
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
          @click="changePlatform('all')"
        >
          All Platforms
        </button>

        <button
          v-for="platform in platforms"
          :key="platform.slug"
          type="button"
          class="filter-button"
          :class="{ active: selectedPlatform === platform.slug }"
          :aria-pressed="selectedPlatform === platform.slug"
          @click="changePlatform(platform.slug)"
        >
          {{ platform.name }}
        </button>
      </div>
    </div>

    <!-- CATEGORY FILTERS -->
    <div
      v-if="categoryOptions.length"
      class="filter-section"
    >
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
    <div class="results-bar">
      <p aria-live="polite">
        Showing
        <strong>{{ filteredProjects.length }}</strong>
        of {{ projects.length }} projects
      </p>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="clear-button"
        @click="resetFilters"
      >
        Clear Filters
      </button>
    </div>

    <!-- PROJECT CARDS -->
    <div
      v-if="filteredProjects.length"
      class="project-grid"
    >
      <article
        v-for="project in filteredProjects"
        :key="getProjectKey(project)"
        class="project-card hub-card"
      >

        <!-- PROJECT COVER -->
        <div
          class="project-cover"
          :class="`cover-${project.platform}`"
        >
          <img
            v-if="hasCover(project)"
            :src="getCoverUrl(project.coverImage)"
            :alt="`${project.title} cover image`"
            loading="lazy"
            @error="handleCoverError(project)"
          />

          <span
            v-else
            class="cover-icon"
            aria-hidden="true"
          >
            {{ getPlatformIcon(project.platform) }}
          </span>
        </div>

        <!-- PROJECT CONTENT -->
        <div class="project-body">

          <!-- PLATFORM AND STATUS -->
          <div class="project-top">
            <span class="platform-label">
              {{ getPlatformName(project.platform) }}
              ·
              {{ getCategoryName(project) }}
            </span>

            <span
              class="status-badge"
              :class="project.status ?? 'unspecified'"
            >
              {{ getStatusLabel(project.status) }}
            </span>
          </div>

          <!-- PROJECT TITLE -->
          <h3>
            <a
              :href="getProjectUrl(project)"
              class="project-title"
            >
              {{ project.title }}
            </a>
          </h3>

          <!-- DESCRIPTION -->
          <p class="project-description">
            {{ project.description }}
          </p>

          <!-- VERSION -->
          <div class="project-version">
            <span>
              {{ getVersionLabel(project) }}
            </span>

            <time
              v-if="project.releaseDate"
              :datetime="project.releaseDate"
            >
              · {{ project.releaseDate }}
            </time>
          </div>

          <!-- TAGS -->
          <div class="project-tags">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="project-tag"
            >
              {{ tag }}
            </span>
          </div>

          <!-- LINKS -->
          <div class="project-actions">
            <a
              :href="getProjectUrl(project)"
              class="primary-action"
            >
              View Project →
            </a>

            <a
              v-if="getDocsUrl(project)"
              :href="getDocsUrl(project)"
              class="secondary-action"
            >
              Docs
            </a>

            <a
              v-if="project.links?.download"
              :href="project.links.download"
              target="_blank"
              rel="noopener noreferrer"
              class="secondary-action"
            >
              Download ↗
            </a>

            <a
              v-if="project.links?.github"
              :href="project.links.github"
              target="_blank"
              rel="noopener noreferrer"
              class="secondary-action"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </article>
    </div>

    <!-- EMPTY STATE -->
    <div v-else class="empty-state">
      <h3>No Projects Found</h3>

      <p>
        Try another search term or change your filters.
      </p>

      <button
        type="button"
        @click="resetFilters"
      >
        Show All Projects
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

.search-section {
  margin-bottom: 24px;
}

.search-section label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
}

.search-section input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--hub-radius-sm);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 14px;
}

.search-section input:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
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
.clear-button:focus-visible,
.project-title:focus-visible,
.project-actions a:focus-visible,
.empty-state button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

/* RESULTS */

.results-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  margin: 28px 0 18px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.results-bar p {
  margin: 0;
}

.clear-button {
  border: none;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* PROJECT GRID */

.project-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: 20px;
}

.project-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  padding: 0;
  transition: var(--hub-transition);
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--hub-card-shadow-hover);
}

/* COVER IMAGES */

.project-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 148px;
  overflow: hidden;
}

.project-cover img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
  margin: 0;
  object-fit: cover;
  object-position: center;
}

.cover-icon {
  font-size: 52px;
}

.cover-roblox {
  background: linear-gradient(
    135deg,
    #3e427e,
    #777bb8
  );
}

.cover-blender {
  background: linear-gradient(
    135deg,
    #a45c18,
    #f59e0b
  );
}

.cover-godot {
  background: linear-gradient(
    135deg,
    #345868,
    #67a8bc
  );
}

/* PROJECT BODY */

.project-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 15px;
  padding: 22px;
}

.project-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 9px;
}

.platform-label {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.status-badge {
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 650;
}

.status-badge.released {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.status-badge.in-development {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.status-badge.archived,
.status-badge.unspecified {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.project-body h3 {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 20px;
  overflow-wrap: anywhere;
}

.project-title {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.project-title:hover {
  color: var(--vp-c-brand-1);
}

.project-description {
  flex: 1;
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.project-version {
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

/* ACTION BUTTONS */

.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.project-actions a {
  padding: 9px 12px;
  border-radius: var(--hub-radius-sm);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
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
  padding: 40px 20px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: var(--hub-radius);
  text-align: center;
}

.empty-state p {
  color: var(--vp-c-text-2);
}

.empty-state button {
  margin-top: 12px;
  padding: 10px 16px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: var(--hub-radius-sm);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  cursor: pointer;
}

/* MOBILE */

@media (max-width: 640px) {
  .project-grid {
    gap: 14px;
  }

  .project-body {
    padding: 18px;
  }
}

/* ACCESSIBILITY */

@media (prefers-reduced-motion: reduce) {
  .project-card {
    transition: none;
  }

  .project-card:hover {
    transform: none;
  }
}
</style>
