<template>
    <section class="article-wrapper">
      <h1 class="post-title"> {{ post.title }} </h1>
      <h2 class="post-date">{{ post.date }}</h2>
      <nuxtent-body class="body-content" :body=post.body />
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
  methods: {},
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
.article-wrapper {
}

.post-title {
  color: $purple;
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
  border-top: 1px solid $orange;
  padding: 10px;
  padding-top: 25px;
  margin-top: 15px;
  margin-bottom: 5vh;
  font-family: $secondary-font;
  display: inline-block;
  word-break: break-word;
  max-width:60vw;

}
@media (max-width: 800px) {
  .post-title {
    margin: 10px;
  }

  .body-content {
    margin: 10px;
    max-width:95vw;
  }
}
</style>
