<template>
  <nav id="primary-navbar">
    <div id="navcontent">
    <a id="site-anchor" href="/">Tyler Peterson</a>
    <!-- <div class="navlink">
      <a href="/blog">Blog</a>
    </div>
    <div class="navlink">
      <a href="/about">About</a>
    </div> -->
    <!-- <SearchBox id="searchBox" /> -->
    </div>
  </nav>
</template>

<script setup>
// import SearchBox from "@SearchBox"; // Not available in Vitepress directly
</script>

<style scoped>
#primary-navbar {
  height: 60px;
  border-bottom: 1px solid #b5c2b7;
  padding:5px;
}

#navcontent {
  display: flex;
  flex-direction: row;
  align-items:center;
  width:100%;
  height:100%;
}

#site-anchor {
  font-size:1.75em;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.navlink {
  font-size: 1.2em;
  margin-left:10px;
  margin-right:10px;
}

#searchBox {
  display: block;
  margin-left:auto;
  margin-right:10px;
}
</style>
