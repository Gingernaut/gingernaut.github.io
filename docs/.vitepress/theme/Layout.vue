<template>
  <div id="app">
    <BaseNavbar />
    <div id="appContent">
      <component :is="layoutComponent" />
    </div>
    <BaseFooter />
  </div>
</template>

<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { computed } from "vue";
import AboutPage from "./components/about-page.vue";
import BaseFooter from "./components/base-footer.vue";
// biome-ignore lint/correctness/noUnusedImports: used in template
import BaseNavbar from "./components/base-navbar.vue";
import BlogIndex from "./components/blog-index.vue";
import ContactPage from "./components/contact-page.vue";
import HomePage from "./components/home-page.vue";
import ArticleLayout from "./layouts/article-layout.vue";
import FullContent from "./layouts/full-content.vue";

const { frontmatter } = useData();

// biome-ignore lint/correctness/noUnusedVariables: used in template
const layoutComponent = computed(() => {
	const layout = frontmatter.value.layout;

	if (layout === "home") return HomePage;
	if (layout === "about") return AboutPage;
	if (layout === "contact") return ContactPage;
	if (layout === "blog-index") return BlogIndex;

	if (layout === "ArticleLayout") {
		return ArticleLayout;
	}
	if (layout === "FullContent" || layout === "full") {
		return FullContent;
	}

	// Default fallback
	return DefaultTheme.Layout;
});
</script>

<style scoped>
/* Transferred from GlobalLayout.vue */
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#appContent {
  flex-grow: 1;
}
</style>
