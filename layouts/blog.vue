<template>
  <div id="app">
    <div id="top-container">
      <div id="left"></div>
      <nuxt id="appContent"/>
      <div id="right"></div>
    </div>
    <baseFooter/>
  </div>
</template>

<script>

import baseFooter from '@/components/base-footer'

export default {
  name: 'blog',
  components: {
    baseFooter
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

#top-container {
  display: flex;
  flex-direction:row;
  flex-grow:1;
}

#left {
  flex-grow: 1;
  transition: 0.5s all ease;
  min-width:200px;
  @if ($debug) {
    outline: 1px solid red;
  }
}

#appContent {
  flex-grow: 2;
  max-width:800px;
  @if ($debug) {
    outline: 1px solid black;
  }
}

#right {
  flex-grow: 1;
  transition: 0.5s all ease;
  min-width:200px;
  @if ($debug) {
    outline: 1px solid red;
  }
}

@media (max-width: 1000px) {
  #appContent {
    flex-grow: 3;
  }
}


@media (max-width: 800px) {
  #left, #right {
    flex-grow:0;
    width:0;
    min-width:0;
  }
}
</style>
