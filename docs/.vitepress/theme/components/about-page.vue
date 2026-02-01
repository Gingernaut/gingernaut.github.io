<template>
  <div class="flex flex-col md:flex-row w-full h-[calc(100vh-160px)] overflow-hidden bg-[var(--vp-c-bg)]">
    <!-- Left Section: Content (2/3) -->
    <div class="w-full md:w-2/3 h-full flex flex-col justify-center px-8 md:px-16 lg:px-24">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 text-[var(--vp-c-text-1)]">About Me</h1>

    </div>

    <!-- Right Section: Image (1/3) -->
    <div class="w-full md:w-1/3 h-full flex items-center justify-center p-4 md:p-8">
      <div class="relative w-full h-full max-h-[80vh] flex items-center justify-center">
        <img
          src="/images/profile.png"
          alt="Tyler Peterson"
          class="rounded-2xl shadow-2xl object-cover max-h-full w-auto max-w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this static layout currently
</script>

<style scoped>
/* Scoped styles if Tailwind is not enough */
</style>
