<!-- themePath/layouts/GlobalLayout.vue -->
<template>
  <div id="app">
    <baseNavbar />
    <component id="appContent" :is="layout" />
    <baseFooter />
  </div>
</template>

<script>
export default {
	computed: {
		layout() {
			if (this.$page.path) {
				if (this.$frontmatter.layout) {
					// You can also check whether layout exists first as the default global layout does.
					return this.$frontmatter.layout;
				}
				return "Layout";
			}
			return "NotFound";
		},
	},
};
</script>



<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
  line-height: 1.5;
  transform-style: preserve-3d;
  box-sizing: border-box;
  overflow-x: hidden;
}

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

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>

