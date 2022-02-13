<script lang='ts'>
import BenchBarChart from "./BenchBarChart.svelte";
import BenchTable from "./BenchTable.svelte";
const urlParams = new URLSearchParams(window.location.search);
const hasSpecifiedBenchmark = urlParams.has('bench');

export let benchmarkId = urlParams.get('bench');

let csvString: string;
fetch(new Request(
        `https://static.jpcode.dev/benchmarks/dotnet/${benchmarkId}.Bench-report.csv`,
        {
        method: 'GET',
    }))
    .then(async (data) => {
        csvString = await data.text();
    });

</script>

<main>
	{#if hasSpecifiedBenchmark}
		{#if !csvString}
			Loading benchmark data...
		{:else}
			<BenchBarChart {csvString}/>
			<BenchTable {csvString}/>
		{/if}
	{:else if hasSpecifiedBenchmark === false}
		No benchmark id present in query string.
	{:else}
		No benchmark with id '{benchmarkId}' found.
	{/if}
</main>