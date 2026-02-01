<template>
  <div class="home-page">
    <div class="hero">
      <h1>Tyler Peterson</h1>
      <p class="tagline">Software Engineer & Technology Enthusiast</p>
      <div class="actions">
        <a href="/about" class="action-btn primary">About Me</a>
        <a href="/blog" class="action-btn secondary">Read My Blog</a>
      </div>
    </div>
  </div>
</template>

<script setup>
// HomePage specific logic can go here
</script>

<style scoped>
.home-page {
  padding: 4rem 2rem;
  max-width: 1024px;
  margin: 0 auto;
  text-align: center;
}

.hero {
  margin-top: 4rem;
}

h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tagline {
  font-size: 1.5rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  display: inline-block;
  padding: 0.8rem 1.6rem;
  border-radius: 2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  text-decoration: none;
}

.action-btn.primary {
  background-color: var(--vp-c-brand);
  color: white;
}

.action-btn.primary:hover {
  background-color: var(--vp-c-brand-dark);
}

.action-btn.secondary {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.action-btn.secondary:hover {
  background-color: var(--vp-c-bg-mute);
}
</style>
