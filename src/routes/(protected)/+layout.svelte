<script lang="ts">
  let { children } = $props()
</script>

<main class="h-full w-full pt-12">
  <div class="relative mx-auto flex h-full w-full max-w-[1400px] px-4 py-8">
    {@render children?.()}
  </div>
</main>
