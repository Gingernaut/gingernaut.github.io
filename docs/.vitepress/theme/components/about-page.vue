<template>
  <div class="flex flex-col lg:flex-row w-full min-h-[calc(100vh-60px)] bg-[var(--vp-c-bg)]">
    <!-- Left Section: Content (3/5) -->
    <div class="w-full lg:w-3/5 flex flex-col px-8 md:px-16 lg:px-24 py-12">
      <div class="w-full max-w-none">
        <div class="flex flex-col gap-1 mb-8">
          <h1 class="text-4xl md:text-4xl font-bold text-[var(--vp-c-text-1)]">About Me</h1>

          <div class="flex items-center gap-2 text-[var(--vp-c-text-2)] font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-[var(--vp-c-brand-1)]"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>Seattle, USA</span>
          </div>
        </div>
          <br/>

        <p class="mb-10 text-lg leading-relaxed text-[var(--vp-c-text-2)]">
          I'm a Senior Software Engineer at Qualtrics specializing in building data infrastructure and making things faster, cheaper, and more reliable at scale.
        </p>
          <br/>

        <div class="space-y-16">
          <div>
            <h3 class="text-xl font-bold mb-4 text-[var(--vp-c-text-1)]">
              Currently
            </h3>
            <ul class="space-y-3 text-[var(--vp-c-text-2)] pl-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[var(--vp-c-divider)]">
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                Solving analytical query problems at Qualtrics using technologies like Trino, Spark, and Starrocks
              </li>
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                Building autoscaled data pipelines that handle high query volume with large variance in query cost and complexity
              </li>
            </ul>
          </div>
          <br/>

          <div>
            <h3 class="text-xl font-bold mb-4 text-[var(--vp-c-text-1)]">
              Professional Interests
            </h3>
            <ul class="space-y-3 text-[var(--vp-c-text-2)] pl-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[var(--vp-c-divider)]">
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                Distributed systems and large-scale data processing
              </li>
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                Query optimization and performance tuning
              </li>
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                Cloud infrastructure and Kubernetes
              </li>
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                Developer productivity and tooling
              </li>
            </ul>
          </div>
          <br/>

          <div>
            <h3 class="text-xl font-bold mb-4 text-[var(--vp-c-text-1)]">
              Personal Interests
            </h3>
            <ul class="space-y-3 text-[var(--vp-c-text-2)] pl-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-[var(--vp-c-divider)]">
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                Skydiving, paragliding, and speedflying
              </li>
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                Scuba diving
              </li>
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                Skiing, backpacking, and mountaineering
              </li>
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                DIY electronic, automotive, and house projects
              </li>
              <li class="relative pl-6 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--vp-c-brand-1)]">
                Reading and playing guitar
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full lg:w-2/5 flex lg:block items-center justify-center p-4 md:p-8 lg:p-0">
      <!-- Desktop Wrapper: Sticky & Centered -->
      <div class="lg:sticky lg:top-0 lg:h-[calc(100vh-60px)] lg:flex lg:items-center lg:justify-center lg:p-8">
        <div class="relative w-full h-[60vh] md:h-[70vh] max-h-[800px] flex items-center justify-center rounded-2xl overflow-hidden shadow-lg">
          <ClientOnly>
            <ProfileSlideshow />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ProfileSlideshow from "./ProfileSlideshow.vue";
</script>

<style scoped>
/* Scoped styles if Tailwind is not enough */
</style>
