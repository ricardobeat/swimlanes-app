<script>
  import Header from "src/components/Header.svelte";
  import { Router } from "sv-router";
  import { onMount } from "svelte";
  import { setCurrentUserId } from "src/stores/user";
  import "./router.ts";

  onMount(() => {
    window.electron.onInitialData((data) => {
      setCurrentUserId(data.token);
    });
  });
</script>

<vstack class="main" data-test-id="app">
  <Header />
  <Router base="#" />
</vstack>

<style>
  .main {
    padding: 0 var(--u4) var(--u4);
    justify-content: stretch;
  }
</style>
