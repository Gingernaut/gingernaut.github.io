<template>
  <div id="left-wrapper">
    <div id="about-me">
      <div class="image-cropper">
        <img id="profile-pic" src="@/assets/images/profile.jpg"/>
      </div>
      <div id="short-bio">
        Hi, I'm Tyler. I'm a software engineer at Qualtrics.
      </div>
      <a href="/about" class="link">About </a>
      <a href="/contact" class="link">Contact </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'left-side',
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

a, a:visited, a:hover {
  text-decoration: none;
}

#left-wrapper {
  margin-left:auto;
  margin-right:auto;
  transition: 0.25s all ease;
  font-family: $secondary-font;
  width:80%;
  max-width:400px;
  height:400px;

  @if ($debug) {
    // outline:1px solid orange;
  }
}

#about-me {
  margin-top:40px;
  padding-top:20px;
  text-align:center;
}

.image-cropper {
  margin-left:auto;
  margin-right:auto;
  margin-top:40px;
  margin-bottom:30px;
  width: 130px;
  height: 130px;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}

#profile-pic {
  display: inline;
  height:100%;
  margin-left:-30px;
}

#short-bio {
  width: 85%;
  margin-left:auto;
  margin-right:auto;
  text-align:left;
  font-size:0.8em;
  color:$grey;
}

.link {
  padding:5px;
  color: $primary;
  font-family: $primary-font;
  font-weight:600;
  font-size:0.8em;

}

@media (max-width: 1200px) {
  #left-wrapper {
    width:95%;
  }
}
</style>
