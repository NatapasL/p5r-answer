<script lang="ts">
  import Fuse from "fuse.js";
  import { filterClassroom, filterConfidant } from "./helpers";
  import Autocomplete from "./lib/Autocomplete.svelte";
  import { classrooms, confidants } from "./lib/data";
  import type { Option } from "./types";

  const CLASSROOM_OPTION = "Classroom";

  let searchQuery = $state("");
  let selectedType = $state("");

  const options: Option[] = [
    { label: CLASSROOM_OPTION, value: CLASSROOM_OPTION },
    ...[...new Set(confidants.map(({ character }) => character))]
      .sort((a, b) => a.localeCompare(b))
      .map((character) => ({ label: character, value: character })),
  ];

  const classroomQuestionFuse = new Fuse(classrooms, {
    keys: ["question"],
    threshold: 0.5,
  });

  const classroomDateFuse = new Fuse(classrooms, {
    keys: ["date"],
    threshold: 0.4,
  });

  const classroomOptionsFuse = new Fuse(classrooms, {
    keys: ["options.text"],
    threshold: 0.1,
  });

  let confidantFuse = $derived(
    new Fuse(
      confidants.filter((confidant) => confidant.character === selectedType),
      {
        keys: ["dialogue_prompts.options.text"],
        threshold: 0.4,
      },
    ),
  );

  let classroomResults = $derived.by(() => {
    if (!selectedType || selectedType !== CLASSROOM_OPTION) return [];

    return filterClassroom({
      searchQuery,
      classrooms,
      classroomFuses: [
        classroomQuestionFuse,
        classroomDateFuse,
        classroomOptionsFuse,
      ],
    });
  });

  let confidantResults = $derived.by(() => {
    if (!selectedType || selectedType === CLASSROOM_OPTION) return [];

    return filterConfidant({
      selectedType,
      searchQuery,
      confidants,
      confidantFuse,
    });
  });
</script>

<main>
  <div class="controls">
    <Autocomplete
      {options}
      bind:value={selectedType}
      placeholder="Select character or Classroom..."
    />

    <input
      type="text"
      placeholder="Search by name..."
      bind:value={searchQuery}
    />
  </div>

  <div class="results">
    {#if !confidantResults.length && !classroomResults.length}
      <p>No results found.</p>
    {:else if selectedType === CLASSROOM_OPTION}
      {#each classroomResults as result (`${result.date}-${result.question}`)}
        <div class="card">
          <div class="card-header">
            <strong>{result.question}</strong>
            <span class="badge">{result.date}</span>
          </div>
          {#each result.options as option (option.text)}
            {#if option.is_correct}
              <p class="answer">{option.text}</p>
            {/if}
          {/each}
        </div>
      {/each}
    {:else}
      {#each confidantResults as result (JSON.stringify(result.dialogue_prompts))}
        <div class="card">
          <div class="card-header">
            <strong>{result.character}</strong>
            <span class="badge">Rank {result.rank}</span>
          </div>
          <div class="prompts">
            {#each result.dialogue_prompts.sort((a, b) => a.prompt_order - b.prompt_order) as dialogue_prompt (dialogue_prompt.prompt_order)}
              <div class="prompt-row">
                {#each dialogue_prompt.options as option (option.text)}
                  <div class="option">
                    <span class="option-text">{option.text}</span>
                    <span class="badge points">+{option.points}</span>
                  </div>
                {/each}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    {/if}
  </div>
</main>
