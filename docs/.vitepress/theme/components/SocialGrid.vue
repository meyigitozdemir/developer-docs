
<script setup lang="ts">
import { computed, ref } from 'vue'
import { socials } from '../../data/socials.ts'

// =====================================
// SEARCH & FILTERS
// =====================================

const searchQuery = ref('')
const selectedPlatform = ref('all')

// Platformların görünme sırası
const platformOrder = [
  'YouTube',
  'Kick',
  'Twitch',
  'TikTok',
  'Instagram',
  'Discord',
  'GitHub',
  'X'
]

// Platform listesini otomatik oluştur
const platforms = computed(() => {
  const names = [...new Set(
    socials.map(account => account.platform)
  )]

  return names.sort((a, b) => {
    const aIndex = platformOrder.indexOf(a)
    const bIndex = platformOrder.indexOf(b)

    const aRank = aIndex === -1 ? 999 : aIndex
    const bRank = bIndex === -1 ? 999 : bIndex

    if (aRank !== bRank) return aRank - bRank

    return a.localeCompare(b)
  })
})

// Arama ve seçili platforma göre filtrele
const filteredSocials = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase()

  return socials.filter(account => {
    const matchesPlatform =
      selectedPlatform.value === 'all' ||
      account.platform === selectedPlatform.value

    const searchableText = [
      account.platform,
      account.name,
      account.description,
      account.category
    ].join(' ').toLocaleLowerCase()

    return (
      matchesPlatform &&
      (query === '' || searchableText.includes(query))
    )
  })
})

// Hesapları platform başlıkları altında grupla
const groupedSocials = computed(() => {
  return platforms.value
    .map(platform => ({
      name: platform,
      accounts: filteredSocials.value.filter(
        account => account.platform === platform
      )
    }))
    .filter(group => group.accounts.length > 0)
})

// Filtreleri sıfırla
function clearFilters() {
  searchQuery.value = ''
  selectedPlatform.value = 'all'
}

// =====================================
// ICONS & PLATFORM COLORS
// =====================================

function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    YouTube: '▶',
    Kick: '📡',
    Twitch: '🎮',
    TikTok: '♪',
    Instagram: '📷',
    Discord: '💬',
    GitHub: '⌘',
    X: '𝕏'
  }

  return icons[platform] ?? '🌐'
}

function getPlatformClass(platform: string): string {
  const classes: Record<string, string> = {
    YouTube: 'youtube',
    Kick: 'kick',
    Twitch: 'twitch',
    TikTok: 'tiktok',
    Instagram: 'instagram',
    Discord: 'discord',
    GitHub: 'github',
    X: 'twitter'
  }

  return classes[platform] ?? 'other'
}

function getPlatformCount(platform: string): number {
  return socials.filter(
    account => account.platform === platform
  ).length
}
</script>

<template>
  <div class="socials-hub">

    <!-- OVERVIEW -->
    <div class="socials-overview">
      <div class="overview-stat hub-card">
        <span class="stat-label">Social Accounts</span>
        <strong>{{ socials.length }}</strong>
      </div>

      <div class="overview-stat hub-card">
        <span class="stat-label">Platforms</span>
        <strong>{{ platforms.length }}</strong>
      </div>
    </div>

    <!-- SEARCH -->
    <div class="search-section">
      <label for="social-search">
        Find a Channel
      </label>

      <div class="search-field">
        <span aria-hidden="true">⌕</span>

        <input
          id="social-search"
          v-model="searchQuery"
          type="search"
          placeholder="Search channels, platforms or categories..."
          autocomplete="off"
        />
      </div>
    </div>

    <!-- PLATFORM FILTERS -->
    <div
      class="platform-filters"
      role="group"
      aria-label="Filter social media platforms"
    >
      <button
        type="button"
        class="filter-button"
        :class="{ active: selectedPlatform === 'all' }"
        :aria-pressed="selectedPlatform === 'all'"
        @click="selectedPlatform = 'all'"
      >
        All Platforms
        <span class="filter-count">
          {{ socials.length }}
        </span>
      </button>

      <button
        v-for="platform in platforms"
        :key="platform"
        type="button"
        class="filter-button"
        :class="{ active: selectedPlatform === platform }"
        :aria-pressed="selectedPlatform === platform"
        @click="selectedPlatform = platform"
      >
        {{ platform }}

        <span class="filter-count">
          {{ getPlatformCount(platform) }}
        </span>
      </button>
    </div>

    <!-- RESULTS -->
    <div class="results-bar">
      <span aria-live="polite">
        Showing
        <strong>{{ filteredSocials.length }}</strong>
        of {{ socials.length }} accounts
      </span>

      <button
        v-if="selectedPlatform !== 'all' || searchQuery"
        type="button"
        class="clear-button"
        @click="clearFilters"
      >
        Clear Filters
      </button>
    </div>

    <!-- PLATFORM GROUPS -->
    <div
      v-if="groupedSocials.length > 0"
      class="platform-groups"
    >
      <section
        v-for="group in groupedSocials"
        :key="group.name"
        class="platform-section"
      >
        <div class="platform-header">
          <div class="platform-title">
            <span
              class="platform-icon"
              :class="getPlatformClass(group.name)"
              aria-hidden="true"
            >
              {{ getPlatformIcon(group.name) }}
            </span>

            <div class="platform-heading">
              <h2>{{ group.name }}</h2>

              <p>
                {{ group.accounts.length }}
                {{
                  group.accounts.length === 1
                    ? 'account'
                    : 'accounts'
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- ACCOUNTS -->
        <div class="account-grid">
          <a
            v-for="account in group.accounts"
            :key="account.url"
            :href="account.url"
            target="_blank"
            rel="noopener noreferrer"
            class="account-card hub-card hub-card--interactive"
          >
            <div class="account-top">
              <span class="account-category">
                {{ account.category }}
              </span>

              <span
                class="external-arrow"
                aria-hidden="true"
              >
                ↗
              </span>
            </div>

            <div class="account-info">
              <h3>{{ account.name }}</h3>

              <p>{{ account.description }}</p>
            </div>

            <div class="account-footer">
              <span>Visit Channel</span>

              <span aria-hidden="true">
                →
              </span>
            </div>
          </a>
        </div>
      </section>
    </div>

    <!-- EMPTY STATE -->
    <div v-else class="empty-state">
      <span class="empty-icon" aria-hidden="true">
        🔎
      </span>

      <h3>No channels found</h3>

      <p>
        Try another search or choose a different platform.
      </p>

      <button
        type="button"
        class="reset-button"
        @click="clearFilters"
      >
        Show All Channels
      </button>
    </div>

  </div>
</template>

<style scoped>
.socials-hub {
  width: 100%;
  margin: 28px 0 48px;
}

/* OVERVIEW */

.socials-overview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 34px;
}

.overview-stat {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 24px;

  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);
  box-shadow: var(--hub-card-shadow);
}

.stat-label {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.overview-stat strong {
  color: var(--vp-c-brand-1);
  font-size: 34px;
  line-height: 1.2;
}

/* SEARCH */

.search-section {
  margin-bottom: 22px;
}

.search-section label {
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

  border: 1px solid var(--vp-c-divider);
  border-radius: var(--hub-radius-sm);
  background: var(--vp-c-bg-soft);
}

.search-field:focus-within {
  border-color: var(--vp-c-brand-1);
}

.search-field > span {
  color: var(--vp-c-text-3);
  font-size: 25px;
}

.search-field input {
  width: 100%;
  min-width: 0;
  height: 50px;

  border: none;
  outline: none;
  background: transparent;

  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 14px;
}

/* FILTERS */

.platform-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 24px;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 10px 14px;

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
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.filter-button.active {
  background: var(--vp-c-brand-soft);
}

.filter-count {
  min-width: 22px;
  padding: 3px 6px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 11px;
  text-align: center;
}

.filter-button:focus-visible,
.clear-button:focus-visible,
.reset-button:focus-visible {
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
  margin-bottom: 30px;

  color: var(--vp-c-text-2);
  font-size: 13px;
}

.clear-button {
  border: none;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

/* PLATFORM SECTIONS */

.platform-groups {
  display: grid;
  gap: 42px;
}

.platform-header {
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.platform-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.platform-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 52px;
  height: 52px;
  border-radius: 14px;

  font-size: 25px;
  font-weight: 700;
}

.platform-heading h2 {
  margin: 0;
  padding: 0;
  border: none;

  color: var(--vp-c-text-1);
  font-size: 22px;
  font-weight: 700;
}

.platform-heading p {
  margin: 4px 0 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

/* PLATFORM COLORS */

.youtube {
  background: #fee2e2;
  color: #dc2626;
}

.kick {
  background: #dcfce7;
  color: #15803d;
}

.twitch {
  background: #ede9fe;
  color: #6d28d9;
}

.tiktok,
.github,
.twitter {
  background: #e5e7eb;
  color: #111827;
}

.instagram {
  background: #fce7f3;
  color: #be185d;
}

.discord {
  background: #e0e7ff;
  color: #4338ca;
}

.other {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

/* ACCOUNT CARDS */

.account-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 18px;
}

.account-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
  padding: 22px;

  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);
  box-shadow: var(--hub-card-shadow);

  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: var(--hub-transition);
}

.account-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--hub-card-shadow-hover);
}

.account-card:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.account-top,
.account-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.account-category {
  display: inline-flex;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 600;
}

.external-arrow {
  color: var(--vp-c-brand-1);
  font-size: 20px;
}

.account-info {
  flex: 1;
  min-width: 0;
}

.account-info h3 {
  margin: 0 0 10px;
  padding: 0;
  border: none;

  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: 700;
  overflow-wrap: anywhere;
}

.account-info p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.account-footer {
  padding-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
}

/* EMPTY STATE */

.empty-state {
  padding: 44px 20px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: var(--hub-radius);
  text-align: center;
}

.empty-icon {
  font-size: 32px;
}

.empty-state h3 {
  margin: 12px 0 8px;
  font-size: 18px;
}

.empty-state p {
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.reset-button {
  margin-top: 16px;
  padding: 10px 16px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: var(--hub-radius-sm);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  cursor: pointer;
}

/* MOBILE */

@media (max-width: 640px) {
  .socials-overview {
    gap: 10px;
  }

  .overview-stat {
    padding: 18px;
  }

  .overview-stat strong {
    font-size: 29px;
  }

  .platform-groups {
    gap: 32px;
  }

  .account-grid {
    gap: 14px;
  }

  .account-card {
    padding: 18px;
  }

  .platform-heading h2 {
    font-size: 20px;
  }
}

/* ACCESSIBILITY */

@media (prefers-reduced-motion: reduce) {
  .account-card,
  .filter-button {
    transition: none;
  }

  .account-card:hover {
    transform: none;
  }
}
</style>
