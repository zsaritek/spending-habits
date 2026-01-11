<template>
  <section class="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
    <div class="flex flex-wrap items-baseline justify-between gap-3">
      <h2 class="text-base font-semibold">Expenses</h2>
      <span
        class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
      >
        {{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}
      </span>
    </div>

    <div v-if="items.length === 0" class="mt-4 rounded-lg border border-dashed border-slate-200 p-4">
      <p class="text-sm font-medium text-slate-800">{{ emptyTitle }}</p>
      <p class="mt-1 text-sm text-slate-600">{{ emptyBody }}</p>
    </div>

    <ul v-else class="mt-4 divide-y divide-slate-200">
      <li v-for="e in items" :key="e.id" class="py-3">
        <div class="flex items-start justify-between gap-4">
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span class="text-sm font-semibold tabular-nums text-slate-900">
                {{ formatMoney(e.amount) }}
              </span>
              <span class="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                {{ e.category }}
              </span>
              <span class="text-xs text-slate-500">{{ formatDate(e.date) }}</span>
            </div>
            <p v-if="e.note" class="mt-1 line-clamp-2 text-sm text-slate-700">{{ e.note }}</p>
          </div>

          <button
            type="button"
            class="inline-flex h-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
            @click="onDelete(e.id)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { useExpenses } from '../composables/useExpenses'
import { formatMoney } from '../utils/format'

defineProps({
  items: { type: Array, required: true },
  emptyTitle: { type: String, default: 'No expenses yet.' },
  emptyBody: { type: String, default: 'Add your first one above — it’ll show up here.' },
})

const { deleteExpense } = useExpenses()

function formatDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(dt)
}

function onDelete(id) {
  const ok = confirm('Delete this expense?')
  if (!ok) return
  deleteExpense(id)
}
</script>


