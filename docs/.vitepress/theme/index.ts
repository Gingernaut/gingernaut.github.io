// https://vitepress.dev/guide/custom-theme

import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import "./style.css";

import Layout from "./Layout.vue";
import AboutPage from "./components/AboutPage.vue";
import ContactPage from "./components/ContactPage.vue";

export default {
	extends: DefaultTheme,
	Layout: Layout,
	enhanceApp({ app, router, siteData }) {
		app.component("AboutPage", AboutPage);
		app.component("ContactPage", ContactPage);
	},
} satisfies Theme;
