<script lang="ts">
  import Card from "./Card.svelte";

  let { text, onDelete }: { text: string; onDelete?: () => void } = $props();
</script>

<Card>
  <div class="task">
    {text}
    {#if onDelete}
      <hstack v-top h-right class="actions">
        <button onclick={onDelete}>x</button>
      </hstack>
    {/if}
  </div>
</Card>

<style>
  .task {
    position: relative;
    &:hover .actions {
      opacity: 1;
    }
  }
  .actions {
    opacity: 0;
    position: absolute;
    top: calc(var(--u1) * -1);
    right: calc(var(--u1) * -1);
    vertical-align: top;
    button {
      display: inline-block;
      background: transparent;
      padding: 0;
      border: 0;
      cursor: pointer;
      font-size: 16px;
      line-height: 12px;
      padding: 4px; /* increase hit area */
      color: var(--color-dark);
    }
  }
</style>
