<script lang="ts">
  let { text = "No items" }: { text?: string } = $props();
</script>

<div class="card-placeholder p2">{text}</div>

<style>
  .card-placeholder {
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.7);
    border: 1.5px dotted #996;
    border-radius: 3px;
    color: #996;
    text-align: center;
    opacity: 0.6;
  }
</style>
