<template>
  <div id="aboutContent">
    <h1>About</h1>


    <p>
      I work at Qualtrics as a Software Engineer on stream and batch data processing with Apache Spark, Kafka, PrestoSQL.
    </p>

    <p>
      In my free time I'm most often skiing, playing guitar, browsing Twitter, or reading books.
    </p>


    <section id="images">

      <img class="profileImg"id ="portraitMinSmile" src="~@assets/portrait_min_smile.jpg" />
      <img class="profileImg" id ="skiDrop" src="~@assets/ski_pillow_drop.jpg" />

    </section>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
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

<style lang="scss" scoped>

#aboutContent {
  height:auto;
  min-height:80vh;

  .profileImg {
    height:700px;
    width:450px;
    object-fit: cover;
  }

  #portraitMinSmile {
      object-position: right bottom;

  }

  #skiDrop {
    object-position: left bottom;
  }
}



</style>
