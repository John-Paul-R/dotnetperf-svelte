<script lang="ts">
import { BarChartDisplayMode } from './BenchBarChart.types';
import BenchmarkIndex from './BenchmarkIndex.svelte';
import BenchTable from './BenchTable.svelte';
import ChartContainer from './ChartContainer.svelte';
import { csvAsRows } from './csv_parse';
import { readCsvFile } from './csv_reader';
import DragDropFileInput from './DragDropFileInput.svelte';
$: urlParams = new URLSearchParams(window.location.search);
$: hasSpecifiedBenchmark = urlParams.has('bench') || csvRows != undefined;

$: benchmarkId = urlParams.get('bench');

$: csvString = undefined as unknown as string; //: string;
$: csvRows = undefined as unknown as string[][]; //: string[][];

$: if (!urlParams.has('bench')) {
    csvString = undefined as unknown as string; //: string;
    csvRows = undefined as unknown as string[][]; //: string[][];
}
$: if (benchmarkId && benchmarkId !== 'file') {
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

(function () {
    window.addEventListener('popstate', function (event) {
        // The URL changed...
        urlParams = new URLSearchParams(window.location.search);
    });
})();

$: if (benchmarkId == 'file' && csvRows === undefined) {
    if ('URLSearchParams' in window) {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('bench');
        const searchParamsString = searchParams.toString();
        const urlQueryString =
            searchParamsString.length > 0 ? `?${searchParamsString}` : '';
        const newRelativePathQuery = window.location.pathname + urlQueryString;
        history.pushState(null, '', newRelativePathQuery);
        hasSpecifiedBenchmark = false;
    }
}

const onSelectFile = async (file: File) => {
    const fileResult = await readCsvFile(file);
    if (fileResult) {
        csvString = fileResult;
        csvRows = csvAsRows(csvString);
        if ('URLSearchParams' in window) {
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.set('bench', 'file');
            var newRelativePathQuery =
                window.location.pathname + '?' + searchParams.toString();
            history.pushState(null, '', newRelativePathQuery);
        }
    }
    return undefined;
};
</script>

<div id="page_container">
    <header>
        <nav
            id="navbar"
            role="menubar"
            aria-label="jpcode.dev"
            aria-owns="title_link"
        >
            <div class="title_start_container">
                <a class="button" href="./"
                    ><span class="material-icons">home</span></a
                >
                <BenchmarkIndex asDropdown />
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
            {#if benchmarkId !== 'file'}
                <a
                    href="http://github.com/John-Paul-R/dotnetperf-benchmarks/tree/master/{benchmarkId}/Program.cs"
                    >View Benchmark Source</a
                >
            {/if}
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
            <DragDropFileInput onSelect={onSelectFile} />
        {:else}
            No benchmark with id '{benchmarkId}' found.
            <BenchmarkIndex />
            <DragDropFileInput onSelect={onSelectFile} />
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

.title_start_container {
    display: inline-flex;
}
</style>
