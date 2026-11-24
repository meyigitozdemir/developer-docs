
<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

import { projects } from '../../data/projects'
import { platforms } from '../../data/platforms'
import type { ProjectStatus } from '../../data/projects'

// Sayfada hangi projenin gösterileceği
const props = defineProps<{
  slug: string
}>()

// Projeyi veri listesinden bul
const project = computed(() => {
  return projects.find(item => item.slug === props.slug)
})

// Platform adını bul
const platformName = computed(() => {
  if (!project.value) return ''

  return platforms.find(
    item => item.slug === project.value?.platform
  )?.name ?? project.value.platform
})

// Kategori adını bul
const categoryName = computed(() => {
  if (!project.value) return ''

  const platform = platforms.find(
    item => item.slug === project.value?.platform
  )

  return platform?.categories.find(
    item => item.slug === project.value?.category
  )?.name ?? project.value.category
})

// Durum etiketi
function statusLabel(status?: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    'in-development': 'In Development',
    released: 'Released',
    archived: 'Archived'
  }

  return status ? labels[status] : 'Not Specified'
}

// Ana dokümantasyon yolu
const projectPath = computed(() => {
  if (!project.value) return ''

  const { platform, category, slug } = project.value

  return `/projects/${platform}/${category}/${slug}/`
})

// Tarih biçimlendirme
function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00Z`)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(date)
}
</script>

<template>
  <div v-if="project" class="project-details">

    <!-- PROJECT HEADER -->
    <div class="details-header">
      <div class="details-icon" aria-hidden="true">
        🧩
      </div>

      <div class="details-heading">
        <div class="details-eyebrow">
          {{ platformName }} / {{ categoryName }}
        </div>

        <h2>{{ project.title }}</h2>

        <p>{{ project.description }}</p>
      </div>
    </div>

    <!-- STATUS & METADATA -->
    <div class="details-stats">
      <div class="detail-stat hub-card">
        <span class="stat-label">Status</span>

        <span
          class="status-value"
          :class="project.status ?? 'unspecified'"
        >
          {{ statusLabel(project.status) }}
        </span>
      </div>

      <div class="detail-stat hub-card">
        <span class="stat-label">Version</span>

        <strong>
          {{
            project.version
              ? `v${project.version.replace(/^v/i, '')}`
              : 'Not specified'
          }}
        </strong>
      </div>

      <div class="detail-stat hub-card">
        <span class="stat-label">Platform</span>

        <strong>{{ platformName }}</strong>
      </div>

      <div class="detail-stat hub-card">
        <span class="stat-label">Release Date</span>

        <strong>
          {{
            project.releaseDate
              ? formatDate(project.releaseDate)
              : 'Not specified'
          }}
        </strong>
      </div>
    </div>

    <!-- PROJECT LINKS -->
    <section
      v-if="project.links && Object.values(project.links).some(Boolean)"
      class="details-section"
    >
      <h2>Get This Project</h2>

      <p>
        Access this project through the links below.
      </p>

      <div class="details-actions">
        <a
          v-if="project.links.download"
          :href="project.links.download"
          target="_blank"
          rel="noopener noreferrer"
          class="action-button primary-button"
        >
          Download / Get Plugin ↗
        </a>

        <a
          v-if="project.links.github"
          :href="project.links.github"
          target="_blank"
          rel="noopener noreferrer"
          class="action-button secondary-button"
        >
          GitHub Repository ↗
        </a>

        <a
          v-if="project.links.documentation"
          :href="project.links.documentation.startsWith('/') ? withBase(project.links.documentation) : project.links.documentation"
          class="action-button secondary-button"
        >
          Documentation ↗
        </a>

        <a
          v-if="project.links.website"
          :href="project.links.website"
          target="_blank"
          rel="noopener noreferrer"
          class="action-button secondary-button"
        >
          Website ↗
        </a>
      </div>
    </section>

    <!-- PROJECT TAGS -->
    <section
      v-if="project.tags.length"
      class="details-section"
    >
      <h2>Technologies & Features</h2>

      <div class="details-tags">
        <span
          v-for="tag in project.tags"
          :key="tag"
          class="detail-tag"
        >
          {{ tag }}
        </span>
      </div>
    </section>

    <!-- DOCUMENTATION -->
    <section
      v-if="project.docs?.length"
      class="details-section"
    >
      <h2>Documentation</h2>

      <p>
        Learn how to install, configure and use this project.
      </p>

      <div class="documentation-grid">
        <a
          v-for="page in project.docs"
          :key="page.slug"
          :href="withBase(`${projectPath}${page.slug}`)"
          class="documentation-card hub-card hub-card--interactive"
        >
          <span class="documentation-icon" aria-hidden="true">
            📄
          </span>

          <span class="documentation-title">
            {{ page.title }}
          </span>

          <span class="documentation-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>
    </section>

    <!-- BACK TO PROJECTS -->
    <div class="details-footer">
      <a :href="withBase('/projects/')">
        ← Explore All Projects
      </a>
    </div>
  </div>

  <div v-else class="details-empty">
    <h2>Project Not Found</h2>
    <p>The requested project could not be found.</p>

    <a :href="withBase('/projects/')">
      ← Back to Projects
    </a>
  </div>
</template>

<style scoped>
.project-details {
  width: 100%;
  margin: 24px 0 48px;
}

/* HEADER */

.details-header {
  display: flex;
  align-items: flex-start;
  gap: 22px;
  margin-bottom: 30px;
}

.details-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 76px;
  height: 76px;

  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);

  font-size: 36px;
}

.details-heading {
  min-width: 0;
}

.details-eyebrow {
  margin-bottom: 8px;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
}

.details-heading h2 {
  margin: 0;
  padding: 0;
  border: none;
  color: var(--vp-c-text-1);
  font-size: clamp(25px, 4vw, 36px);
  font-weight: 750;
  overflow-wrap: anywhere;
}

.details-heading p {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.8;
}

/* METADATA */

.details-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 40px;
}

.detail-stat {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;
  padding: 20px;

  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);
}

.stat-label {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.detail-stat strong {
  color: var(--vp-c-text-1);
  font-size: 15px;
  overflow-wrap: anywhere;
}

.status-value {
  align-self: flex-start;
  font-size: 14px;
  font-weight: 700;
}

.status-value.released {
  color: #16a34a;
}

.status-value.in-development {
  color: #3b82f6;
}

.status-value.archived,
.status-value.unspecified {
  color: var(--vp-c-text-2);
}

/* SECTIONS */

.details-section {
  margin: 42px 0;
}

.details-section h2 {
  margin: 0 0 12px;
  padding: 0;
  border: none;
  font-size: 23px;
  font-weight: 700;
}

.details-section p {
  margin: 0 0 20px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

/* BUTTONS */

.details-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;

  border-radius: var(--hub-radius-sm);
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;

  transition: opacity 0.2s ease;
}

.action-button:hover {
  opacity: 0.85;
}

.primary-button {
  background: var(--vp-c-brand-1);
  color: var(--vp-c-bg);
}

.secondary-button {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

/* TAGS */

.details-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.detail-tag {
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

/* DOCUMENTATION */

.documentation-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 14px;
}

.documentation-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 18px;

  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);

  color: var(--vp-c-text-1);
  text-decoration: none;
}

.documentation-icon {
  font-size: 22px;
}

.documentation-title {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
}

.documentation-arrow {
  color: var(--vp-c-brand-1);
}

/* FOOTER */

.details-footer {
  margin-top: 42px;
  padding-top: 22px;
  border-top: 1px solid var(--vp-c-divider);
}

.details-footer a,
.details-empty a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

/* EMPTY */

.details-empty {
  padding: 40px 0;
}

.details-empty p {
  color: var(--vp-c-text-2);
}

/* MOBILE */

@media (max-width: 640px) {
  .details-header {
    flex-direction: column;
    gap: 16px;
  }

  .details-icon {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }

  .details-stats {
    gap: 10px;
  }

  .detail-stat {
    padding: 15px;
  }

  .details-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .action-button {
    transition: none;
  }
}
</style>
