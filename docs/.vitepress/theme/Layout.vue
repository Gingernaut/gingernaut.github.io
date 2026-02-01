<template>
  <div id="app">
    <baseNavbar />
    <div id="appContent">
      <component :is="layoutComponent" />
    </div>
    <baseFooter />
  </div>
</template>

<script setup>
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { computed } from "vue";
import AboutPage from "./components/AboutPage.vue";
import BlogIndex from "./components/BlogIndex.vue";
import baseFooter from "./components/baseFooter.vue";
import baseNavbar from "./components/baseNavbar.vue";
import ContactPage from "./components/ContactPage.vue";
import HomePage from "./components/HomePage.vue";
import ArticleLayout from "./layouts/ArticleLayout.vue";
import FullContent from "./layouts/FullContent.vue";

const { frontmatter } = useData();

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
