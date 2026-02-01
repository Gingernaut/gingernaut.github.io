// https://vitepress.dev/guide/custom-theme

import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./style.css";

import AboutPage from "./components/about-page.vue";
import ContactPage from "./components/contact-page.vue";
import Layout from "./layout.vue";

export default {
	extends: DefaultTheme,
	Layout: Layout,
	enhanceApp({ app }) {
		app.component("AboutPage", AboutPage);
		app.component("ContactPage", ContactPage);
	},
} satisfies Theme;
