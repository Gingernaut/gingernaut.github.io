<template>
  <div id="article-layout">
    <Content class="vitepress-content" />
  </div>
</template>

<script setup>
</script>

<style>
/* Scoped styles don't apply to <Content /> slot content easily in Vue 3 without :deep,
   but since we have a specific ID, we can just use global styles targeted by ID */

#article-layout {
  padding: 30px;
  padding-bottom: 60px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
}

#article-layout h1,
#article-layout h2,
#article-layout h3,
#article-layout h4 {
  margin-top: 6px;
  padding-top: 6px;
  margin-bottom: 15px;
}

#article-layout h2 {
  margin-top: 12px;
}

#article-layout details[open] {
  border-left: 5px solid #b5c2b7;
  padding-bottom: 5px;
  margin-bottom: 1vh;
}

#article-layout details[open] h1,
#article-layout details[open] h2,
#article-layout details[open] h3,
#article-layout details[open] h4,
#article-layout details[open] h5,
#article-layout details[open] h6,
#article-layout details[open] li,
#article-layout details[open] p {
  padding-left: 20px;
}

#article-layout summary {
  margin-top: 7px;
  margin-bottom: 7px;
  color: #44B180;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
}

#article-layout img {
  display: block;
  margin-top: 4vh;
  margin-bottom: 4vh;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid #e8e8e8;
  padding: 20px;
  max-width: 100%;
}

/* code blocks */
#article-layout div[class^="language-"] {
  margin-top: 1vh;
  margin-bottom: 1vh;
}

#article-layout p code,
#article-layout li code {
  background-color: rgba(27, 31, 35, 0.05);
  padding: 3px 6px;
  color: #e81e00;
  border-radius: 5px;
}
</style>
