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
        <div id="landingphoto" class="fadeIn"></div>
        <!-- THOUGHT:: Svg animation of skiing down a mountain side on landing, smooth gradient transition to a lower animation of the city I'm working in. -->
      </div>
    </section>
    <section id="about">
      <div id="abouttext">
        <p>
          I'm a software developer interested in system architecture, scalability, and full stack development. In my free time I enjoy
          building side projects, skiing, and playing the guitar.
        </p>
      </div>
    </section>
    <section id="work">
      <h1 class="sectiontitle">Work Experience</h1>
      <div class="tilewrapper">
        <div class="tile">
          <h2>Software Engineer</h2>
          <img src="assets/images/qualtrics.png" alt="qualtrics" />
          <p class="workdate">March 2018 - Present</p>
          <p class="tiledescription">
            I work on Qualtric's Analytics Platform, working primarily with Spark, Kafka, and Scala.
          </p>
        </div>
        <div class="tile">
          <h2>Software Engineer - Part Time</h2>
          <img src="assets/images/qualtrics.png" alt="qualtrics" />
          <p class="workdate">March 2017 - January 2018</p>
          <p class="tiledescription">
            I work on Qualtric's Text Analytics team, making unstructured text useful for our customers. I primarily developed back-end
            applications using Scala, Python, and Docker.
          </p>
        </div>
        <div class="tile">
          <h2>Software Engineer Intern</h2>
          <img src="assets/images/AppLovin.png" alt="clientsuccess" />
          <p class="workdate">June 2017 - August 2017</p>
          <p class="tiledescription">
            I interned at Applovin in Palo Alto, building out a log monitoring system with Spark and Scala to detect unusual traffic
            patterns and application errors. I also built data processing/filtering web features with JavaScript and PHP.
          </p>
        </div>
        <div class="tile">
          <h2>Software Engineer - Part Time</h2>
          <img src="assets/images/clientsuccess.png" alt="clientsuccess" />
          <p class="workdate">Aug 2016 - Jan 2017</p>
          <p class="tiledescription">
            I worked for ClientSuccess as a software engineer intern, using Angular, Java, Clojure, and SQL. I built backend and full
            stack features and deployed projects as micro-services in Docker containers on AWS.
          </p>
        </div>
        <div class="tile">
          <h2>Software Engineer Intern</h2>
          <img src="assets/images/visa.png" alt="visa" class="visa" />
          <p class="workdate">June - August 2016</p>
          <p class="tiledescription">
            I interned at Visa as a backend developer, primarily working in Java. I rewrote the image resizing code for Visa Checkout,
            leading to a significant increase in image quality. I also developed dashboards with node.js and ElasticSearch
            to monitor aggregate Jenkins deployments.
          </p>
        </div>
        <div class="tile">
          <h2>Data Analyst Intern</h2>
          <img src="assets/images/visa.png" alt="visa" class="visa" />
          <p class="workdate">June - August 2015</p>
          <p class="tiledescription">
            I interned at Visa where I wrote SQL queries to calculate and track the effectiveness of Visa merchant’s promotional campaigns,
            and developed dashboards and alerting systems to monitor the data in real time.
          </p>
        </div>
        <div class="tile">

        </div>
        <div class="tile">

        </div>
      </div>
    </section>
    <section id="projects">
      <h1 class="sectiontitle">Projects</h1>
      <div class="tilewrapper">
        <div class="tile">
          <h3>
            <a target="_blank" rel="noopener noreferrer" href="https://cryptoshare.io" style="color:white">Cryptoshare.io</a>
          </h3>
          <img src="assets/images/cryptoshare.png" />
          <p class="tiledescription">
            (Launching Soon)
            <br>
            <br> I built a website to manage and share cryptocurrency public addresses in an easy and intuitive way. Built as
            a PWA with a Vue.js frontend, Flask backend, docker-compose, and hosted on Digital Ocean.
          </p>
        </div>
        <div class="tile">
          <h3>Micro-Auth
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/Gingernaut/microauth" class="githublink">
              <img src="assets/images/github.svg" type="image/svg+xml" />
            </a>
          </h3>
          <img src="assets/images/microauth.png" />
          <p class="tiledescription">
            I created a secure RESTful micro-service for user authentication and management with email verification and reset. Built
            with Python, Flask, Gunicorn, Sendgrid, Docker, Postgres, and AWS.
          </p>
        </div>
        <div class="tile">
          <h3>
            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/ai_artify" style="color:white">@AI_Artify</a>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/Gingernaut/AI_Artify" class="githublink">
              <img src="assets/images/github.svg" type="image/svg+xml" />
            </a>
          </h3>
          <img src="assets/images/ai_artify.jpg" />
          <p class="tiledescription">
            I made a
            <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/ai_artify">Twitter Bot</a>
            that uses neural networks to transfer famous art styles to quality stock photos from
            <a target="_blank" rel="noopener noreferrer" href="https://unsplash.com">Unsplash.</a>
          </p>
        </div>
        <div class="tile">
          <h3>Robot Lawyer
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/Gingernaut/Robot-Lawyer" class="githublink">
              <img src="assets/images/github.svg" type="image/svg+xml" />
            </a>
          </h3>
          <img src="assets/images/courthacks.png" />
          <p class="tiledescription">
            I won CourtHack, a hackathon to develop creative solutions for the legal system. We developed ‘Robot Lawyer’, a friendly
            chatbot that uses conversation to generate completed legal documents, and presented our project at e-Courts Vegas
            2016.
          </p>
        </div>
        <div class="tile">
          <h3>
            <a target="_blank" rel="noopener noreferrer" href="http://streetlapse.com/" style="color:white">Streetlapse</a>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/Gingernaut/Streetlapse" class="githublink">
              <img src="assets/images/github.svg" type="image/svg+xml" />
            </a>
          </h3>
          <p class="tiledescription">
            I built a web application that uses the Google Maps API to generate a first-person walking timelapse between any two points.
          </p>
        </div>
        <div class="tile">
          <h3>M3Dical
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/Gingernaut/AngelHack-2015-M3Dical" class="githublink">
              <img src="assets/images/github.svg" type="image/svg+xml" />
            </a>
          </h3>
          <p class="tiledescription">
            At AngelHack SV 2015 I developed an HP Sprout application that scans hands and generates custom 3D printable braces. We won
            Autodesk’s 1st place prize, HP’s 2nd place prize, and were a named a top 6 finalist for the hackathon.
          </p>
        </div>
        <div class="tile"></div>
        <div class="tile"></div>
      </div>
    </section>
    <section id="contact">
      <h1 class="sectiontitle">Contact Me</h1>
</section>
<footer>
      <div id="footcontent">
        <p>
          <a href="https://linkedin.com/in/tylermpeterson" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </p>
        <p>
          <a href="https://github.com/gingernaut" target="_blank" rel="noopener noreferrer">Github</a>
        </p>
        <p>
          <a href="https://twitter.com/gingernaut" target="_blank" rel="noopener noreferrer">Twitter</a>
        </p>
        <p>
          <a href="https://github.com/gingernaut/gingernaut.github.io/" target="_blank" rel="noopener noreferrer">Source Code</a>
        </p>
      </div>
</footer>
  </div>
</template>

<script>
export default {
  name: 'about',
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
$offwhite: #F2F2F2;
$white: #FFFFFF;
$red: #D6001C;

*, *:before, *:after {
  box-sizing: inherit;
}

html, body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    line-height: 1.5;
    transform-style: preserve-3d;
    overflow-x: hidden;
    box-sizing: border-box;
    font-family: 'Source Sans Pro', 'Roboto', sans-serif;
}

.path {
  animation: draw 8s  ease infinite;
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

a, a:visited, a:hover {
    color: $red;
    text-decoration: none;
}

::selection {
    color: white; 
    background: $red;
}

#sitewrapper {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
}

section {
    flex:1;
    min-height:40vh;
    height:auto;
}

.scrim {
    display:none;
    position:absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.7);
    z-index: 1;
}


#landing {
    $landheight: 100vh;
    height:$landheight;
    display:flex;
    width:100%;
    align-items:center;
    transition: .75s all ease;
    z-index: 2;

    #landingtext {

        padding:20px;
        padding-left:40px;
        align-items: center;
        z-index: 2;
        background-color:white;
         -webkit-animation-duration: 2s;
        animation-duration: 2;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;


        h2 {
            font-weight: 100;
            color:$red;
        }

        h1 {
            margin-top:-10px;
            font-size: 3.2em;
            font-family:'Roboto';
            font-weight:400;

        }
    }

    #landingcontent {
        max-height:80vh;
        align-items: center;
        justify-content: center;

        @-webkit-keyframes fadeIn {
            0% {opacity: 0;}
            100% {opacity: 1;}
         }
         

        #landingphoto {
            height:75vh;
            width:55vw;
            margin-left:5vw;
            margin-right:1vw;
            background-size: cover;
            background-position: center center;
            // background-image: url("../images/Summit-min.jpg");
             -webkit-animation-duration: 3s;
            animation-duration: 3;
            -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
        }
    }   
}

#about {
    min-height:55vh;
    display:flex;
    align-items: center;
    justify-content: center;
    background-color: #F2F2F2;

    #abouttext {
        margin-left:20%;
        margin-right:20%;
        font-size:1.2em;

    }

    #abouttext p {
        padding:1.5em;
    }

}

#work {
    min-height:40vh;

    .tile {
        text-align: left;
    }

    .tile:last-child {
        border:0;
        margin:0;
        padding:0;
    }

    .tile h2, .tile h3 {
        font-weight: 200;
        margin-bottom:.15em;
    }

    .tile img {
        max-width:90px;
    }

    #clientsuccess {
        max-width:165px;
    }

    .tile .visa {
        max-width:75px;
        margin-bottom:6px;
    }

    .workdate {
        font-size:0.8em;
        font-weight: 100;
        margin-top:-5px;
    }
}

.tilewrapper {

    padding:35px;
    padding-top:0px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: row;
    text-align:center;

    .tile {

        .h1,h2,h3, p {
            text-align: left;
            margin:0;
            margin-bottom:8px;
        }
        padding:1.1em;
        flex: 0 1 calc(25% - 1em);
        margin-bottom: 1vh;
        background-color:white;
        font-size:1.1em;

        .backgroundimg {
            height:100%;
            width:100%;
        }

        a img {
            align-self:flex-end;
        }
    }
}

.sectiontitle {
    text-align: center;
    color:black;
}

#projects {
    min-height:40vh;

    .tile:last-child, .tile:nth-last-child(2) {
        border:0;
        margin:0;
        padding:0;
    }

    .tile h3 {
        background-color:$red;
        padding:5px;
        border-radius:3px;
        color:white;
        padding-left:7px;
        height:40px;
    }

    .tile img {
        max-width:100%;
        margin-bottom:15px;
    }

    .githublink {
        float:right;
        margin-right:3px;
        margin-top:3px;
    }
}


/* Contact page */
#contact {
    min-height: 80vh;
    flex-direction: column;
    background-color: $offwhite;
    display: flex;
    align-items: center;
    color: $red;

    #form {
        width:100%;
        height:55vh;
    }
}

/* Footer section */
footer {
    min-height: 25vh;
    width: 100%;
    color: $offwhite;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    background-color: $red;

    a, a:visited, a:hover {
        text-decoration: none;
        color: $offwhite;
    }

    #footcontent {
        padding: 1em;
        width: 80%;
        display: flex;
        font-size: 0.9em;
    }

    p {
        padding: .5em;
    }

}


@media (max-width: 1450px) {

    .tilewrapper {
        padding:1em;

        .tile {
            flex: 0 1 calc(33% - 1em);
        }
    }

    #about #abouttext {
        margin-left:15%;
        margin-right:15%;
    }
}

@media (max-width: 1000px) {

    .tilewrapper {
        padding:15px;

        .tile {
            flex: 0 1 calc(50% - 1em);
        }
    }

    #about #abouttext {
        margin-left:10%;
        margin-right:10%;
    }
}


@media (max-width: 800px) {
    #landing {
        flex-direction:column;
        background-size: cover;
        background-position: center center;
        // background-image: url("../images/Summit-min.jpg");
        align-items:flex-end;
        justify-content: flex-end;
        background-attachment: fixed;

    }
    #landingtext {
        display: inline-block;
        color:white;
        margin-bottom:8vh;
        background-color: rgba(0,0,0,0) !important;
        padding-bottom:10vh !important;

    }

    .scrim {
        display: flex;
    }

    .tilewrapper {
        padding:10px;
        flex-direction: column;
    }

    #about #abouttext {
        margin-left:5%;
        margin-right:5%;

    }

    #landingcontent {
        display: none;
    }

}
</style>
