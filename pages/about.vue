<template>
   <div>
      <section id="landing">
         <div class="scrim"></div>
         <div id="landingtext" class="fadeIn">
            <h2>Hi, I'm</h2>
            <h1>Tyler Peterson</h1>
            <p>
               I solve problems with code.
            </p>
         </div>
         <div id="landingcontent">
            <!-- <div id="landingphoto" class="fadeIn"></div> -->
            <!-- THOUGHT:: Svg animation of skiing down a mountain side on landing, smooth gradient transition to a lower animation of the city I'm working in. -->
            <div id="abouttext">
               <p>
                  I'm a software developer interested in system architecture, scalability, and full stack development. 
                  I currently work at Qualtrics building event processing systems with Spark, Kafka, Scala, and Python.  
                  I live in Seattle, went to school at BYU, and grew up out outside Atlanta.
                  In my free time I enjoy skiing, contributing to open source, and playing the guitar.
               </p>
            </div>
         </div>
      </section>
   </div>
</template>

<script>
export default {
  name: "about",
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
$offwhite: #f2f2f2;
$white: #ffffff;
$red: #d6001c;

*,
*:before,
*:after {
  box-sizing: inherit;
}

html,
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  line-height: 1.5;
  transform-style: preserve-3d;
  overflow-x: hidden;
  box-sizing: border-box;
  font-family: "Source Sans Pro", "Roboto", sans-serif;
}

.path {
  animation: draw 8s ease infinite;
}

@keyframes draw {
  25% {
    stroke-dashoffset: 150;
  }

  50% {
    stroke-dashoffset: 200;
  }
  75% {
    stroke-dashoffset: 250;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    margin-bottom: -40px;
  }
  100% {
    opacity: 1;
    margin-bottom: 0;
  }
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
}

a,
a:visited,
a:hover {
  color: $red;
  text-decoration: none;
}

::selection {
  color: white;
  background: $red;
}

#landing {
  flex: 1;
  height: 100vh;
  display: flex;
  width: 100%;
  align-items: center;
  transition: 0.75s all ease;
  z-index: 2;

  #landingtext {
    padding: 20px;
    padding-left: 40px;
    align-items: center;
    z-index: 2;
    background-color: white;
    -webkit-animation-duration: 2s;
    animation-duration: 2;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;

    h2 {
      font-weight: 100;
      color: $red;
    }

    h1 {
      margin-top: -10px;
      font-size: 3.2em;
      font-family: "Roboto";
      font-weight: 400;
    }
  }

  #landingcontent {
    max-height: 80vh;
    align-items: center;
    justify-content: center;

    @-webkit-keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    #landingphoto {
      height: 85vh;
      width: 55vw;
      margin-left: 5vw;
      margin-right: 1vw;
      background-size: cover;
      background-position: center center;
      background-image: url("/assets/images/profile.jpg");
      -webkit-animation-duration: 3s;
      animation-duration: 3;
      -webkit-animation-fill-mode: both;
      animation-fill-mode: both;
    }
  }
}
</style>
