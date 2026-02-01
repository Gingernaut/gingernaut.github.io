<template>
  <div class="max-w-[800px] mx-auto py-12 px-6">
    <h1 class="text-4xl font-bold mb-8 text-[var(--vp-c-text-1)]">Blog</h1>
    <div class="posts-list">
      <div v-for="post in posts" :key="post.url" class="mb-10 border-b border-[var(--vp-c-divider)] pb-8 last:border-b-0">
        <a :href="post.url" class="no-underline text-inherit block hover:text-[var(--vp-c-text-1)] group">
          <h2 class="text-2xl mb-2 transition-colors duration-200 group-hover:text-[var(--vp-c-brand)]">{{ post.frontmatter.title }}</h2>
          <div class="text-sm text-[var(--vp-c-text-3)] mb-3">
            <span v-if="post.frontmatter.date">{{ formatDate(post.frontmatter.date) }}</span>
          </div>
          <p v-if="post.frontmatter.description" class="text-[var(--vp-c-text-2)] leading-relaxed">{{ post.frontmatter.description }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { data as posts } from '../posts.data.ts'

function formatDate(raw: string | number | Date) {
  const date = new Date(raw)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
