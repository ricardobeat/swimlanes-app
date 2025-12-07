<script>
  import Header from "src/components/Header.svelte";
  import Swimlane from "src/components/Swimlane.svelte";
</script>

<vstack class="main p4">
  <Header />
  <hstack gap="2" v-top>
    <Swimlane title="TODO" --color="var(--accent-1)" />
    <Swimlane title="DOING" --color="var(--accent-2)" />
    <Swimlane title="DONE" --color="var(--accent-3)" />
  </hstack>
</vstack>
