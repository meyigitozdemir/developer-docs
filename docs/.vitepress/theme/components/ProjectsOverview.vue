
<script setup lang="ts">
import { computed } from 'vue'

import { projects } from '../../data/projects'
import { platforms } from '../../data/platforms'

// Proje istatistikleri
const statistics = computed(() => [
  {
    label: 'Total Projects',
    value: projects.length,
    icon: '📁'
  },
  {
    label: 'Platforms',
    value: platforms.length,
    icon: '💻'
  },
  {
    label: 'Categories',
    value: new Set(
      projects.map(project =>
        `${project.platform}/${project.category}`
      )
    ).size,
    icon: '🗂️'
  },
  {
    label: 'Released',
    value: projects.filter(
      project => project.status === 'released'
    ).length,
    icon: '🚀'
  }
])
</script>

<template>
  <section class="projects-overview">
    <p class="projects-intro">
      Browse everything I'm building, explore documentation,
      and find released projects available to download.
    </p>

    <div class="projects-stats">
      <div
        v-for="stat in statistics"
        :key="stat.label"
        class="projects-stat hub-card"
      >
        <span class="stat-icon" aria-hidden="true">
          {{ stat.icon }}
        </span>

        <span class="stat-label">
          {{ stat.label }}
        </span>

        <strong class="stat-value">
          {{ stat.value }}
        </strong>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects-overview {
  width: 100%;
  margin: 26px 0 44px;
}

.projects-intro {
  margin: 0 0 24px;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.8;
}

.projects-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.projects-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  padding: 22px;

  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);
  box-shadow: var(--hub-card-shadow);
}

.stat-icon {
  font-size: 23px;
}

.stat-label {
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 500;
}

.stat-value {
  color: var(--vp-c-brand-1);
  font-size: 34px;
  font-weight: 750;
  line-height: 1;
}

@media (max-width: 768px) {
  .projects-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .projects-stats {
    gap: 10px;
  }

  .projects-stat {
    padding: 16px;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style>
