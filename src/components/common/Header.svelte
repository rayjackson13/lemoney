<script lang="ts">
  let { user } = $props()
</script>

{#if user}
  <header class="AppHeader h-12 w-full px-4 py-2 text-neutral-200 shadow-md">
    <div class="mx-auto flex w-full gap-4">
      <div>Navigation</div>
      <div>Profile</div>
    </div>
  </header>
{/if}

<style scoped>
  .AppHeader {
    background-color: #19212c;
    background-image: url('/pattern.svg');
    background-repeat: repeat-x;
  }
</style>
