
<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { updates } from '../../data/updates'

// Ana sayfada gösterilecek güncelleme sayısı
const maxUpdates = 3

// Güncellemeleri yeniden eskiye doğru sırala
const latestUpdates = computed(() => {
  return [...updates]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, maxUpdates)
})

// Tarihi okunabilir biçimde göster
function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number)

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

// Güncellemenin bağlantısını hazırla
function getUpdateLink(link?: string): string | undefined {
  if (!link) return undefined

  if (link.startsWith('http://') || link.startsWith('https://')) {
    return link
  }

  return withBase(link)
}
</script>

<template>
  <section class="latest-updates">
    <div class="updates-header">
      <div>
        <h2>Latest Updates</h2>
        <p>Recent improvements, releases and milestones.</p>
      </div>

      <span class="updates-label">Development Log</span>
    </div>

    <div v-if="latestUpdates.length > 0" class="updates-list">
      <div
        v-for="update in latestUpdates"
        :key="update.id"
        class="update-item"
      >
        <div class="timeline-marker" aria-hidden="true">
          <span class="timeline-dot"></span>
        </div>

        <div class="update-content">
          <div class="update-meta">
            <time :datetime="update.date">
              {{ formatDate(update.date) }}
            </time>

            <span class="update-category">
              {{ update.category }}
            </span>
          </div>

          <h3>
            <a
              v-if="update.link"
              :href="getUpdateLink(update.link)"
              class="update-link"
            >
              {{ update.title }}
              <span aria-hidden="true">↗</span>
            </a>

            <span v-else>
              {{ update.title }}
            </span>
          </h3>

          <p>{{ update.description }}</p>
        </div>
      </div>
    </div>

    <p v-else class="empty-message">
      No updates available yet.
    </p>
  </section>
</template>

<style scoped>
.latest-updates {
  margin: 48px 0;
}

.updates-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}

.updates-header h2 {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 26px;
  font-weight: 700;
}

.updates-header p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.updates-label {
  padding: 6px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.updates-list {
  position: relative;
  padding-left: 28px;
  border-left: 2px solid var(--vp-c-divider);
}

.update-item {
  position: relative;
  padding: 0 0 32px 18px;
}

.update-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -36px;
  top: 5px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg);
}

.timeline-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

.update-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
}

.update-meta time {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.update-category {
  padding: 4px 9px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 600;
}

.update-content h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 650;
}

.update-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.update-link:hover {
  color: var(--vp-c-brand-1);
}

.update-content p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.empty-message {
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .updates-header h2 {
    font-size: 23px;
  }
}
</style>
