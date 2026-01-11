<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <h2 class="text-base font-semibold">Add expense</h2>

    <form class="mt-4 grid gap-4" @submit.prevent="onSubmit">
      <div class="grid gap-3 sm:grid-cols-12 sm:items-start">
        <label class="grid gap-1 sm:col-span-4">
          <span class="text-sm font-medium text-slate-700">Amount</span>
          <input
            ref="amountEl"
            v-model="amount"
            type="number"
            step="0.01"
            min="0"
            inputmode="decimal"
            placeholder="0.00"
            class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            :class="errors.amount ? 'border-red-400 focus:border-red-600 focus:ring-red-100' : ''"
          />
          <span v-if="errors.amount" class="text-xs text-red-600">{{ errors.amount }}</span>
        </label>

        <label class="grid gap-1 sm:col-span-4">
          <span class="text-sm font-medium text-slate-700">Category</span>
          <select
            v-model="category"
            class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            :class="errors.category ? 'border-red-400 focus:border-red-600 focus:ring-red-100' : ''"
          >
            <option value="" disabled>Select…</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <span v-if="errors.category" class="text-xs text-red-600">{{ errors.category }}</span>
        </label>

        <label class="grid gap-1 sm:col-span-4">
          <span class="text-sm font-medium text-slate-700">Date</span>
          <input
            v-model="date"
            type="date"
            class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
            :class="errors.date ? 'border-red-400 focus:border-red-600 focus:ring-red-100' : ''"
          />
          <span v-if="errors.date" class="text-xs text-red-600">{{ errors.date }}</span>
        </label>
      </div>

      <label class="grid gap-1">
        <span class="text-sm font-medium text-slate-700">Note (optional)</span>
        <input
          v-model="note"
          placeholder="Coffee with Alex"
          class="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
        />
      </label>

      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-xs text-slate-500">
          Tip: amount + category + Enter is the fastest flow. Date defaults to today.
        </p>
        <button
          type="submit"
          class="inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Add expense
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, nextTick, reactive, ref } from 'vue'
import { DEFAULT_CATEGORIES, useExpenses } from '../composables/useExpenses'

const { addExpense } = useExpenses()

const toLocalIsoDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const amount = ref('')
const category = ref(DEFAULT_CATEGORIES[0])
const date = ref(toLocalIsoDate(new Date()))
const note = ref('')
const amountEl = ref(null)

const errors = reactive({
  amount: '',
  category: '',
  date: '',
})

const categories = computed(() => DEFAULT_CATEGORIES)

function clearErrors() {
  errors.amount = ''
  errors.category = ''
  errors.date = ''
}

function onSubmit() {
  clearErrors()

  const result = addExpense({
    amount: amount.value,
    category: category.value,
    date: date.value,
    note: note.value,
  })

  if (!result.ok) {
    errors.amount = result.errors?.amount ?? ''
    errors.category = result.errors?.category ?? ''
    errors.date = result.errors?.date ?? ''
    return
  }

  // Quick-add friendly: keep category/date, reset amount/note.
  amount.value = ''
  note.value = ''
  nextTick(() => amountEl.value?.focus())
}
</script>


