<script>
  import Swimlane from "src/components/Swimlane.svelte";
</script>

<hstack flex gap="2">
  <Swimlane name="todo" accept={[]} --color="var(--color-accent-1)" />
  <Swimlane name="doing" --color="var(--color-accent-2)" />
  <Swimlane name="done" accept={["doing"]} --color="var(--color-accent-3)" />
  <hstack h-center class="actions">
    <a href="/join" class="join-link">join another board</a>
  </hstack>
</hstack>

<style>
  .actions {
    position: absolute;
    bottom: var(--u2);
    right: 0;
    left: 0;
  }
  .join-link {
    font-family: var(--font-header);
    font-size: 0.8rem;
  }
</style>
