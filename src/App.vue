<script setup>
import { computed, ref } from 'vue'
import ExpenseForm from './components/ExpenseForm.vue'
import ExpenseList from './components/ExpenseList.vue'
import FilterBar from './components/FilterBar.vue'
import SummaryCards from './components/SummaryCards.vue'
import { DEFAULT_CATEGORIES, useExpenses } from './composables/useExpenses'

const { expenses, categoriesInUse } = useExpenses()

const selectedCategory = ref('')
const fromDate = ref('')
const toDate = ref('')

const categories = computed(() => {
  const set = new Set([...DEFAULT_CATEGORIES, ...categoriesInUse.value])
  return [...set].sort((a, b) => a.localeCompare(b))
})

const dateRangeError = computed(() => {
  if (!fromDate.value || !toDate.value) return ''
  if (fromDate.value > toDate.value) return '"From" date must be before "To" date.'
  return ''
})

const filteredExpenses = computed(() => {
  if (dateRangeError.value) return []

  return expenses.value.filter((e) => {
    if (selectedCategory.value && e.category !== selectedCategory.value) return false
    if (fromDate.value && e.date < fromDate.value) return false
    if (toDate.value && e.date > toDate.value) return false
    return true
  })
})

function clearFilters() {
  selectedCategory.value = ''
  fromDate.value = ''
  toDate.value = ''
}
</script>

<template>
  <div class="min-h-dvh bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
        <div class="min-w-0">
          <h1 class="text-lg font-semibold tracking-tight sm:text-xl">Spending Habits</h1>
          <p class="mt-0.5 text-sm text-slate-600">Tiny expense tracker. No accounts, no fuss.</p>
        </div>
        <div class="hidden text-sm text-slate-500 sm:block">Local-first • Stored in your browser</div>
      </div>
    </header>

    <main class="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div class="space-y-6">
        <SummaryCards />
        <FilterBar
          v-model:category="selectedCategory"
          v-model:fromDate="fromDate"
          v-model:toDate="toDate"
          :categories="categories"
          :error="dateRangeError"
          @clear="clearFilters"
        />
        <ExpenseForm />
        <ExpenseList :items="filteredExpenses" />
      </div>
    </main>

    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto max-w-4xl px-4 py-4 text-sm text-slate-500 sm:px-6">
        Built for quick personal tracking. Data stays in your browser.
      </div>
    </footer>
  </div>
</template>

<style scoped></style>
