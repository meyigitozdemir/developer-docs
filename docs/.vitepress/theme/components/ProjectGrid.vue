
<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { projects } from '../../data/projects'
import { platforms } from '../../data/platforms'
import type { Project } from '../../data/projects'

// Sayfanın dışarıdan belirlediği filtreler
const props = defineProps<{
  platform?: string
  category?: string
}>()

// Kullanıcının arama ve filtre seçimleri
const searchQuery = ref('')
const selectedPlatform = ref('all')
const selectedCategory = ref('all')

// Sayfanın kapsamındaki projeler
const availableProjects = computed(() => {
  return projects.filter((project) => {
    const platformMatches =
      !props.platform ||
      project.platform === props.platform

    const categoryMatches =
      !props.category ||
      project.category === props.category

    return platformMatches && categoryMatches
  })
})

// Platform seçeneklerini oluştur
const platformOptions = computed(() => {
  return [...new Set(
    availableProjects.value.map(
      (project) => project.platform
    )
  )]
})

// Seçilen platformdaki kategorileri bul
const categoryOptions = computed(() => {
  return [...new Set(
    availableProjects.value
      .filter((project) =>
        selectedPlatform.value === 'all' ||
        project.platform === selectedPlatform.value
      )
      .map((project) => project.category)
  )]
})

// Arama ve filtreleme
const visibleProjects = computed(() => {
  const query = searchQuery.value
    .trim()
    .toLowerCase()

  return availableProjects.value.filter((project) => {

    const matchesPlatform =
      selectedPlatform.value === 'all' ||
      project.platform === selectedPlatform.value

    const matchesCategory =
      selectedCategory.value === 'all' ||
      project.category === selectedCategory.value

    const searchableText = [
      project.title,
      project.description,
      project.platform,
      project.category,
      ...project.tags
    ].join(' ').toLowerCase()

    const matchesSearch =
      searchableText.includes(query)

    return (
      matchesPlatform &&
      matchesCategory &&
      matchesSearch
    )
  })
})

// Platform ismini getir
function platformLabel(slug: string): string {
  const platform = platforms.find(
    (item) => item.slug === slug
  )

  return platform?.name ?? slug
}

// Kategori ismini getir
function categoryLabel(slug: string): string {
  return (
    platforms
      .flatMap((platform) => platform.categories)
      .find((category) => category.slug === slug)
      ?.name ?? slug
  )
}

// Proje detay sayfasının adresi
function projectUrl(project: Project): string {
  return withBase(
    `/projects/${project.platform}/${project.category}/${project.slug}/`
  )
}
</script>

<template>
  <section class="portfolio-section">

    <!-- ARAMA VE FİLTRE ALANI -->
    <div class="project-filters">

      <!-- Arama kutusu -->
      <div class="filter-group search-group">
        <label for="project-search">
          Search Projects
        </label>

        <div class="search-wrapper">
          <span class="search-icon" aria-hidden="true">⌕</span>

          <input
            id="project-search"
            v-model="searchQuery"
            type="search"
            placeholder="Search projects..."
            autocomplete="off"
          />
        </div>
      </div>

      <!-- Platform seçimi -->
      <div
        v-if="!props.platform"
        class="filter-group"
      >
        <label for="platform-filter">
          Platform
        </label>

        <select
          id="platform-filter"
          v-model="selectedPlatform"
          @change="selectedCategory = 'all'"
        >
          <option value="all">
            All Platforms
          </option>

          <option
            v-for="platform in platformOptions"
            :key="platform"
            :value="platform"
          >
            {{ platformLabel(platform) }}
          </option>
        </select>
      </div>

      <!-- Kategori seçimi -->
      <div
        v-if="!props.category"
        class="filter-group"
      >
        <label for="category-filter">
          Category
        </label>

        <select
          id="category-filter"
          v-model="selectedCategory"
        >
          <option value="all">
            All Categories
          </option>

          <option
            v-for="category in categoryOptions"
            :key="category"
            :value="category"
          >
            {{ categoryLabel(category) }}
          </option>
        </select>
      </div>

    </div>

    <!-- SONUÇ SAYISI -->
    <div class="results-header">
      <span aria-live="polite">
        {{ visibleProjects.length }} projects found
      </span>
    </div>

    <!-- PROJE KARTLARI -->
    <div class="project-grid">

      <a
        v-for="project in visibleProjects"
        :key="projectUrl(project)"
        :href="projectUrl(project)"
        class="project-card"
      >

        <!-- Proje görseli -->
        <div class="project-cover">

          <img
            v-if="project.coverImage"
            :src="withBase(project.coverImage)"
            :alt="project.title"
            loading="lazy"
          />

          <div v-else class="project-placeholder">
            <span class="placeholder-symbol">✦</span>
            <span class="placeholder-text">
              {{ platformLabel(project.platform) }}
            </span>
          </div>

        </div>

        <!-- Kart bilgileri -->
        <div class="project-content">

          <div class="project-category">
            {{ platformLabel(project.platform) }}
            /
            {{ categoryLabel(project.category) }}
          </div>

          <h3>{{ project.title }}</h3>

          <p class="project-description">
            {{ project.description }}
          </p>

          <!-- Teknoloji etiketleri -->
          <div class="project-tags">
            <span
              v-for="tag in project.tags"
              :key="tag"
              class="project-tag"
            >
              {{ tag }}
            </span>
          </div>

          <div class="project-action">
            View Project
            <span aria-hidden="true">→</span>
          </div>

        </div>

      </a>

    </div>

    <!-- Proje bulunamadı -->
    <div
      v-if="visibleProjects.length === 0"
      class="empty-state"
    >
      <div class="empty-icon">⌕</div>
      <h3>No Projects Found</h3>
      <p>
        Try changing your search or selected filters.
      </p>
    </div>

  </section>
</template>

<style scoped>

/* GENEL ALAN */
.portfolio-section {
  width: 100%;
  min-width: 0;
  margin: 28px 0;
}

/* FİLTRE DÜZENİ */
.project-filters {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  align-items: end;

  padding: 20px;
  margin-bottom: 22px;

  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
}

.filter-group {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

/* ARAMA KUTUSU */
.search-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 14px;
  font-size: 23px;
  line-height: 1;
  color: var(--vp-c-text-3);
  pointer-events: none;
}

.filter-group input,
.filter-group select {
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: 46px;

  padding: 0 14px;

  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);

  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;

  font-family: inherit;
  font-size: 14px;
  line-height: normal;

  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-wrapper input {
  padding-left: 44px;
}

.filter-group input:focus,
.filter-group select:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

/* SONUÇ SAYISI */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;

  font-size: 13px;
  color: var(--vp-c-text-2);
}

/* PROJE KARTLARI */
.project-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 260px), 1fr)
  );
  gap: 22px;
}

.project-card {
  display: flex;
  flex-direction: column;

  min-width: 0;
  overflow: hidden;

  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;

  color: var(--vp-c-text-1);
  text-decoration: none;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.10);
  text-decoration: none;
}

/* KART GÖRSELİ */
.project-cover {
  width: 100%;
  height: 180px;
  overflow: hidden;

  background: linear-gradient(
    135deg,
    #172554,
    #4338ca,
    #6366f1
  );
}

.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  gap: 10px;
}

.placeholder-symbol {
  font-size: 54px;
  line-height: 1;
  color: white;
}

.placeholder-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  font-weight: 600;
}

/* KART İÇERİĞİ */
.project-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 22px;
}

.project-category {
  margin-bottom: 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
}

.project-content h3 {
  margin: 0 0 10px;
  padding: 0;
  border: none;
  font-size: 19px;
  line-height: 1.4;
}

.project-description {
  margin: 0 0 18px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

/* ETİKETLER */
.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.project-tag {
  padding: 5px 10px;
  border-radius: 6px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
}

/* KART BAĞLANTISI */
.project-action {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: auto;
  padding-top: 20px;

  color: var(--vp-c-brand-1);
  font-size: 14px;
  font-weight: 600;
}

/* BOŞ SONUÇ */
.empty-state {
  padding: 55px 20px;
  text-align: center;

  border: 1px dashed var(--vp-c-divider);
  border-radius: 16px;
}

.empty-icon {
  font-size: 44px;
  color: var(--vp-c-text-3);
}

.empty-state h3 {
  margin: 12px 0;
  font-size: 20px;
}

.empty-state p {
  color: var(--vp-c-text-2);
}

/* TELEFON VE TABLET UYUMLULUĞU */
@media (max-width: 850px) {
  .project-filters {
    grid-template-columns: 1fr;
  }

  .project-grid {
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(100%, 240px), 1fr)
    );
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-card,
  .filter-group input,
  .filter-group select {
    transition: none;
  }
}
</style>
