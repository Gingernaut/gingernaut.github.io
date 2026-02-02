<template>
  <nav class="h-[60px] border-b border-[#b5c2b7] p-[5px]">
    <div class="flex flex-row items-center justify-between w-full h-full pr-4 md:pr-12">
      <a class="logo text-[1.75em] text-[var(--vp-c-brand-1)] no-underline" href="/">Tyler Peterson</a>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center gap-12">
        <!-- <a class="nav-link px-8" href="/blog/" :class="{ active: isActive('/blog/') }">Blog</a> -->
        <a class="nav-link px-8" href="/about/" :class="{ active: isActive('/about/') }">About</a>
        <a class="nav-link px-8" href="/contact/" :class="{ active: isActive('/contact/') }">Contact</a>
      </div>

      <!-- Mobile Menu -->
      <div class="flex md:hidden z-20">
        <Menu as="div" class="relative inline-block text-left">
          <div>
            <MenuButton
              class="inline-flex justify-center rounded-md p-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-opacity-75"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-8 h-8 text-[var(--vp-c-text-1)]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </MenuButton>
          </div>

          <transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems
              class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 dark:bg-[#1e1e1e] dark:divide-gray-700 dark:ring-gray-700"
            >
              <div class="py-1 px-1 flex flex-col gap-1">
                <MenuItem v-slot="{ active }">
                  <a
                    href="/about/"
                    :class="[
                      active ? 'bg-emerald-500 text-white' : 'text-gray-900 dark:text-gray-100',
                      'group flex w-full items-center rounded-md px-2 py-2.5 text-lg',
                    ]"
                  >
                    About
                  </a>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <a
                    href="/contact/"
                    :class="[
                      active ? 'bg-emerald-500 text-white' : 'text-gray-900 dark:text-gray-100',
                      'group flex w-full items-center rounded-md px-2 py-2.5 text-lg',
                    ]"
                  >
                    Contact
                  </a>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>

    </div>
  </nav>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useRoute } from "vitepress";

const route = useRoute();

const isActive = (path: string) => {
	return route.path.startsWith(path);
};
</script>

<style scoped>
.nav-link {
  color: var(--vp-c-text-1, #2c3e50);
  text-decoration: none;
  font-weight: 400;
  font-size: 0.9em; /* Smaller font */
  border-bottom: 1px solid #8796ae; /* Wider line (thickness) */
  padding-bottom: 4px;
  transition: border-color 0.3s ease;
}

html.dark .nav-link {
  color: white;
}

.nav-link:hover,
.nav-link.active {
  border-bottom: 2px solid #44b180; /* Active/Hover color */
}

/* Ensure logo keeps its color */
a.logo {
  color: var(--vp-c-brand-1) !important;
  border-bottom: none;
}
</style>
