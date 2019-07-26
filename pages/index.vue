<template>
  <div id="listing-wrapper">
    <h1 id="title">
      Articles
    </h1>
    <!-- <div v-for="(count, tag) in tags" :key="count">
       {{ tag | capitalize }} {{ count }}
      </div> -->
    <div
      v-for="blogPost in articles"
      :key="blogPost.date"
    >
      <article class="article-posting">
        <nuxt-link
          class="post-link"
          :to="blogPost.permalink"
        >
          {{ blogPost.title | capitalize }}
        </nuxt-link>
        <h2 class="post-date">
          {{ blogPost.date | localDate }}
        </h2>
        <!-- <h6>
            Tags:
            <span class="tagLink" v-for="tag in blogPost.tags" :key="tag">
              <a href="tag">{{tag | capitalize }} </a>
            </span>
          </h6> -->
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  layout: 'blog',
  components: {},
  props: [],
  head () {
    return {
      title: 'Blog Posts'
    }
  },
  mixins: [],
  data () {
    return {
      posts: []
    }
  },
  asyncData: async ({ app, route, payload }) => ({
    posts: payload || (await app.$content('/blog/').get(route.path))
  }),
  beforeCreate () {},
  created () {},
  beforeMount () {},
  mounted () {},
  computed: {
    articles: function () {
      return this.posts.filter(post => post.publish).sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    tags: function () {
      const allTags = this.articles.map(tag => tag.tags)
      const flattenedTags = [].concat.apply([], allTags)

      return this.getTagCount(flattenedTags)
    }
  },
  methods: {
    getTagCount (tagArr) {
      const tagCount = {}
      for (let i = 0; i < tagArr.length; i++) {
        const tag = tagArr[i].toLowerCase()
        if (Object.prototype.hasOwnProperty.call(tagCount, tag)) {
          tagCount[tag] += 1
        } else {
          tagCount[tag] = 1
        }
      }
      return tagCount
    }
  },
  filters: {
    capitalize: (inputStr) => inputStr ? inputStr.charAt(0).toUpperCase() + inputStr.slice(1) : '',
    localDate: (postDate) => new Date(Date.parse(postDate)).toLocaleDateString()
  },
  beforeUpdate () {},
  updated () {},
  beforeDestroy () {}
}
</script>

<style lang="scss" scoped>
#listing-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#title {
  font-family: $primary-font;
  font-weight: 700;
  font-size: 1.6em;
  margin-top: 5vh;
}

.article-posting {
  border-bottom: 1px solid $secondary;
  min-height: 80px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .post-link {
    color: $primary;
    font-weight: 700;
    font-size: 1.3em;
    font-family: $primary-font;
    padding-right: 5px;
  }

  .post-date {
    color: $light-grey;
    font-size: 0.7em;
    font-family: $secondary-font;
  }
}

@media (max-width: 800px) {
  #title {
    margin-left:15px;
  }
  .post-link {
    margin: 5px;
    padding: 0;
  }
}
</style>
