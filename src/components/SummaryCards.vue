<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold">Summary</h2>
        <p class="mt-1 text-sm text-slate-600">Coming in commit 4 (today / month / all-time).</p>
      </div>
      <span class="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700"
        >Placeholder</span
      >
    </div>

    <div class="mt-4 grid gap-3 sm:grid-cols-3">
      <div class="rounded-lg border border-slate-200 p-3">
        <div class="text-xs font-medium text-slate-600">Today</div>
        <div class="mt-1 text-lg font-semibold">$0.00</div>
      </div>
      <div class="rounded-lg border border-slate-200 p-3">
        <div class="text-xs font-medium text-slate-600">This month</div>
        <div class="mt-1 text-lg font-semibold">$0.00</div>
      </div>
      <div class="rounded-lg border border-slate-200 p-3">
        <div class="text-xs font-medium text-slate-600">All-time</div>
        <div class="mt-1 text-lg font-semibold">$0.00</div>
      </div>
    </div>
  </section>
</template>

<script setup></script>


