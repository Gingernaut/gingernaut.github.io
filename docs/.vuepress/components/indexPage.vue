<template>
  <div>
    <p>This is a blank template for new pages and components.</p>

    <div class="posts" v-if="posts.length">
      <div class="post" v-for="post in posts">
        <router-link :to="post.path">
          <div>
            <img v-if="post.frontmatter.image" :src="$withBase(post.frontmatter.image)" alt />
          </div>
          <h2>{{post.frontmatter.title}}</h2>
          <p>{{post.frontmatter.description}}</p>
        </router-link>

    <div v-if="post.frontmatter.meta && post.frontmatter.meta.keywords" class="keywords">
        <span class="keyword" v-for="key in post.frontmatter.meta.keywords">{{key}}</span>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "indexPage",
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
      let posts = this.$site.pages
        .filter(x => {
          return x.path.match(new RegExp(`(/)(?=.*html)`));
        })
        .sort((a, b) => {
          return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
        });
      return posts;
    }
  },
  methods: {},
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>



.keyword {
    padding: 5px;
    border-radius: 7px;
    font-size: small;
    background: #3eaf7c;
    margin-right: 5px;
    color: white;
    font-weight: 500;
  }
</style>
