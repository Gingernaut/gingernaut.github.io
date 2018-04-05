<template>
  <div id="app">
    <div id="content-wrapper">
      <div class="side-panel" id="left">
        <leftSide/>
      </div>
      <nuxt id="appContent"/>
      <div class="side-panel" id="right">
        <rightSide/>
      </div>
    </div>
    <baseFooter/>
  </div>
</template>

<script>

import baseFooter from '@/components/base-footer'
import leftSide from '@/components/left-side'
import rightSide from '@/components/right-side'

export default {
  name: 'blog',
  components: {
    baseFooter,
    leftSide,
    rightSide
  }
}
</script>

<style lang="scss">

html,body {
  margin: 0;
  padding: 0;
  line-height: 1.5;
  transform-style: preserve-3d;
  box-sizing: border-box;
  overflow-x: hidden;
}

*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}

a, a:visited, a:hover {
  text-decoration: none;
}

#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  @if ($debug) {
    border: 2px solid blue;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.15s ease;
  }
}

#content-wrapper {
  display: flex;
  flex-direction:row;
  flex-grow:1;
}

#appContent {
  flex-grow: 2.5;
  max-width:1000px;
  @if ($debug) {
    outline: 2px solid black;
  }
}

.side-panel {
  flex-grow: 1;
  transition: 0.5s all ease;
  min-width:200px;
  flex-basis:350px;
  @if ($debug) {
    outline: 1px solid red;
  }
}

@media (max-width: 1000px) {
  #appContent {
    flex-grow: 3;
  }

  #right {
    min-width:165px;
    flex-basis:0;
    * {
      display:none;
    }
  }
}


@media (max-width: 800px) {
  .side-panel, #right {
    flex-grow:0;
    width:0;
    min-width:0;
    flex-basis:0;
    * {
      display:none;
    }
  }
}
</style>
