<script lang="ts">
import BenchBarChart from './BenchBarChart.svelte';
import BenchBarChart, {
    BarChartDisplayMode,
    cycleEnumValues,
    DataColName,
} from './BenchBarChart.svelte';

export let csvRows: string[][];
export let dataColName: DataColName;
export let initialDisplayMode: BarChartDisplayMode | undefined;

let internalDisplayMode: BarChartDisplayMode | undefined = undefined;
$: activeDisplaymode =
    internalDisplayMode ?? initialDisplayMode ?? BarChartDisplayMode.Absolute;

let cycleDisplay = () => {
    internalDisplayMode = cycleEnumValues(
        BarChartDisplayMode,
        activeDisplaymode
    );
};

let computedChartClass = '';
// setTimeout(() => {
//     computedChartClass = 'loaded';
// }, 100);
</script>

<div class="chart_container">
    <div class="actions_container">
        <button class="button" on:click={cycleDisplay}>Scale</button>
    </div>
    <BenchBarChart {csvRows} {dataColName} displayMode={activeDisplaymode} />
</div>

<style>
.chart_container {
    /* --gap: 4px;
    --gap-count: 1;
    --action-height: 32px; */

    /* display: grid; */
    /* grid-template-rows: var(--action-height) 1fr; */
    /* gap: 4px; */
    /* height: 320px; */
    /* width: 100%; */
    /* align-items: center; */
    /* overflow: hidden; */
}
</style>
