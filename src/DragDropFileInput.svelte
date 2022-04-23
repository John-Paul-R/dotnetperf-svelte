<script lang="ts">
import { onMount } from 'svelte';
let dropArea: HTMLDivElement;
let input: HTMLInputElement;
export let onSelect: (file: File) => void | Promise<void>;

let highlighted = false;
onMount(() => {
    // Event Handlers
    // Prevent Defaults
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        dropArea.addEventListener(
            eventName,
            (e) => {
                e.preventDefault();
                e.stopPropagation();
            },
            false
        );
    });

    // Visual feedback
    ['dragenter', 'dragover'].forEach((eventName) => {
        dropArea.addEventListener(eventName, highlight, false);
    });
});
function handleDrop(e: any) {
    let dt = e.dataTransfer;
    let files = dt.files;

    input.files = files;
    fireOnChange(input);
    // handleFiles(files);
    unhighlight();
}

function handleDragLeave(e: Event) {
    if (e.currentTarget === e.target) {
        unhighlight();
    }
}

function highlight() {
    highlighted = true;
}

function unhighlight() {
    highlighted = false;
}

function fireOnChange(element: any) {
    element.dispatchEvent(new Event('change'));
}
const handleChange = (e: Event) => {
    onSelect((e.target as any).files[0]);
};
</script>

<div
    class={highlighted ? 'drop_area highlight' : 'drop_area'}
    bind:this={dropArea}
    on:drop={handleDrop}
    on:dragleave={handleDragLeave}
>
    <form class="drop_area_form">
        <p>Use your own benchmark results file (csv).</p>
        <input
            type="file"
            name="benchmark_file_input"
            id="benchmark_file_input"
            accept="text/csv"
            bind:this={input}
            on:change={handleChange}
        />
    </form>
</div>

<style>
.drop_area.highlight {
    border: 4px solid var(--color-accent-1);
}
.drop_area {
    border: 4px dashed var(--color-base-1);
    padding: 4px;
    width: min-content;
}
.drop_area p {
    word-wrap: normal;
}
.drop_area > form {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px;
}
</style>
