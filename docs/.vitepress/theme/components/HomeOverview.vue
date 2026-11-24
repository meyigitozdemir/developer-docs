
<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'

import { platforms } from '../../data/platforms'
import { projects } from '../../data/projects'
import { socials } from '../../data/socials'

// =====================================
// SETTINGS
// =====================================

const maxSocialAccounts = 4

// =====================================
// DEVELOPER HUB STATISTICS
// =====================================

const statistics = computed(() => [
  {
    label: 'Projects',
    value: projects.length,
    icon: '📁',
    link: withBase('/projects/')
  },
  {
    label: 'Platforms',
    value: platforms.length,
    icon: '💻',
    link: withBase('/projects/')
  },
  {
    label: 'Social Accounts',
    value: socials.length,
    icon: '🌐',
    link: withBase('/socials/')
  }
])

// =====================================
// FEATURED SOCIAL ACCOUNTS
// =====================================

const featuredSocials = computed(() => {
  return socials.slice(0, maxSocialAccounts)
})

// =====================================
// PROFILE PICTURES
// =====================================

// Socials sayfasıyla aynı avatar klasörünü kullan.
const avatarFiles = import.meta.glob<string>(
  '../assets/social-avatars/*.{png,jpg,jpeg,webp}',
  {
    eager: true,
    query: '?url',
    import: 'default'
  }
)

// Dosya isimlerini avatar adresleriyle eşleştir.
const avatarMap: Record<string, string> = {}

for (const [path, url] of Object.entries(avatarFiles)) {
  const filename = path.split('/').pop() ?? ''

  const key = filename
    .replace(/\.(png|jpg|jpeg|webp)$/i, '')
    .toLowerCase()

  avatarMap[key] = url
}

// Hesap adından dosya anahtarı oluştur.
function getAvatarKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Yüklenemeyen avatarları takip et.
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

// Profil fotoğrafı yoksa baş harfleri göster.
function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)

  if (words.length === 0) return '?'

  return words
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('')
}

// =====================================
// PLATFORM ICONS
// =====================================

function getSocialIcon(platform: string): string {
  const icons: Record<string, string> = {
    YouTube: '▶',
    Kick: 'K',
    Instagram: '◎',
    GitHub: '⌘',
    Discord: 'D',
    Twitch: 'T',
    TikTok: '♪',
    X: '𝕏'
  }

  return icons[platform] ?? '🌐'
}

function getPlatformClass(platform: string): string {
  const classes: Record<string, string> = {
    YouTube: 'youtube',
    Kick: 'kick',
    Instagram: 'instagram',
    GitHub: 'github',
    Discord: 'discord',
    Twitch: 'twitch',
    TikTok: 'tiktok',
    X: 'twitter'
  }

  return classes[platform] ?? 'other'
}
</script>

<template>
  <div class="home-overview">

    <!-- =================================
         STATISTICS
         ================================= -->
    <section class="overview-section">
      <div class="section-heading">
        <h2>Developer Hub in Numbers</h2>

        <p>
          A quick overview of my projects, platforms and content.
        </p>
      </div>

      <div class="stats-grid">
        <a
          v-for="stat in statistics"
          :key="stat.label"
          :href="stat.link"
          class="stat-card hub-card hub-card--interactive"
        >
          <span class="stat-icon" aria-hidden="true">
            {{ stat.icon }}
          </span>

          <strong class="stat-value">
            {{ stat.value }}
          </strong>

          <span class="stat-label">
            {{ stat.label }}
          </span>
        </a>
      </div>
    </section>

    <!-- =================================
         SOCIAL MEDIA
         ================================= -->
    <section class="overview-section">
      <div class="section-heading">
        <h2>Connect With Me</h2>

        <p>
          Find my videos, livestreams and content across platforms.
        </p>
      </div>

      <div class="socials-grid">
        <a
          v-for="account in featuredSocials"
          :key="account.url"
          :href="account.url"
          target="_blank"
          rel="noopener noreferrer"
          class="social-card hub-card hub-card--interactive"
        >
          <!-- AVATAR AND PLATFORM -->
          <div class="social-card-header">
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

            <span
              class="platform-icon"
              :class="getPlatformClass(account.platform)"
              :title="account.platform"
              aria-hidden="true"
            >
              {{ getSocialIcon(account.platform) }}
            </span>
          </div>

          <!-- ACCOUNT INFORMATION -->
          <div class="social-information">
            <h3>{{ account.name }}</h3>

            <span class="social-platform">
              {{ account.platform }}
            </span>

            <p>{{ account.description }}</p>
          </div>

          <!-- CATEGORY -->
          <span class="social-category">
            {{ account.category }}
          </span>

          <!-- FOOTER -->
          <div class="social-card-footer">
            <span>Visit Channel</span>

            <span aria-hidden="true">↗</span>
          </div>
        </a>
      </div>

      <!-- ALL SOCIALS -->
      <a
        :href="withBase('/socials/')"
        class="all-socials-link"
      >
        View All Socials →
      </a>
    </section>

  </div>
</template>

<style scoped>
/* =====================================
   MAIN LAYOUT
   ===================================== */

.home-overview {
  width: 100%;
  margin: 48px 0;
}

.overview-section {
  margin-bottom: 56px;
}

.section-heading {
  margin-bottom: 24px;
}

.section-heading h2 {
  margin: 0;
  padding: 0;
  border: none;
  font-size: 26px;
  font-weight: 700;
}

.section-heading p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

/* =====================================
   STATISTICS
   ===================================== */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  min-width: 0;
  padding: 28px 14px;

  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);
  box-shadow: var(--hub-card-shadow);

  color: var(--vp-c-text-1);
  text-align: center;
  text-decoration: none;
  transition: var(--hub-transition);
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--hub-card-shadow-hover);
}

.stat-icon {
  font-size: 28px;
}

.stat-value {
  color: var(--vp-c-brand-1);
  font-size: 36px;
  font-weight: 750;
  line-height: 1;
}

.stat-label {
  color: var(--vp-c-text-2);
  font-size: 13px;
}

/* =====================================
   SOCIAL GRID
   ===================================== */

.socials-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.social-card {
  display: flex;
  flex-direction: column;
  gap: 16px;

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

.social-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--hub-card-shadow-hover);
}

/* =====================================
   SOCIAL CARD HEADER
   ===================================== */

.social-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.account-avatar {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 64px;
  height: 64px;
  flex-shrink: 0;

  border: 3px solid var(--vp-c-divider);
  border-radius: 50%;

  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);

  font-size: 20px;
  font-weight: 750;

  overflow: hidden;
}

.account-avatar img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.platform-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 40px;
  height: 40px;
  border-radius: 11px;

  font-size: 20px;
  font-weight: 800;
}

/* =====================================
   PLATFORM COLORS
   ===================================== */

.youtube {
  background: #ff0033;
  color: #fff;
}

.kick {
  background: #53fc18;
  color: #101010;
}

.instagram {
  background: linear-gradient(
    135deg,
    #833ab4,
    #e1306c,
    #f77737
  );
  color: #fff;
}

.github {
  background: #24292f;
  color: #fff;
}

.discord {
  background: #5865f2;
  color: #fff;
}

.twitch {
  background: #9146ff;
  color: #fff;
}

.tiktok,
.twitter {
  background: #161616;
  color: #fff;
}

.other {
  background: var(--vp-c-brand-2);
  color: #fff;
}

/* =====================================
   SOCIAL INFORMATION
   ===================================== */

.social-information {
  flex: 1;
  min-width: 0;
}

.social-information h3 {
  margin: 0 0 4px;
  padding: 0;
  border: none;

  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: 700;

  overflow-wrap: anywhere;
}

.social-platform {
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.social-information p {
  margin: 12px 0 0;

  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

/* =====================================
   CATEGORY AND FOOTER
   ===================================== */

.social-category {
  align-self: flex-start;

  padding: 6px 10px;
  border-radius: 999px;

  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);

  font-size: 11px;
  font-weight: 600;
}

.social-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding-top: 14px;
  border-top: 1px solid var(--vp-c-divider);

  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
}

.all-socials-link {
  display: inline-block;
  margin-top: 24px;

  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.all-socials-link:hover {
  text-decoration: underline;
}

/* =====================================
   MOBILE
   ===================================== */

@media (max-width: 640px) {
  .stats-grid {
    gap: 10px;
  }

  .stat-card {
    padding: 20px 8px;
  }

  .stat-value {
    font-size: 28px;
  }

  .stat-label {
    font-size: 11px;
  }

  .socials-grid {
    grid-template-columns: 1fr;
  }

  .social-card {
    padding: 20px;
  }

  .section-heading h2 {
    font-size: 23px;
  }
}

/* =====================================
   ACCESSIBILITY
   ===================================== */

.stat-card:focus-visible,
.social-card:focus-visible,
.all-socials-link:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .stat-card,
  .social-card {
    transition: none;
  }

  .stat-card:hover,
  .social-card:hover {
    transform: none;
  }
}
</style>
