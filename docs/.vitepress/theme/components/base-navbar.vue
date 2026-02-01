<template>
  <nav class="h-[60px] border-b border-[#b5c2b7] p-[5px]">
    <div class="flex flex-row items-center justify-between w-full h-full pr-12">
      <a class="logo text-[1.75em] text-[var(--vp-c-brand-1)] no-underline" href="/">Tyler Peterson</a>

      <div class="flex items-center gap-12">
        <!-- <a class="nav-link px-8" href="/blog/" :class="{ active: isActive('/blog/') }">Blog</a> -->
        <a class="nav-link px-8" href="/about/" :class="{ active: isActive('/about/') }">About</a>
        <a class="nav-link px-8" href="/contact/" :class="{ active: isActive('/contact/') }">Contact</a>
      </div>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vitepress";

const route = useRoute();

const isActive = (path: string) => {
	return route.path.startsWith(path);
};
</script>

<style scoped>
.nav-link {
  color: var(--vp-c-text-1, #2c3e50);
  text-decoration: none;
  font-weight: 400;
  font-size: 0.9em; /* Smaller font */
  border-bottom: 1px solid #8796ae; /* Wider line (thickness) */
  padding-bottom: 4px;
  transition: border-color 0.3s ease;
}

html.dark .nav-link {
  color: white;
}

.nav-link:hover,
.nav-link.active {
  border-bottom: 2px solid #44b180; /* Active/Hover color */
}

/* Ensure logo keeps its color */
a.logo {
  color: var(--vp-c-brand-1) !important;
  border-bottom: none;
}
</style>
