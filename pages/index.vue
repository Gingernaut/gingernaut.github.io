<template>
    <div id="listing-wrapper">
      <h1 id="title">Articles</h1>
      <!-- <div v-for="(count, tag) in tags" :key="count">
       {{ tag }} {{ count }}
      </div> -->
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
  name: "index",
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
  data() {
    return {
      posts: []
    };
  },
  asyncData: async ({ app, route, payload }) => ({
    posts: payload || (await app.$content("/blog/").get(route.path))
  }),
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {
    articles: function() {
      return this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    tags: function() {
      let allTags = this.articles.map(tag => tag.tags);
      let flattenedTags = [].concat.apply([], allTags);

      return this.getTagCount(flattenedTags)
    }
  },
  methods: {
    getTagCount(tagArr) {
      let tagCount = {}
      for (let i = 0; i < tagArr.length; i++) {
        let tag = this.titleCase(tagArr[i])
        if (tagCount.hasOwnProperty(tag)) {
          tagCount[tag] += 1;
        } else {
          tagCount[tag] = 1;
        }
      }
      return tagCount;
    },
    titleCase (str) {
      return str ? str.charAt(0).toUpperCase() + str.substring(1).toLowerCase(): ''
    }
  },
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {}
};
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
  padding-left: 10px;
}

.article-posting {
  border-bottom: 1px solid $orange;
  min-height: 80px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;

  .post-link {
    color: $purple;
    font-weight: 700;
    font-size: 1.3em;
    font-family: $primary-font;
    padding-left: 10px;
    padding-right: 5px;
  }

  .post-date {
    color: $light-grey;
    font-size: 0.7em;
    font-family: $secondary-font;
    padding-left: 20px;
  }
}

@media (max-width: 800px) {
  .post-link {
    margin: 5px;
    paddding: 0;
  }
}
</style>
