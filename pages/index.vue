<template>
    <div id="listing-wrapper">
      <h1 id="title">Articles</h1>
      <div v-for="blogPost in articles" :key="blogPost.date"> 
        <article class="article-posting">
          <a class="post-link" :href="blogPost.permalink">{{ blogPost.title }}</a>
          <p class="post-date">{{ blogPost.date }}</p>
        </article>
      </div>
    </div>
</template>

<script>

export default {
  name: 'index',
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
  data () {
    return {
      post: []
    }
  },
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
    // showing newest articles first
    articles: function() {
      return this.post.sort((a, b) => new Date(b.date) - new Date(a.date))
    }
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
#listing-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction:column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#title {
  font-family: $primary-font;
  font-weight:700;
  font-size: 1.6em;
  margin-top:5vh;
  padding-left:10px;
}

.article-posting {
  border-bottom: 1px solid $orange;
  min-height:80px;
  margin-top:10px;
  display:flex;
  justify-content: center;
  flex-direction:column;

  a, a:visited, a:hover {
    text-decoration: none;
  }
  
  .post-link {
    color: $purple;
    font-weight:700;
    font-size:1.3em;
    font-family: $primary-font;
    padding-left:10px;
    padding-right:5px;
  }

  .post-date {
    color:$light-grey;
    font-size:0.7em;
    font-family: $secondary-font;
    padding-left:20px;
  }
}


@media (max-width: 800px) {
  .post-link {
    margin:5px;
    paddding:0;
  }
}
</style>
