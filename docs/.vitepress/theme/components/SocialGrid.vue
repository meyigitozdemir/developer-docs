
<script setup lang="ts">
import { computed, ref } from 'vue'
import { socials } from '../../data/socials'

// Seçili sosyal medya kategorisi
const selectedCategory = ref('All')

// Kategorileri hesap listesinden otomatik oluştur
const categories = computed(() => [
  'All',
  ...new Set(socials.map(account => account.category))
])

// Seçili kategoriye göre hesapları filtrele
const filteredSocials = computed(() => {
  if (selectedCategory.value === 'All') {
    return socials
  }

  return socials.filter(
    account => account.category === selectedCategory.value
  )
})

// Platforma göre simge
function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    YouTube: '▶',
    Kick: '📡',
    Instagram: '📷',
    GitHub: '💻',
    Discord: '💬',
    TikTok: '♪',
    Twitch: '🎮'
  }

  return icons[platform] ?? '🌐'
}

// Platforma göre renk sınıfı
function getPlatformClass(platform: string): string {
  const classes: Record<string, string> = {
    YouTube: 'youtube',
    Kick: 'kick',
    Instagram: 'instagram',
    GitHub: 'github',
    Discord: 'discord',
    TikTok: 'tiktok',
    Twitch: 'twitch'
  }

  return classes[platform] ?? 'other'
}
</script>

<template>
  <div class="social-hub">

    <!-- KATEGORİ FİLTRELERİ -->
    <div class="social-filters" aria-label="Filter channels">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        class="filter-button"
        :class="{ active: selectedCategory === category }"
        :aria-pressed="selectedCategory === category"
        @click="selectedCategory = category"
      >
        {{ category === 'All' ? 'All Channels' : category }}
        <span class="filter-count">
          {{
            category === 'All'
              ? socials.length
              : socials.filter(account => account.category === category).length
          }}
        </span>
      </button>
    </div>

    <!-- SOSYAL MEDYA KARTLARI -->
    <div class="social-grid">
      <a
        v-for="account in filteredSocials"
        :key="account.url"
        :href="account.url"
        target="_blank"
        rel="noopener noreferrer"
        class="social-card hub-card hub-card--interactive"
      >
        <div
          class="social-icon"
          :class="getPlatformClass(account.platform)"
          aria-hidden="true"
        >
          {{ getPlatformIcon(account.platform) }}
        </div>

        <div class="social-info">
          <span class="platform-name">
            {{ account.platform }}
          </span>

          <h3>{{ account.name }}</h3>

          <p>{{ account.description }}</p>

          <span class="social-category">
            {{ account.category }}
          </span>

          <div class="card-footer">
            <span>Visit Channel</span>
            <span aria-hidden="true">↗</span>
          </div>
        </div>
      </a>
    </div>

    <p v-if="filteredSocials.length === 0" class="empty-message">
      No accounts found in this category.
    </p>

  </div>
</template>

<style scoped>
.social-hub {
  width: 100%;
  margin-top: 24px;
}

/* KATEGORİ FİLTRELERİ */

.social-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 26px;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
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

.filter-button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.filter-button.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.filter-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 22px;
  height: 22px;
  padding: 0 5px;

  border-radius: 999px;
  background: var(--vp-c-bg);

  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 600;
}

.filter-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

/* KART DÜZENİ */

.social-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 280px), 1fr)
  );
  gap: 20px;
}

.social-card {
  display: flex;
  align-items: flex-start;
  gap: 18px;
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

.social-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--hub-card-shadow-hover);
}

.social-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

/* PLATFORM SİMGELERİ */

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 52px;
  height: 52px;

  border-radius: var(--hub-radius-sm);

  font-size: 25px;
  font-weight: 700;
}

.youtube {
  background: #fee2e2;
  color: #dc2626;
}

.kick {
  background: #dcfce7;
  color: #15803d;
}

.instagram {
  background: #fce7f3;
  color: #be185d;
}

.github {
  background: #e5e7eb;
  color: #111827;
}

.discord {
  background: #e0e7ff;
  color: #4338ca;
}

.tiktok {
  background: #e5e7eb;
  color: #111827;
}

.twitch {
  background: #ede9fe;
  color: #6d28d9;
}

.other {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

/* KART İÇERİĞİ */

.social-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.platform-name {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.social-info h3 {
  margin: 5px 0;
  padding: 0;
  border: none;

  color: var(--vp-c-text-1);
  font-size: 19px;
  font-weight: 650;

  overflow-wrap: anywhere;
}

.social-info p {
  flex: 1;
  margin: 8px 0 14px;

  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}

.social-category {
  display: inline-flex;
  align-self: flex-start;
  padding: 5px 9px;

  border-radius: 999px;
  background: var(--vp-c-bg);

  color: var(--vp-c-text-2);
  font-size: 11px;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 18px;
  padding-top: 14px;

  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-brand-1);

  font-size: 13px;
  font-weight: 600;
}

.empty-message {
  color: var(--vp-c-text-2);
}

/* MOBİL UYUMLULUK */

@media (max-width: 640px) {
  .social-grid {
    gap: 14px;
  }

  .social-card {
    padding: 20px;
  }

  .social-filters {
    gap: 8px;
  }
}

/* HAREKET HASSASİYETİ */

@media (prefers-reduced-motion: reduce) {
  .social-card,
  .filter-button {
    transition: none;
  }

  .social-card:hover {
    transform: none;
  }
}
</style>
