<template>
  <div id="left-wrapper">
    <div id="about-me">
      <div class="image-cropper">
        <img id="profile-pic" src="@/assets/images/profile.jpg"/>
      </div>
      <div id="short-bio">
        Hi, I'm Tyler. I'm a software engineer at Qualtrics.
      </div>
      <a href="https://twitter.com/gingernaut" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1DA1F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
      </a>
      <!-- Note: fix padding/margin for hover -->
      <a href="https://github.com/gingernaut" target="_blank" rel="noopener noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#24292E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
      </a>
      <br/>
      <nuxt-link to="/contact" class="link">Contact </nuxt-link>
      <!-- <nuxt-link to="/about" class="link">About </nuxt-link> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'left-side',
  components: {
  },
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

svg {
  margin:15px;
}

@media (max-width: 1200px) {
  #left-wrapper {
    width:95%;
  }
}
</style>
