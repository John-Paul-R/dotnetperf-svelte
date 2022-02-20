<script lang="ts">
let filesList: string[];
export let asDropdown = false;

fetch('https://static.jpcode.dev/benchmarks/dotnet/files.json', {
    method: 'GET',
}).then(async (data) => {
    filesList = await data.json();
    console.log(filesList);
});
</script>

<div class={asDropdown ? 'dropdown_sc-wrapper' : ''} id="site_sections">
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
</style>
