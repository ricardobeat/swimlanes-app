<script>
  import Header from "src/components/Header.svelte";
  import { Router } from "sv-router";
  import "./router.ts";
</script>

<vstack class="main">
  <Header />
  <Router />
</vstack>

<style>
  .main {
    padding: 0 var(--u4) var(--u4);
    justify-content: stretch;
  }
</style>
