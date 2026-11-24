
<script setup lang="ts">
import { computed, ref } from 'vue'

import { versions } from '../../data/versions'
import type {
  ChangeType
} from '../../data/versions'

// =====================================
// PROPS
// =====================================

const props = defineProps<{
  projectSlug: string
}>()

// =====================================
// FILTER SETTINGS
// =====================================

type FilterType = ChangeType | 'all'

const activeFilter = ref<FilterType>('all')

const filterOptions: {
  value: FilterType
  label: string
}[] = [
  { value: 'all', label: 'All Changes' },
  { value: 'added', label: 'Added' },
  { value: 'changed', label: 'Changed' },
  { value: 'fixed', label: 'Fixed' },
  { value: 'removed', label: 'Removed' }
]

// =====================================
// VERSION SORTING
// =====================================

function compareVersions(a: string, b: string): number {
  const parse = (version: string) => {
    return version
      .replace(/^v/i, '')
      .split('.')
      .map(part => Number.parseInt(part, 10) || 0)
  }

  const first = parse(a)
  const second = parse(b)

  for (let i = 0; i < 3; i++) {
    const difference =
      (second[i] ?? 0) - (first[i] ?? 0)

    if (difference !== 0) {
      return difference
    }
  }

  return 0
}

// =====================================
// PROJECT RELEASES
// =====================================

const projectVersions = computed(() => {
  return versions
    .filter(
      release => release.projectSlug === props.projectSlug
    )
    .sort(
      (a, b) => compareVersions(a.version, b.version)
    )
})

// =====================================
// CHANGE FILTERING
// =====================================

const filteredVersions = computed(() => {
  if (activeFilter.value === 'all') {
    return projectVersions.value
  }

  return projectVersions.value.filter(release => {
    return release.changes.some(
      change => change.type === activeFilter.value
    )
  })
})

// Her sürüm için gösterilecek değişiklikler
function getVisibleChanges(
  changes: { type: ChangeType; description: string }[]
) {
  if (activeFilter.value === 'all') {
    return changes
  }

  return changes.filter(
    change => change.type === activeFilter.value
  )
}

// Filtre düğmelerindeki değişiklik sayısı
function getFilterCount(type: FilterType): number {
  if (type === 'all') {
    return projectVersions.value.reduce(
      (total, release) => total + release.changes.length,
      0
    )
  }

  return projectVersions.value.reduce(
    (total, release) => {
      return total + release.changes.filter(
        change => change.type === type
      ).length
    },
    0
  )
}

// =====================================
// FORMATTING
// =====================================

function formatDate(value?: string): string {
  if (!value) return 'Date not specified'

  const date = new Date(`${value}T00:00:00Z`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date)
}

function formatVersion(value: string): string {
  return `v${value.replace(/^v/i, '')}`
}

function getChangeLabel(type: ChangeType): string {
  const labels: Record<ChangeType, string> = {
    added: 'Added',
    changed: 'Changed',
    fixed: 'Fixed',
    removed: 'Removed'
  }

  return labels[type]
}
</script>

<template>
  <section class="version-history">

    <!-- HEADER -->
    <div class="history-header">
      <div>
        <h2>Version History</h2>

        <p>
          Explore releases, improvements and bug fixes.
        </p>
      </div>

      <span class="release-count">
        {{ projectVersions.length }}
        {{ projectVersions.length === 1 ? 'release' : 'releases' }}
      </span>
    </div>

    <template v-if="projectVersions.length > 0">

      <!-- FILTERS -->
      <div
        class="history-filters"
        role="group"
        aria-label="Filter release changes"
      >
        <button
          v-for="filter in filterOptions"
          :key="filter.value"
          type="button"
          class="filter-button"
          :class="{ active: activeFilter === filter.value }"
          :aria-pressed="activeFilter === filter.value"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}

          <span class="filter-count">
            {{ getFilterCount(filter.value) }}
          </span>
        </button>
      </div>

      <!-- FILTER RESULT -->
      <p class="results-info" aria-live="polite">
        Showing {{ filteredVersions.length }}
        of {{ projectVersions.length }} releases
      </p>

      <!-- RELEASE LIST -->
      <div
        v-if="filteredVersions.length > 0"
        class="release-list"
      >
        <article
          v-for="release in filteredVersions"
          :key="release.id"
          class="release-card hub-card"
        >
          <div class="release-top">

            <div class="release-version">
              <h3>
                {{ formatVersion(release.version) }}
              </h3>

              <span
                v-if="release.id === projectVersions[0]?.id"
                class="latest-badge"
              >
                Latest
              </span>
            </div>

            <time
              v-if="release.date"
              :datetime="release.date"
              class="release-date"
            >
              {{ formatDate(release.date) }}
            </time>

            <span v-else class="release-date">
              Date not specified
            </span>
          </div>

          <h4 class="release-title">
            {{ release.title }}
          </h4>

          <p
            v-if="release.description"
            class="release-description"
          >
            {{ release.description }}
          </p>

          <!-- CHANGES -->
          <ul class="change-list">
            <li
              v-for="(change, index) in getVisibleChanges(release.changes)"
              :key="index"
              class="change-item"
            >
              <span
                class="change-badge"
                :class="change.type"
              >
                {{ getChangeLabel(change.type) }}
              </span>

              <span class="change-description">
                {{ change.description }}
              </span>
            </li>
          </ul>

          <p
            v-if="getVisibleChanges(release.changes).length === 0"
            class="no-changes"
          >
            No detailed changes recorded.
          </p>

        </article>
      </div>

      <!-- NO FILTER MATCHES -->
      <div v-else class="empty-state">
        <h3>No Matching Changes</h3>

        <p>
          No releases contain changes of the selected type.
        </p>

        <button
          type="button"
          class="reset-button"
          @click="activeFilter = 'all'"
        >
          Show All Changes
        </button>
      </div>

    </template>

    <!-- NO RELEASE DATA -->
    <div v-else class="empty-state">
      <div class="empty-icon" aria-hidden="true">
        📋
      </div>

      <h3>No Release History Yet</h3>

      <p>
        Release notes will appear here when version
        information becomes available.
      </p>
    </div>

  </section>
</template>

<style scoped>
.version-history {
  width: 100%;
  margin: 42px 0;
}

/* HEADER */

.history-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.history-header h2 {
  margin: 0;
  padding: 0;
  border: none;
  color: var(--vp-c-text-1);
  font-size: 26px;
  font-weight: 700;
}

.history-header p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.release-count {
  padding: 7px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

/* FILTERS */

.history-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 20px;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
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

.filter-count {
  min-width: 21px;
  padding: 3px 6px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 11px;
  text-align: center;
}

.filter-button:focus-visible,
.reset-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.results-info {
  margin: 0 0 16px;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

/* RELEASE CARDS */

.release-list {
  display: grid;
  gap: 18px;
}

.release-card {
  min-width: 0;
  padding: 24px;
  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);
  box-shadow: var(--hub-card-shadow);
}

.release-top,
.release-version {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.release-top {
  justify-content: space-between;
}

.release-version h3 {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 21px;
  color: var(--vp-c-text-1);
}

.latest-badge {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
  font-size: 11px;
  font-weight: 650;
}

.release-date {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.release-title {
  margin: 18px 0 8px;
  padding: 0;
  font-size: 17px;
  font-weight: 650;
}

.release-description {
  margin: 0 0 18px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

/* CHANGE LIST */

.change-list {
  display: grid;
  gap: 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}

.change-item {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

.change-badge {
  flex-shrink: 0;
  padding: 4px 9px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
}

.change-badge.added {
  background: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.change-badge.changed {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
}

.change-badge.fixed {
  background: rgba(234, 179, 8, 0.12);
  color: #ca8a04;
}

.change-badge.removed {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
}

.change-description {
  flex: 1;
  min-width: 0;
  color: var(--vp-c-text-1);
  overflow-wrap: anywhere;
}

.no-changes {
  color: var(--vp-c-text-3);
  font-size: 13px;
}

/* EMPTY STATES */

.empty-state {
  padding: 40px 22px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: var(--hub-radius);
  text-align: center;
}

.empty-icon {
  font-size: 32px;
}

.empty-state h3 {
  margin: 12px 0 8px;
  padding: 0;
  font-size: 18px;
}

.empty-state p {
  max-width: 440px;
  margin: 0 auto;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.reset-button {
  margin-top: 18px;
  padding: 10px 16px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: var(--hub-radius-sm);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* MOBILE */

@media (max-width: 640px) {
  .history-header h2 {
    font-size: 23px;
  }

  .release-card {
    padding: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .filter-button {
    transition: none;
  }
}
</style>
