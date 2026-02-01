<template>
  <div>
    <h1>Blog</h1>
    <br />
    <div class="posts" v-if="posts.length">
      <div class="post" v-for="post in posts">
        <router-link class="postLink" :to="post.path">
          <div>
            <img v-if="post.frontmatter.image" :src="$withBase(post.frontmatter.image)" alt />
          </div>
          <h2>{{post.frontmatter.title}}</h2>
        </router-link>
        <p>{{post.frontmatter.description}}</p>
        <div v-if="post.frontmatter.tags" class="keywords">
          <span class="keyword" v-for="key in post.frontmatter.tags">{{key}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	name: "blogPosts",
	components: {},
	mixins: [],
	data() {
		return {};
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	mounted() {},
	computed: {
		posts() {
			const posts = this.$site.pages
				.filter((x) => {
					return x.regularPath.match(/(\/)(?=.*html)/);
				})
				.filter((x) => {
					return !x.frontmatter.draft;
				})
				.sort((a, b) => {
					return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
				});
			return posts;
		},
	},
	methods: {},
	filters: {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.keyword {
  padding: 5px;
  padding-left: 7px;
  padding-right: 7px;
  margin: 3px;
  border-radius: 7px;
  font-size: small;
  background: #7c98b3;
  margin-right: 5px;
  color: white;
  font-weight: 500;
}

.post {
  border-bottom: 1px solid #eaecef;
  padding-bottom: 15px;
  .postLink {
    h2 {
      border-bottom: 0;
    }
  }

  p {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}
</style>
