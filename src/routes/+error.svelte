<script lang="ts">
  import { page } from '$app/state'
</script>

<main class="h-full w-full pt-12">
  <div
    class="relative mx-auto flex h-full w-full max-w-[1400px] items-center justify-center px-4 py-8"
  >
    <div class="flex items-center gap-2">
      <h1 class="text-sm font-semibold">{page.status}</h1>
      <span class="h-[14px] w-[1px] bg-slate-500"></span>
      <p class="text-sm font-light">{page.error?.message}</p>
    </div>
  </div>
</main>
