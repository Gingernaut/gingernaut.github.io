import { createContentLoader } from "vitepress";

export default createContentLoader("blog/*.md", {
	includeSrc: false, // We don't need the raw markdown source in the list
	render: true, // If we wanted to render excerpts, but generally false is lighter
	transform(rawData) {
		return rawData
			.filter((page) => page.frontmatter.layout !== "blog-index") // Exclude the index page itself if it's in the same dir
			.sort((a, b) => {
				return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
			});
	},
});
