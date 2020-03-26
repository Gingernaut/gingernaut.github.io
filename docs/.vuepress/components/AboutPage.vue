<template>
  <div>
    <div id="aboutContent">
      <div id="leftPart">
        <h1>About</h1>
        <br />

        <p>
          I work at Qualtrics as a Software Engineer on stream and batch data
          processing with Apache Spark, Kafka, and PrestoSQL.
        </p>

        <p>
          In my free time I'm most often skiing, playing guitar, browsing
          Twitter, or reading books.
        </p>
      </div>
      <div id="rightPart">
        <section id="images">
          <img class="profileImg bottom" id="skiDrop" src="~@assets/ski_pillow_drop.jpg" />
          <img class="profileImg top" id="portraitMinSmile" src="~@assets/portrait_min_smile.jpg" />
        </section>
      </div>
    </div>

    <div id="socialLinks">
      <a href="https://twitter.com/gingernaut" target="_blank" rel="noopener noreferrer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1DA1F2"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-twitter"
        >
          <path
            d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.42 11.42 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
          />
        </svg>
      </a>
      <!-- Note: fix padding/margin for hover -->
      <a href="https://github.com/gingernaut" target="_blank" rel="noopener noreferrer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2F363D"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-github"
        >
          <path
            d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
          />
        </svg>
      </a>

      <a
        href="https://www.linkedin.com/in/tylermpeterson"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="42"
          height="42"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#0077B5"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-linkedin"
        >
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  components: {},
  mixins: [],
  data() {
    return {};
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
  beforeDestroy() {}
};
</script>

<style lang="scss" scoped>
#aboutContent {
  height: auto;
  min-height: 75vh;
  padding: 20px;
  padding-left: 30px;
  display: flex;
  flex-direction: row;

  #images {
    img {
      width: 300px;
      height: 500px;
      right: 10%;
      object-fit: cover;
      position: absolute;
      right: 10vw;
      -webkit-transition: opacity 1s ease-in-out;
      -moz-transition: opacity 1s ease-in-out;
      -o-transition: opacity 1s ease-in-out;
      transition: opacity 1s ease-in-out;
      overflow: hidden;
    }

    #portraitMinSmile {
      object-position: right bottom;
    }

    #skiDrop {
      object-position: left bottom;
    }
  }

  @keyframes imgFadeInOut {
    0% {
      opacity: 1;
    }
    45% {
      opacity: 1;
    }
    55% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  #images img.top {
    animation-name: imgFadeInOut;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-duration: 12s;
    animation-direction: alternate;
  }
}

#socialLinks {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 8px;

  a {
    margin-left: 15px;
    margin-right: 15px;
  }
}
#leftPart {
  width: 60%;
}

#leftPart,
#rightPart {
}

@media only screen and (max-width: 1000px) {
  #leftPart {
    width: 50%;
  }
}

@media only screen and (max-width: 800px) {
  #images {
    display: none;
  }

  #leftPart {
    width: auto;
    flex-grow: 1;
  }
}
</style>
