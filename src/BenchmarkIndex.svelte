<script>
let filesList: string[];

fetch("https://static.jpcode.dev/benchmarks/dotnet/files.json", {
    method: "GET",
}).then(async (data) => {
    filesList = await data.json();
});
</script>

<div class="files_list">
    {#if filesList}
    {#each filesList as fileName}
        <div class="file_entry">
            <a href="https://www.jpcode.dev/dotnetperf?bench={fileName}">{fileName}</a>
        </div>
    {/each}
    {/if}
</div>

<style>
.files_list {
    display: flex;
    flex-direction: column;
}

</style>