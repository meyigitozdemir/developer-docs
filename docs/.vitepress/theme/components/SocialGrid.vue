
<script setup lang="ts">
import { computed, ref } from 'vue'
import { socials } from '../../data/socials.ts'

// =====================================
// PLATFORM CONFIGURATION
// =====================================

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

const platformConfig: Record<string, {
  icon: string
  symbol: string
  cssClass: string
}> = {
  YouTube: {
    icon: 'youtube',
    symbol: '▶',
    cssClass: 'youtube'
  },
  Kick: {
    icon: 'kick',
    symbol: 'K',
    cssClass: 'kick'
  },
  Twitch: {
    icon: 'twitch',
    symbol: 'T',
    cssClass: 'twitch'
  },
  TikTok: {
    icon: 'tiktok',
    symbol: '♪',
    cssClass: 'tiktok'
  },
  Instagram: {
    icon: 'instagram',
    symbol: '◎',
    cssClass: 'instagram'
  },
  Discord: {
    icon: 'discord',
    symbol: 'D',
    cssClass: 'discord'
  },
  GitHub: {
    icon: 'github',
    symbol: 'G',
    cssClass: 'github'
  },
  X: {
    icon: 'x',
    symbol: '𝕏',
    cssClass: 'twitter'
  }
}

// =====================================
// LOCAL PROFILE IMAGES
// =====================================

// Profil fotoğraflarını otomatik bul.
// Vite görselleri derleme sırasında işler.
const avatarFiles = import.meta.glob<string>(
  '../assets/social-avatars/*.{png,jpg,jpeg,webp}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

// Dosya adlarını hesap adlarıyla eşleştir.
const avatarMap: Record<string, string> = {}

for (const [path, url] of Object.entries(avatarFiles)) {
  const filename = path.split('/').pop() ?? ''

  const key = filename
    .replace(/\.(png|jpg|jpeg|webp)$/i, '')
    .toLowerCase()

  avatarMap[key] = url
}

// Hesap adını dosya adına dönüştür.
function getAvatarKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Hatalı fotoğraflar için yedek görünüm
const failedAvatars = ref<Record<string, boolean>>({})

function getAvatarUrl(name: string): string | undefined {
  const key = getAvatarKey(name)

  if (failedAvatars.value[key]) {
    return undefined
  }

  return avatarMap[key]
}

function handleAvatarError(name: string) {
  failedAvatars.value[getAvatarKey(name)] = true
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return '?'
  }

  return parts
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('')
}

// =====================================
// PLATFORM ICONS
// =====================================

const failedIcons = ref<Record<string, boolean>>({})

function getPlatformIcon(platform: string): string | undefined {
  const config = platformConfig[platform]

  if (!config || failedIcons.value[platform]) {
    return undefined
  }

  const color = platform === 'Kick'
    ? '101010'
    : 'FFFFFF'

  return `https://cdn.simpleicons.org/${config.icon}/${color}`
}

function handleIconError(platform: string) {
  failedIcons.value[platform] = true
}

function getPlatformSymbol(platform: string): string {
  return platformConfig[platform]?.symbol ?? '🌐'
}

function getPlatformClass(platform: string): string {
  return platformConfig[platform]?.cssClass ?? 'other'
}

// =====================================
// SEARCH AND FILTERS
// =====================================

const searchQuery = ref('')
const selectedPlatform = ref('all')

const platforms = computed(() => {
  const result = [...new Set(
    socials.map(account => account.platform)
  )]

  return result.sort((a, b) => {
    const first = platformOrder.indexOf(a)
    const second = platformOrder.indexOf(b)

    const firstRank = first === -1 ? 999 : first
    const secondRank = second === -1 ? 999 : second

    return firstRank - secondRank || a.localeCompare(b)
  })
})

const filteredSocials = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return socials.filter(account => {
    const matchesPlatform =
      selectedPlatform.value === 'all' ||
      account.platform === selectedPlatform.value

    const searchableText = [
      account.name,
      account.platform,
      account.description,
      account.category
    ].join(' ').toLowerCase()

    return (
      matchesPlatform &&
      searchableText.includes(query)
    )
  })
})

// Main Channels önce, Alternative Channels sonra.
function getCategoryOrder(category: string): number {
  const value = category.toLowerCase()

  if (value.includes('main')) return 0
  if (value.includes('alternative')) return 1

  return 2
}

const groupedSocials = computed(() => {
  return platforms.value
    .map(platform => ({
      name: platform,
      accounts: filteredSocials.value
        .filter(account => account.platform === platform)
        .sort((a, b) =>
          getCategoryOrder(a.category) -
          getCategoryOrder(b.category)
        )
    }))
    .filter(group => group.accounts.length > 0)
})

function getPlatformCount(platform: string): number {
  return socials.filter(
    account => account.platform === platform
  ).length
}

function resetFilters() {
  searchQuery.value = ''
  selectedPlatform.value = 'all'
}
</script>

<template>
  <div class="socials-hub">

    <!-- STATISTICS -->
    <div class="overview-grid">
      <div class="overview-card hub-card">
        <span>Total Accounts</span>
        <strong>{{ socials.length }}</strong>
      </div>

      <div class="overview-card hub-card">
        <span>Platforms</span>
        <strong>{{ platforms.length }}</strong>
      </div>
    </div>

    <!-- SEARCH -->
    <div class="search-section">
      <label for="social-search">
        Find a Channel
      </label>

      <input
        id="social-search"
        v-model="searchQuery"
        type="search"
        placeholder="Search accounts, platforms or categories..."
        autocomplete="off"
      />
    </div>

    <!-- FILTERS -->
    <div class="platform-filters" role="group" aria-label="Filter platforms">
      <button
        type="button"
        class="filter-button"
        :class="{ active: selectedPlatform === 'all' }"
        :aria-pressed="selectedPlatform === 'all'"
        @click="selectedPlatform = 'all'"
      >
        All Platforms
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
        Showing {{ filteredSocials.length }}
        of {{ socials.length }} accounts
      </span>

      <button
        v-if="searchQuery || selectedPlatform !== 'all'"
        type="button"
        class="reset-button"
        @click="resetFilters"
      >
        Clear Filters
      </button>
    </div>

    <!-- PLATFORM GROUPS -->
    <div v-if="groupedSocials.length" class="platform-groups">
      <section
        v-for="group in groupedSocials"
        :key="group.name"
        class="platform-section"
      >
        <div class="platform-heading">
          <div
            class="brand-icon"
            :class="getPlatformClass(group.name)"
          >
            <img
              v-if="getPlatformIcon(group.name)"
              :src="getPlatformIcon(group.name)"
              alt=""
              width="26"
              height="26"
              @error="handleIconError(group.name)"
            />

            <span v-else aria-hidden="true">
              {{ getPlatformSymbol(group.name) }}
            </span>
          </div>

          <div>
            <h2>{{ group.name }}</h2>
            <p>
              {{ group.accounts.length }}
              {{ group.accounts.length === 1 ? 'account' : 'accounts' }}
            </p>
          </div>
        </div>

        <!-- ACCOUNT CARDS -->
        <div class="account-grid">
          <a
            v-for="account in group.accounts"
            :key="account.url"
            :href="account.url"
            target="_blank"
            rel="noopener noreferrer"
            class="account-card hub-card hub-card--interactive"
          >
            <div
              class="account-cover"
              :class="getPlatformClass(group.name)"
            >
              <img
                v-if="getPlatformIcon(group.name)"
                :src="getPlatformIcon(group.name)"
                alt=""
                width="36"
                height="36"
                @error="handleIconError(group.name)"
              />

              <span v-else class="cover-symbol">
                {{ getPlatformSymbol(group.name) }}
              </span>

              <span class="cover-category">
                {{ account.category }}
              </span>
            </div>

            <div class="account-body">

              <!-- REAL AVATAR OR FALLBACK -->
              <div class="account-avatar">
                <img
                  v-if="getAvatarUrl(account.name)"
                  :src="getAvatarUrl(account.name)"
                  :alt="`${account.name} profile picture`"
                  loading="lazy"
                  @error="handleAvatarError(account.name)"
                />

                <span v-else>
                  {{ getInitials(account.name) }}
                </span>
              </div>

              <h3>{{ account.name }}</h3>

              <span class="account-platform">
                {{ account.platform }}
              </span>

              <p>{{ account.description }}</p>

              <div class="account-footer">
                <span>Visit Channel</span>
                <span aria-hidden="true">↗</span>
              </div>
            </div>
          </a>
        </div>
      </section>
    </div>

    <!-- EMPTY STATE -->
    <div v-else class="empty-state">
      <h3>No Channels Found</h3>

      <p>
        Try another search term or platform.
      </p>

      <button
        type="button"
        class="reset-button"
        @click="resetFilters"
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

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.overview-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
}

.overview-card span {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.overview-card strong {
  color: var(--vp-c-brand-1);
  font-size: 32px;
}

.search-section {
  margin-bottom: 20px;
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

.search-section input:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.platform-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  margin-bottom: 22px;
}

.filter-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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

.filter-count {
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--vp-c-bg);
  font-size: 11px;
}

.results-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 30px;
  color: var(--vp-c-text-2);
  font-size: 13px;
}

.reset-button {
  border: none;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.platform-groups {
  display: grid;
  gap: 42px;
}

.platform-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 16px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.brand-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 13px;
  font-size: 24px;
  font-weight: 800;
}

.brand-icon img,
.account-cover > img {
  display: block;
  object-fit: contain;
}

.platform-heading h2 {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 22px;
}

.platform-heading p {
  margin: 4px 0 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.youtube {
  background: #ff0033;
  color: #fff;
}

.kick {
  background: #53fc18;
  color: #101010;
}

.twitch {
  background: #9146ff;
  color: #fff;
}

.tiktok {
  background: #161616;
  color: #fff;
}

.instagram {
  background: linear-gradient(135deg, #833ab4, #e1306c, #f77737);
  color: #fff;
}

.discord {
  background: #5865f2;
  color: #fff;
}

.github {
  background: #24292f;
  color: #fff;
}

.twitter {
  background: #111;
  color: #fff;
}

.other {
  background: var(--vp-c-brand-2);
  color: #fff;
}

.account-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 270px), 1fr));
  gap: 18px;
}

.account-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  padding: 0;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.account-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--hub-card-shadow-hover);
}

.account-cover {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-height: 96px;
  padding: 22px;
}

.cover-symbol {
  font-size: 30px;
  font-weight: 800;
}

.cover-category {
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.85);
  color: #111827;
  font-size: 11px;
  font-weight: 700;
}

.account-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 0 22px 20px;
}

.account-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 62px;
  height: 62px;
  margin-top: -30px;
  margin-bottom: 12px;
  border: 4px solid var(--hub-card-bg);
  border-radius: 50%;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 19px;
  font-weight: 750;
  position: relative;
  overflow: hidden;
}

.account-avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.account-body h3 {
  margin: 0;
  padding: 0;
  border: none;
  color: var(--vp-c-text-1);
  font-size: 20px;
  overflow-wrap: anywhere;
}

.account-platform {
  margin-top: 4px;
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.account-body p {
  flex: 1;
  margin: 12px 0 18px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.account-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
}

.empty-state {
  padding: 40px 20px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: var(--hub-radius);
  text-align: center;
}

.empty-state p {
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .overview-grid {
    gap: 10px;
  }

  .overview-card {
    padding: 16px;
  }

  .account-grid {
    gap: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .account-card:hover {
    transform: none;
  }
}
</style>
