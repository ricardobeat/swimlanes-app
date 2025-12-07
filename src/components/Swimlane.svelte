<script>
  import Card from "./Card.svelte";

  let { title } = $props();
</script>

<vstack gap="2" flex v-top class="swimlane p2">
  <h2 class="title">{title}</h2>
  <Card />
  <Card />
  <Card />
</vstack>

<style>
  .swimlane {
    max-width: 320px;
  }
  .title {
    position: relative;
    align-self: start;
  }
  .title::after {
    content: " ";
    position: absolute;
    left: 4px;
    right: 3px;
    top: 2px;
    bottom: 0;
    transform: rotate(2deg);
    background: var(--color);
    z-index: -1;
  }
</style>
