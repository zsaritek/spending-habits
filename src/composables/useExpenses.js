import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'spending-habits:expenses:v1'

export const DEFAULT_CATEGORIES = [
  'Food',
  'Groceries',
  'Transport',
  'Bills',
  'Shopping',
  'Health',
  'Fun',
  'Other',
]

function safeParse(json) {
  try {
    return { ok: true, value: JSON.parse(json) }
  } catch {
    return { ok: false, value: null }
  }
}

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `exp_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function isIsoDate(value) {
  // Expecting YYYY-MM-DD (from <input type="date">)
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function normalizeDraft(draft) {
  const amount =
    typeof draft?.amount === 'string' ? Number(draft.amount.trim()) : Number(draft?.amount)

  return {
    amount: Number.isFinite(amount) ? amount : NaN,
    category: typeof draft?.category === 'string' ? draft.category.trim() : '',
    date: typeof draft?.date === 'string' ? draft.date.trim() : '',
    note: typeof draft?.note === 'string' ? draft.note.trim() : '',
  }
}

export function validateExpenseDraft(draft) {
  const d = normalizeDraft(draft)
  const errors = {}

  if (!Number.isFinite(d.amount) || d.amount <= 0) {
    errors.amount = 'Enter an amount greater than 0.'
  }
  if (!d.category) {
    errors.category = 'Pick a category.'
  }
  if (!d.date || !isIsoDate(d.date)) {
    errors.date = 'Pick a valid date.'
  }

  return { ok: Object.keys(errors).length === 0, errors, value: d }
}

function normalizeStoredExpense(raw) {
  if (!raw || typeof raw !== 'object') return null

  const id = typeof raw.id === 'string' ? raw.id : ''
  const amount = typeof raw.amount === 'number' ? raw.amount : Number(raw.amount)
  const category = typeof raw.category === 'string' ? raw.category : ''
  const date = typeof raw.date === 'string' ? raw.date : ''
  const note = typeof raw.note === 'string' ? raw.note : ''
  const createdAt = typeof raw.createdAt === 'number' ? raw.createdAt : Number(raw.createdAt)

  if (!id) return null
  if (!Number.isFinite(amount) || amount <= 0) return null
  if (!category) return null
  if (!isIsoDate(date)) return null

  return {
    id,
    amount,
    category,
    date,
    note,
    createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
  }
}

export function useExpenses() {
  const expenses = ref([])

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      expenses.value = []
      return
    }

    const parsed = safeParse(raw)
    if (!parsed.ok || !Array.isArray(parsed.value)) {
      expenses.value = []
      return
    }

    const normalized = parsed.value.map(normalizeStoredExpense).filter(Boolean)
    // Most recent first (by date, then createdAt)
    normalized.sort((a, b) => (b.date + String(b.createdAt)).localeCompare(a.date + String(a.createdAt)))
    expenses.value = normalized
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses.value))
  }

  function addExpense(draft) {
    const validated = validateExpenseDraft(draft)
    if (!validated.ok) return { ok: false, errors: validated.errors }

    const now = Date.now()
    const expense = {
      id: generateId(),
      amount: validated.value.amount,
      category: validated.value.category,
      date: validated.value.date,
      note: validated.value.note,
      createdAt: now,
    }

    expenses.value = [expense, ...expenses.value]
    return { ok: true, expense }
  }

  function deleteExpense(id) {
    const before = expenses.value.length
    expenses.value = expenses.value.filter((e) => e.id !== id)
    return { ok: expenses.value.length !== before }
  }

  function updateExpense(id, patch) {
    const idx = expenses.value.findIndex((e) => e.id === id)
    if (idx === -1) return { ok: false, reason: 'not_found' }

    const next = { ...expenses.value[idx], ...patch }
    const validated = validateExpenseDraft(next)
    if (!validated.ok) return { ok: false, errors: validated.errors }

    expenses.value[idx] = {
      ...expenses.value[idx],
      amount: validated.value.amount,
      category: validated.value.category,
      date: validated.value.date,
      note: validated.value.note,
    }

    // Keep most recent first after edits
    expenses.value = [...expenses.value].sort((a, b) =>
      (b.date + String(b.createdAt)).localeCompare(a.date + String(a.createdAt)),
    )
    return { ok: true }
  }

  const categoriesInUse = computed(() => {
    const set = new Set(expenses.value.map((e) => e.category).filter(Boolean))
    return [...set].sort((a, b) => a.localeCompare(b))
  })

  load()
  watch(expenses, save, { deep: true })

  return {
    expenses,
    addExpense,
    deleteExpense,
    updateExpense,
    categoriesInUse,
    load,
  }
}


