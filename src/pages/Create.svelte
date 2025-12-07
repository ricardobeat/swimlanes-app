<script>
  import { onMount } from "svelte";
  import { navigate } from "src/router";
  onMount(async () => {
    // const response = await fetch('/api/create');
    // const data = await response.json();
    setTimeout(() => {
      navigate("/");
    }, 2000);
  });
</script>

<vstack h-center v-center flex gap="3">
  <Spinner />
  <h2>Creating board...</h2>
</vstack>

<style>
  h2 {
    font-family: var(--font-header);
    font-size: var(--font-size-subtitle);
  }
</style>
