<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <div class="flex flex-wrap items-baseline justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold">Filters</h2>
        <p class="mt-1 text-sm text-slate-600">Filter the list below by category and date range.</p>
      </div>

      <button
        type="button"
        class="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 hover:bg-slate-50"
        @click="$emit('clear')"
      >
        Clear
      </button>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-12 sm:items-end">
      <label class="grid gap-1 sm:col-span-4">
        <span class="text-sm font-medium text-slate-700">Category</span>
        <select
          :value="category"
          class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          @change="$emit('update:category', $event.target.value)"
        >
          <option value="">All categories</option>
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>

      <label class="grid gap-1 sm:col-span-4">
        <span class="text-sm font-medium text-slate-700">From</span>
        <input
          :value="fromDate"
          type="date"
          class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          :class="error ? 'border-red-400 focus:border-red-600 focus:ring-red-100' : ''"
          @input="$emit('update:fromDate', $event.target.value)"
        />
      </label>

      <label class="grid gap-1 sm:col-span-4">
        <span class="text-sm font-medium text-slate-700">To</span>
        <input
          :value="toDate"
          type="date"
          class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
          :class="error ? 'border-red-400 focus:border-red-600 focus:ring-red-100' : ''"
          @input="$emit('update:toDate', $event.target.value)"
        />
      </label>
    </div>

    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
    <p v-else class="mt-2 text-xs text-slate-500">Tip: filters affect the list. Summaries above stay global.</p>
  </section>
</template>

<script setup>
defineProps({
  category: { type: String, default: '' },
  fromDate: { type: String, default: '' },
  toDate: { type: String, default: '' },
  categories: { type: Array, default: () => [] },
  error: { type: String, default: '' },
})

defineEmits(['update:category', 'update:fromDate', 'update:toDate', 'clear'])
</script>


