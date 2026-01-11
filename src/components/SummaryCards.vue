<template>
  <section class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
    <div class="flex flex-wrap items-baseline justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold text-slate-900">Summary</h2>
        <p class="mt-1 text-sm text-slate-600">Quick totals across all your expenses.</p>
      </div>
      <span
        class="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700"
      >
        All expenses
      </span>
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white p-0">
        <div class="h-1 bg-indigo-500/80"></div>
        <div class="p-3">
          <div class="text-xs font-medium text-slate-600">Today</div>
          <div class="mt-1 text-lg font-semibold tabular-nums">{{ formatMoney(totalToday) }}</div>
        </div>
      </div>
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white p-0">
        <div class="h-1 bg-indigo-500/80"></div>
        <div class="p-3">
          <div class="text-xs font-medium text-slate-600">This month</div>
          <div class="mt-1 text-lg font-semibold tabular-nums">{{ formatMoney(totalThisMonth) }}</div>
        </div>
      </div>
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white p-0">
        <div class="h-1 bg-indigo-500/80"></div>
        <div class="p-3">
          <div class="text-xs font-medium text-slate-600">All-time</div>
          <div class="mt-1 text-lg font-semibold tabular-nums">{{ formatMoney(totalAllTime) }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useExpenses } from '../composables/useExpenses'
import { formatMoney } from '../utils/format'

const { expenses } = useExpenses()

function toLocalIsoDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseIsoDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const totalAllTime = computed(() => expenses.value.reduce((sum, e) => sum + e.amount, 0))

const totalToday = computed(() => {
  const today = toLocalIsoDate(new Date())
  return expenses.value.filter((e) => e.date === today).reduce((sum, e) => sum + e.amount, 0)
})

const totalThisMonth = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  return expenses.value
    .filter((e) => {
      const dt = parseIsoDate(e.date)
      return dt.getFullYear() === y && dt.getMonth() === m
    })
    .reduce((sum, e) => sum + e.amount, 0)
})
</script>


