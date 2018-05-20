<template>
   <div id="about">
    
    <div>
      <div class="image-cropper">
        <img id="profile-pic" src="@/assets/images/profile.jpg"/>
      </div>
      <h2>Hi, I'm</h2>
      <h1>Tyler Peterson</h1>
      <p>
        I solve problems with code.
      </p>
      <!-- THOUGHT:: Svg animation of skiing down a mountain side -->
      <div>
        <p>
          I'm a software developer interested in system architecture, scalability, and full stack development. 
          I currently work at Qualtrics building stream processing systems with Spark, Kafka, Scala, and Python.  
          I live in Seattle, went to school at BYU, and grew up out outside Atlanta.
          In my free time I enjoy skiing, working on open source, and playing the guitar.
        </p>
      </div>
    </div>
   </div>
</template>

<script>
export default {
  name: "about",
  components: {},
  head() {
    return {
      title: "About",
      meta: [
        {
          name: "description",
          content: "My custom description"
        }
      ]
    }
  },
  mixins: [],
  data() {
    return {}
  },
  beforeCreate() {},
  created() {},
  beforeMount() {
    this.$nuxt.$router.replace({ path: "/" })
  },
  mounted() {},
  computed: {},
  methods: {},
  filters: {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>


.image-cropper {
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
  margin-bottom: 30px;
  width: 200px;
  height: 200px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

#profile-pic {
  display: inline;
  height: 100%;
  margin-left: -47px;
}
</style>
