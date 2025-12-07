<script lang="ts">
  let { text = $bindable(), onAdd } = $props();

  const handleAddTask = (e: KeyboardEvent): void => {
    if (e.key === "Enter" && text.trim()) {
      onAdd();
      text = "";
    }
  };

  const reset = (): void => {
    text = "";
  };
</script>

<input
  class="task-input block p2"
  type="text"
  placeholder="Add task..."
  bind:value={text}
  onkeydown={handleAddTask}
  onblur={reset}
/>

<style>
  .task-input {
    font-size: var(--font-size-body);
    background-color: transparent;
    &::placeholder {
      color: var(--color-faded);
    }
  }

  .task-input:focus {
    outline: 0;
    border-style: solid;
    background: white;
  }
</style>
