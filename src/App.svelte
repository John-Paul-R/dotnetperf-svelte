<script lang="ts">
import { BarChartDisplayMode } from './BenchBarChart.types';
import BenchmarkIndex from './BenchmarkIndex.svelte';
import BenchTable from './BenchTable.svelte';
import ChartContainer from './ChartContainer.svelte';
import { csvAsRows } from './csv_parse';
const urlParams = new URLSearchParams(window.location.search);
const hasSpecifiedBenchmark = urlParams.has('bench');

export let benchmarkId = urlParams.get('bench');

let csvString: string;
let csvRows: string[][];
$: if (benchmarkId) {
    fetch(
        new Request(
            `https://static.jpcode.dev/benchmarks/dotnet/${benchmarkId}.Bench-report.csv`,
            {
                method: 'GET',
            }
        )
    )
        .then(async (data) => {
            csvString = await data.text();
            csvRows = csvAsRows(csvString);
        })
        .catch(console.error);
}
</script>

<div id="page_container">
    <header>
        <nav
            id="navbar"
            role="menubar"
            aria-label="jpcode.dev"
            aria-owns="title_link"
        >
            <div>
                <button
                    class="dropdown_sc-button reset_button benchmarks_button"
                    id="site_sections-btn"
                    role="menuitem"
                    aria-haspopup="true"
                    aria-label="Site Sections"
                >
                    Benchmarks
                    <span class="material-icons"> arrow_drop_down </span>
                </button>
                <BenchmarkIndex asDropdown />
            </div>
            <div>
                <h4>
                    <div id="title_link">
                        <a
                            class="homelink"
                            href="https://www.jpcode.dev"
                            role="menuitem"
                        >
                            <span class="material-icons">code</span> Projects</a
                        >
                    </div>
                    by<a href="https://github.com/John-Paul-R">JP</a>
                </h4>
            </div>
            <div class="end flex row">
                <button class="swap_palette button" role="menuitem"
                    ><span class="text">Theme</span><span class="material-icons"
                        >style</span
                    ></button
                >
            </div>
        </nav>
    </header>

    <main id="content_main">
        {#if hasSpecifiedBenchmark}
            <a
                href="http://github.com/John-Paul-R/dotnetperf-benchmarks/tree/master/{benchmarkId}/Program.cs"
                >View Benchmark Source</a
            >
            {#if !csvString}
                Loading benchmark data...
            {:else}
                <ChartContainer
                    {csvRows}
                    initialDisplayMode={BarChartDisplayMode.Absolute}
                    dataColName="Mean"
                />
                {#if csvRows[0].includes('Allocated')}
                    <ChartContainer
                        {csvRows}
                        initialDisplayMode={BarChartDisplayMode.Absolute}
                        dataColName="Allocated"
                    />
                {/if}
                <BenchTable {csvRows} />
            {/if}
        {:else if hasSpecifiedBenchmark === false}
            No benchmark id present in query string.
            <BenchmarkIndex />
        {:else}
            No benchmark with id '{benchmarkId}' found.
            <BenchmarkIndex />
        {/if}
    </main>
</div>

<style>
main {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.benchmarks_button {
    display: flex;
    font-weight: 500;
    margin-left: 8px;
}

a {
    width: fit-content;
}
</style>
