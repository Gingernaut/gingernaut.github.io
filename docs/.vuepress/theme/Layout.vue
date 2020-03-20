<template>
  <div id="app">
    <Content/>
  </div>
</template>

<style lang="scss">
html,body {
  margin: 0;
  padding: 0;
  line-height: 1.5;
  transform-style: preserve-3d;
  box-sizing: border-box;
  overflow-x: hidden;
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
  border: 3px solid red;
}
#appContent {
  flex-grow: 1;
}
*, *:before, *:after {
  box-sizing: border-box;
  margin: 0;
}
</style>