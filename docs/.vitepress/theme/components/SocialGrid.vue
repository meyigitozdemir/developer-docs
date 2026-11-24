
<script setup lang="ts">
import { computed, ref } from 'vue'
import { socials } from '../../data/socials'

const selectedCategory = ref('All')

const categories = computed(() => [
  'All',
  ...new Set(socials.map(account => account.category))
])

const filteredSocials = computed(() => {
  if (selectedCategory.value === 'All') {
    return socials
  }

  return socials.filter(
    account => account.category === selectedCategory.value
  )
})
</script>

<template>
  <div class="social-hub">
    <div class="social-filters">
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        class="filter-button"
        :class="{ active: selectedCategory === category }"
        @click="selectedCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="social-grid">
      <a
        v-for="account in filteredSocials"
        :key="account.url"
        :href="account.url"
        target="_blank"
        rel="noopener noreferrer"
        class="social-card"
      >
        <div class="social-icon">
          <svg
            v-if="account.platform === 'YouTube'"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"
            />
          </svg>

          <span v-else>
            {{ account.platform.charAt(0) }}
          </span>
        </div>

        <div class="social-info">
          <span class="platform-name">
            {{ account.platform }}
          </span>

          <h3>{{ account.name }}</h3>

          <p>{{ account.description }}</p>

          <span class="visit-link">
            Visit Channel ↗
          </span>
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
  margin-top: 24px;
}

.social-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 24px;
}

.filter-button {
  padding: 8px 15px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s;
}

.filter-button:hover {
  border-color: var(--vp-c-brand-1);
}

.filter-button.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

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
  gap: 18px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: 0.2s;
}

.social-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: #fee2e2;
  color: #dc2626;
}

.social-icon svg {
  width: 27px;
  height: 27px;
}

.social-icon span {
  font-size: 25px;
  font-weight: 700;
}

.social-info {
  min-width: 0;
}

.platform-name {
  color: var(--vp-c-text-2);
  font-size: 12px;
}

.social-info h3 {
  margin: 5px 0;
  font-size: 19px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.social-info p {
  margin: 8px 0 14px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.6;
}

.visit-link {
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
}

.empty-message {
  color: var(--vp-c-text-2);
}
</style>
