<template>
  <div class="container">
    <h1 v-if="error.statusCode === 404">
      Page not found
    </h1>
    <h1 v-else>
      An error occurred
    </h1>
    <nuxt-link to="/">
      Home page
    </nuxt-link>
  </div>
</template>

<script>

export default {
  name: 'Error',
  props: ['error'],
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
    }
  },
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

</style>
