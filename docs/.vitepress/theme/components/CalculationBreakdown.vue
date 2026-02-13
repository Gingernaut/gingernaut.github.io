<script setup lang="ts">
import {
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
	TransitionRoot,
} from "@headlessui/vue";

export interface TankInfo {
	name: string;
	capacity: string;
	startPressure: string;
	startVolume: string;
}

export interface TooltipStep {
	label: string;
	value: string;
	formula?: string;
	isFinal?: boolean;
}

export interface TooltipInfo {
	title: string;
	subtitle: string;
	theme: "red" | "green" | "gray" | "indigo";
	steps: TooltipStep[];
}

defineProps<{
	open: boolean;
	sections: TooltipInfo[];
	tankInfo: TankInfo;
}>();

defineEmits<{
	close: [];
}>();
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog @close="$emit('close')" class="relative z-50">
      <!-- Backdrop -->
      <TransitionChild
        enter="ease-out duration-200" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-150" leave-from="opacity-100" leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
      </TransitionChild>

      <!-- Panel -->
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <TransitionChild
          enter="ease-out duration-200" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
          leave="ease-in duration-150" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="w-full max-w-lg md:max-w-3xl lg:max-w-5xl rounded-2xl bg-white shadow-xl overflow-hidden flex flex-col max-h-[85vh] lg:max-h-[90vh]">
            <!-- Header -->
            <div class="px-5 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
              <DialogTitle class="text-lg font-bold text-gray-800">Calculation Breakdown</DialogTitle>
              <button @click="$emit('close')" class="p-1.5 rounded-lg hover:bg-black/5 transition-colors text-gray-400 hover:text-gray-600">
                <span class="i-carbon-close text-lg block"></span>
              </button>
            </div>

            <!-- Tank Summary -->
            <div class="px-5 py-3 bg-blue-50/60 border-b border-blue-100 shrink-0">
              <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm max-w-sm">
                <span class="text-[10px] font-bold uppercase tracking-wider text-blue-400 self-center">Cylinder</span>
                <span class="font-bold text-blue-700">{{ tankInfo.name }}</span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-blue-400 self-center">Capacity</span>
                <span class="font-mono font-bold text-blue-700">{{ tankInfo.capacity }}</span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-blue-400 self-center">Start Pressure</span>
                <span class="font-mono font-bold text-blue-700">{{ tankInfo.startPressure }}</span>
                <span class="text-[10px] font-bold uppercase tracking-wider text-blue-400 self-center">Start Volume</span>
                <span class="font-mono font-bold text-blue-700">{{ tankInfo.startVolume }}</span>
              </div>
            </div>

            <!-- Body -->
            <div class="overflow-y-auto px-5 py-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div v-for="(section, si) in sections" :key="si" class="grid grid-rows-[auto_1fr_auto] gap-2">
                  <!-- Section Header -->
                  <div :class="[
                    'rounded-lg px-4 py-2.5',
                    section.theme === 'red' ? 'bg-red-50 border border-red-100' : '',
                    section.theme === 'green' ? 'bg-green-50 border border-green-100' : '',
                    section.theme === 'gray' ? 'bg-gray-50 border border-gray-200' : '',
                    section.theme === 'indigo' ? 'bg-indigo-50 border border-indigo-100' : '',
                  ]">
                    <div :class="[
                      'text-sm font-bold',
                      section.theme === 'red' ? 'text-red-700' : '',
                      section.theme === 'green' ? 'text-green-700' : '',
                      section.theme === 'gray' ? 'text-gray-700' : '',
                      section.theme === 'indigo' ? 'text-indigo-700' : '',
                    ]">{{ section.title }}</div>
                    <div :class="[
                      'text-xs font-medium',
                      section.theme === 'red' ? 'text-red-400' : '',
                      section.theme === 'green' ? 'text-green-400' : '',
                      section.theme === 'gray' ? 'text-gray-400' : '',
                      section.theme === 'indigo' ? 'text-indigo-400' : '',
                    ]">{{ section.subtitle }}</div>
                  </div>

                  <!-- Steps (non-final, fills middle row) -->
                  <div class="space-y-2">
                    <template v-for="(step, i) in section.steps" :key="i">
                      <div
                        v-if="!step.isFinal"
                        class="rounded-lg px-3 py-2"
                      >
                        <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{{ step.label }}</div>
                        <div v-if="step.formula" class="text-xs text-gray-400 mb-0.5">{{ step.formula }}</div>
                        <div :class="[
                          'font-mono font-bold text-sm',
                          section.theme === 'red' ? 'text-red-600' : '',
                          section.theme === 'green' ? 'text-green-600' : '',
                          section.theme === 'gray' ? 'text-gray-700' : '',
                          section.theme === 'indigo' ? 'text-indigo-600' : '',
                        ]">{{ step.value }}</div>
                      </div>
                    </template>
                  </div>

                  <!-- Final Step (pinned to bottom row) -->
                  <div>
                    <template v-for="(step, i) in section.steps" :key="'final-' + i">
                      <div
                        v-if="step.isFinal"
                        class="rounded-lg px-3 py-2 bg-gray-50 border border-gray-200"
                      >
                        <div class="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{{ step.label }}</div>
                        <div v-if="step.formula" class="text-xs text-gray-400 mb-0.5">{{ step.formula }}</div>
                        <div :class="[
                          'font-mono font-bold text-lg',
                          section.theme === 'red' ? 'text-red-600' : '',
                          section.theme === 'green' ? 'text-green-600' : '',
                          section.theme === 'gray' ? 'text-gray-700' : '',
                          section.theme === 'indigo' ? 'text-indigo-600' : '',
                        ]">{{ step.value }}</div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mobile close button -->
            <div class="px-5 py-3 border-t border-gray-100 sm:hidden shrink-0">
              <button @click="$emit('close')" class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors">
                Close
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
