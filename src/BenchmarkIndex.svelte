<script lang="ts">
let filesList: string[];
export let asDropdown = false;

const isContentfulStringArray = (val: unknown): val is string[] =>
    Array.isArray(val) && typeof val[0] === 'string';

fetch('https://static.jpcode.dev/benchmarks/dotnet/files.json', {
    method: 'GET',
})
    .then(async (data) => {
        const temp = (await data.json()) as unknown;
        if (!isContentfulStringArray(temp)) {
            throw new Error('Returned data was not a string[].');
        }
        filesList = temp.sort((a, b) => a.localeCompare(b));
        console.log(filesList);
    })
    .catch(console.error);
</script>

<div class={asDropdown ? 'dropdown_sc-wrapper' : ''} id="site_sections">
    {#if !asDropdown}
        <div class="title">Benchmarks</div>
    {/if}
    <ul
        class="files_list {asDropdown ? 'dropdown_sc-content' : ''}"
        role="menu"
    >
        {#if filesList}
            {#each filesList as fileName}
                <li class="file_entry" role="none">
                    <a
                        href="https://www.jpcode.dev/dotnetperf?bench={fileName}"
                        role="menuitem">{fileName}</a
                    >
                </li>
            {/each}
        {/if}
    </ul>
</div>

<style>
.dropdown_sc-wrapper {
    left: 0;
}

.title {
    font-size: 1.2rem;
    font-weight: 500;
    margin-bottom: 0.2rem;
}
</style>
