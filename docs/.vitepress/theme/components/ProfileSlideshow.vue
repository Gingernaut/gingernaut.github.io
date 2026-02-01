<template>
  <div class="relative w-full h-full overflow-hidden bg-black/10 rounded-xl">
    <transition-group name="fade">
      <img
        v-for="(image, index) in images"
        :key="image"
        v-show="currentIndex === index"
        :src="image"
        class="absolute top-0 left-0 w-full h-full object-cover"
        alt="Slideshow image"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const images = [
	"/images/profile.png",
	"/images/wingsuit.jpeg",
	"/images/iceland_scuba.jpg",
	"/images/japan_skiing.jpg",
	"/images/iceland_waterfall.jpg",
	"/images/larches_hiking.jpg",
	"/images/mexico_scuba.jpg",
	"/images/snowbike.JPG",
	"/images/olympic_np_walking.jpg",
	"/images/waterski.jpg",
	"/images/hiking.jpg",
	"/images/rainier_np_hiking.jpg",
];

const currentIndex = ref(0);
let intervalId: number | null = null;

onMounted(() => {
	intervalId = window.setInterval(() => {
		currentIndex.value = (currentIndex.value + 1) % images.length;
	}, 6000);
});

onUnmounted(() => {
	if (intervalId) {
		clearInterval(intervalId);
	}
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
