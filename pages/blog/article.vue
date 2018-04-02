<template>
    <section class="article-wrapper">
      <h1 class="post-title"> {{ post.title }} </h1>
      <h2>{{ post.date }}</h2>
      <nuxtdown-body class="body-content" :body="post.body" />
    </section>
</template>

<script>
export default {
  name: '_article',
  layout: 'blog',
  components: {
  },
  // props: [],
  // metaInfo: {
  //   title: 'template',
  //   htmlAttrs: {
  //     lang: 'en'
  //   }
  // },
  mixins: [],
  asyncData: async ({ app, route, payload }) => ({
    post: payload || await app.$content('/blog/').get(route.path)
  }),
  beforeCreate () {
  },
  created () {
  },
  beforeMount () {
  },
  mounted () {
  },
  computed: {
  },
  methods: {
  },
  filters: {
  },
  beforeUpdate () {
  },
  updated () {
  },
  beforeDestroy () {
  }
}
</script>

<style lang="scss" scoped>

.article-wrapper {
  border: 1px solid red;
}

.post-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #35495e;
}

.body-content {

}
</style>
