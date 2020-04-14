
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
  display: flex;
  flex-direction:column;


  h1,h2,h3,h4 {
    margin-top:6px;
    padding-top:6px;
    margin-bottom:15px;
  }

  h2 {
    margin-top:12px;
  }


  details[open] {
    border-left: 5px solid #b5c2b7;
    padding-bottom:5px;
    margin-bottom:1vh;

    h1,h2,h3,h4,h5,h6,li,p {
      padding-left: 20px;
    }


    // :not(summary) {
    //   margin-left:15px;
    // }
  }

  summary {
    margin-top: 7px;
    margin-bottom:7px;
    color: #44B180;
    font-size: 1.1em;
    font-weight:bold;
  }

  img {
    display:block;
    margin-top:4vh;
    margin-bottom:4vh;
    margin-left:auto;
    margin-right:auto;
    border: 1px solid #e8e8e8;
    padding:20px;
  }

  // code blocks
  div[class^="language-"] {
    margin-top:1vh;
    margin-bottom:1vh;
  }



  p code, li code {
    background-color: none;// #282C34;
    padding:3px;

    color: #e81e00;// #BCBCBD;
    border-radius:5px;
  }
}

</style>