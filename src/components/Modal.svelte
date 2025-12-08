<script lang="ts">
  import { fade } from "svelte/transition";
  let { visible = $bindable(), children } = $props();
</script>

<div>
  {#if visible}
    <div
      transition:fade={{ duration: 200 }}
      class="modal"
      {@attach (element: HTMLDivElement) => {
        const content = element.querySelector(".content");
        const handler = (e: MouseEvent): void => {
          if (!content.contains(e.target as Node)) {
            visible = false;
          }
        };
        element.addEventListener("click", handler);
        return () => {
          element.removeEventListener("click", handler);
        };
      }}
    >
      <vstack no-flex h-center v-center class="content">{@render children()}</vstack>
    </div>
  {/if}
</div>

<style>
  .modal {
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 135, 0.88);
    z-index: 1000;
  }
</style>
