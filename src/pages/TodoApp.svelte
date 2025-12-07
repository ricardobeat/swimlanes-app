<script>
  import Header from "src/components/Header.svelte";
  import Swimlane from "src/components/Swimlane.svelte";
</script>

<vstack class="main">
  <Header />
  <hstack flex gap="2">
    <Swimlane name="todo" --color="var(--accent-1)" />
    <Swimlane name="doing" --color="var(--accent-2)" />
    <Swimlane name="done" accept={["doing"]} --color="var(--accent-3)" />
  </hstack>
</vstack>

<style>
  .main {
    padding: 0 var(--u4) var(--u4);
    justify-content: stretch;
  }
</style>
