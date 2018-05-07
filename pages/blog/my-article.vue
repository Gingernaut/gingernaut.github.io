<template>
    <article class="article-wrapper">
      <h1 class="post-title"> {{ post.title }} </h1>
      <h2 class="post-date" v-if="post.edit_date"><i>Last edited: {{ post.edit_date }}</i></h2>
      <h2 class="post-date" v-else>{{ post.date }}</h2>
      <nuxtent-body class="body-content" :body=post.body />
    </article>
</template>

<script>
export default {
  name: "my-article",
  layout: "blog",
  components: {},
  head() {
    return {
      title: this.post.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: "My custom description"
        }
      ]
    };
  },
  mixins: [],
  asyncData: async ({ app, route, payload }) => ({
    post: payload || (await app.$content("/blog/").get(route.path))
  }),
  beforeCreate() {},
  created() {},
  beforeMount() {
    if (!this.post.publish) {
      this.$nuxt.$router.replace({ path: "/" })
    }
  },
  mounted() {},
  computed: {},
  methods: {},
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
.article-wrapper {
  padding:10px;
}

.post-title {
  color: $primary;
  font-family: $primary-font;
  font-weight: 700;
  margin-bottom: 10px;
  margin-top: 12vh;
  font-size: 1.8em;
}

.post-date {
  color: $light-grey;
  font-size: 0.7em;
  font-family: $secondary-font;
}

.body-content {
  border-top: 1px solid $secondary;

  padding-top: 25px;
  margin-top: 15px;
  margin-bottom: 10vh;
  font-family: $secondary-font;
  display: inline-block;
  word-break: break-word;
  max-width: 60vw;
}
@media (max-width: 800px) {
  .post-title {
    margin: 10px;
  }

  .body-content {
    margin: 10px;
    max-width: 95vw;
  }
}
</style>
