
<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

import { platforms } from '../../data/platforms'
import { projects } from '../../data/projects'
import { socials } from '../../data/socials'

// Ana sayfada gösterilecek maksimum sosyal medya hesabı
const maxSocialAccounts = 4

// Otomatik hesaplanan istatistikler
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

// Ana sayfada gösterilecek sosyal medya hesapları
const featuredSocials = computed(() => {
  return socials.slice(0, maxSocialAccounts)
})

// Platform simgeleri
function getSocialIcon(platform: string): string {
  const icons: Record<string, string> = {
    YouTube: '▶',
    Kick: '📡',
    Instagram: '📷',
    GitHub: '💻',
    Discord: '💬'
  }

  return icons[platform] ?? '🌐'
}

// Sosyal medya platformuna göre renk sınıfı
function getPlatformClass(platform: string): string {
  const classes: Record<string, string> = {
    YouTube: 'youtube',
    Kick: 'kick',
    Instagram: 'instagram',
    GitHub: 'github',
    Discord: 'discord'
  }

  return classes[platform] ?? 'other'
}
</script>

<template>
  <div class="home-overview">

    <!-- İSTATİSTİKLER -->
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
          <div class="stat-icon" aria-hidden="true">
            {{ stat.icon }}
          </div>

          <span class="stat-value">
            {{ stat.value }}
          </span>

          <span class="stat-label">
            {{ stat.label }}
          </span>
        </a>
      </div>
    </section>

    <!-- SOSYAL MEDYA KARTLARI -->
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
          <div
            class="social-icon"
            :class="getPlatformClass(account.platform)"
            aria-hidden="true"
          >
            {{ getSocialIcon(account.platform) }}
          </div>

          <div class="social-information">
            <span class="social-platform">
              {{ account.platform }}
            </span>

            <h3>{{ account.name }}</h3>

            <p>{{ account.description }}</p>

            <span class="social-category">
              {{ account.category }}
            </span>
          </div>

          <span class="social-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      </div>

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
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

/* İSTATİSTİK KARTLARI */

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 14px;

  border: 1px solid var(--hub-card-border);
  border-radius: var(--hub-radius);
  background: var(--hub-card-bg);
  box-shadow: var(--hub-card-shadow);

  color: var(--vp-c-text-1);
  text-decoration: none;
  text-align: center;

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
  font-size: 36px;
  font-weight: 750;
  line-height: 1;
  color: var(--vp-c-brand-1);
}

.stat-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

/* SOSYAL MEDYA KARTLARI */

.socials-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.social-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
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

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 48px;
  height: 48px;
  border-radius: 12px;

  font-size: 24px;
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

.github,
.discord,
.other {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.social-information {
  flex: 1;
  min-width: 0;
}

.social-platform {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.social-information h3 {
  margin: 5px 0;
  font-size: 18px;
  font-weight: 650;
  overflow-wrap: anywhere;
}

.social-information p {
  margin: 8px 0 12px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  line-height: 1.6;
}

.social-category {
  font-size: 12px;
  color: var(--vp-c-brand-1);
}

.social-arrow {
  color: var(--vp-c-brand-1);
  font-size: 20px;
}

.all-socials-link {
  display: inline-block;
  margin-top: 22px;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

/* MOBİL UYUMLULUK */

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

  .section-heading h2 {
    font-size: 23px;
  }
}

/* HAREKET HASSASİYETİ */

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
