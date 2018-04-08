<template>
    <section class="article-wrapper">
      <h1 class="post-title"> {{ post.title }} </h1>
      <h2 class="post-date">{{ post.date }}</h2>
      <nuxtent-body class="body-content" :body=" trigger(post.body)" />
    </section>
</template>

<script>

export default {
  name: "my-article",
  layout: "blog",
  components: {},
  // props: [],
  // metaInfo: {
  //   title: 'template',
  //   htmlAttrs: {
  //     lang: 'en'
  //   }
  // },
  mixins: [],
  asyncData: async ({ app, route, payload }) => ({
    post: payload || (await app.$content("/blog/").get(route.path))
  }),
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {
    trigger: data => {
      return data
    }
  },
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
.article-wrapper {
  @if ($debug) {
    outline: 1px solid $purple;
  }
}

.post-title {
  color: $purple;
  font-family: $primary-font;
  font-weight: 700;
  margin: 25px;
  margin-bottom: 10px;
  margin-top: 12vh;
  font-size: 1.8em;
}

.post-date {
  color: $light-grey;
  font-size: 0.7em;
  margin-left: 25px;
  font-family: $secondary-font;
}

.body-content {
  border-top: 1px solid $orange;
  padding: 10px;
  padding-top: 25px;
  margin-top: 15px;
  margin-bottom: 5vh;
  font-family: $secondary-font;
}
@media (max-width: 800px) {
  .post-title {
    margin: 10px;
  }

  .body-content {
    margin: 10px;
  }
}
</style>
