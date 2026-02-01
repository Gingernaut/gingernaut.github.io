<template>
  <div class="p-[30px] pb-[60px] mx-auto max-w-[1000px] flex flex-col article-content">
    <Content class="vitepress-content" />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
/* Scoped styles don't apply to <Content /> slot content easily in Vue 3 without :deep,
   but since we have a specific ID, we can just use global styles targeted by ID */

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4 {
  margin-top: 6px;
  padding-top: 6px;
  margin-bottom: 15px;
}

.article-content h2 {
  margin-top: 12px;
}

.article-content details[open] {
  border-left: 5px solid #b5c2b7;
  padding-bottom: 5px;
  margin-bottom: 1vh;
}

.article-content details[open] h1,
.article-content details[open] h2,
.article-content details[open] h3,
.article-content details[open] h4,
.article-content details[open] h5,
.article-content details[open] h6,
.article-content details[open] li,
.article-content details[open] p {
  padding-left: 20px;
}

.article-content summary {
  margin-top: 7px;
  margin-bottom: 7px;
  color: #44B180;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
}

.article-content img {
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
.article-content div[class^="language-"] {
  margin-top: 1vh;
  margin-bottom: 1vh;
}

.article-content p code,
.article-content li code {
  background-color: rgba(27, 31, 35, 0.05);
  padding: 3px 6px;
  color: #e81e00;
  border-radius: 5px;
}
</style>
