
<template>
  <div>
    <Content id="articleContent" />
  </div>
</template>

<script>
export default {
  name: "ArticleLayout",
  components: {},
  mixins: [],
  data() {
    return {}
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  computed: {},
  methods: {},
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
}
</script>

<style lang="scss">

#articleContent {
  padding:30px;
  padding-bottom:60px;
  margin-left:auto;
  margin-right:auto;
  max-width:1000px;


  p code {
    background-color: #282C34;
    padding:3px;
    padding-left:8px;
    padding-right:8px;
    margin-left:2px;
    margin-right:2px;
    color:#BCBCBD;
    border-radius:5px;
  }
}

</style>