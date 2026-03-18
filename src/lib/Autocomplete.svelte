<script lang="ts">
  interface Option {
    label: string;
    value: string;
  }

  let {
    options = [],
    value = $bindable(""),
    placeholder = "Select...",
  }: {
    options: Option[];
    value?: string;
    placeholder?: string;
  } = $props();

  let autocompleteSearch = $state("");
  let isDropdownOpen = $state(false);
  let highlightedIndex = $state(-1);

  let filteredOptions = $derived(
    options.filter((option) =>
      option.label.toLowerCase().includes(autocompleteSearch.toLowerCase()),
    ),
  );

  function selectOption(option: Option) {
    value = option.value;
    autocompleteSearch = option.label;
    isDropdownOpen = false;
    highlightedIndex = -1;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!isDropdownOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        isDropdownOpen = true;
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        highlightedIndex = (highlightedIndex + 1) % filteredOptions.length;
        break;
      case "ArrowUp":
        e.preventDefault();
        highlightedIndex =
          (highlightedIndex - 1 + filteredOptions.length) %
          filteredOptions.length;
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectOption(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        isDropdownOpen = false;
        break;
    }
  }

  // Sync autocompleteSearch with value
  $effect(() => {
    const option = options.find((o) => o.value === value);
    if (option) {
      autocompleteSearch = option.label;
    } else if (value === "") {
      autocompleteSearch = "";
    }
  });
</script>

<div class="autocomplete">
  <input
    type="text"
    {placeholder}
    bind:value={autocompleteSearch}
    oninput={() => {
      if (autocompleteSearch === "") value = "";
    }}
    onfocus={() => (isDropdownOpen = true)}
    onblur={() => setTimeout(() => (isDropdownOpen = false), 200)}
    onkeydown={handleKeydown}
  />
  {#if isDropdownOpen && filteredOptions.length > 0}
    <ul class="dropdown">
      {#each filteredOptions as option, i (option.value)}
        <li class:highlighted={i === highlightedIndex}>
          <button
            type="button"
            onclick={() => selectOption(option)}
            onmouseenter={() => (highlightedIndex = i)}
          >
            {option.label}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .autocomplete {
    position: relative;
    flex: 1;
  }

  input {
    padding: 0.5rem 0.75rem;
    font-size: 1rem;
    font-weight: 800;
    text-transform: uppercase;
    border: 3px solid var(--p5-black);
    background: var(--p5-white);
    color: var(--p5-black);
    width: 100%;
    outline: none;
    transition: all 0.1s ease;
    transform: rotate(-0.2deg);
    box-sizing: border-box;
  }

  input:focus {
    background: var(--p5-black);
    color: var(--p5-white);
    border-color: var(--p5-white);
    transform: scale(1.01) rotate(0.2deg);
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 5px);
    left: 0;
    right: 0;
    background: var(--p5-white);
    border: 3px solid var(--p5-black);
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 250px;
    overflow-y: auto;
    z-index: 100;
    box-shadow: 4px 4px 0px var(--p5-red);
    transform: rotate(0.2deg);
  }

  .dropdown li {
    padding: 0;
    border-bottom: 1.5px solid var(--p5-black);
  }

  .dropdown li:last-child {
    border-bottom: none;
  }

  .dropdown li button {
    width: 100%;
    text-align: left;
    padding: 0.5rem 0.75rem;
    background: none;
    border: none;
    border-radius: 0;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 800;
    color: var(--p5-black);
    text-transform: uppercase;
    transition: all 0.1s ease;
  }

  .dropdown li:hover,
  .dropdown li.highlighted {
    background-color: var(--p5-red);
  }

  .dropdown li:hover button,
  .dropdown li.highlighted button {
    color: var(--p5-white);
    transform: translateX(5px);
  }
</style>
