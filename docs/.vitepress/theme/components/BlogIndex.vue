<template>
  <div class="blog-index">
    <h1>Blog</h1>
    <div class="posts-list">
      <div v-for="post in posts" :key="post.url" class="post-item">
        <a :href="post.url">
          <h2>{{ post.frontmatter.title }}</h2>
          <div class="meta">
            <span v-if="post.frontmatter.date">{{ formatDate(post.frontmatter.date) }}</span>
          </div>
          <p v-if="post.frontmatter.description">{{ post.frontmatter.description }}</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { data as posts } from '../posts.data.ts'

function formatDate(raw) {
  const date = new Date(raw)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.blog-index {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--vp-c-text-1);
}

.post-item {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 2rem;
}

.post-item:last-child {
  border-bottom: none;
}

.post-item a {
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-item h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  transition: color 0.2s;
}

.post-item:hover h2 {
  color: var(--vp-c-brand);
}

.meta {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.8rem;
}

.post-item p {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}
</style>
