<script lang="ts">
import BenchBarChart from './BenchBarChart.svelte';
import {
    BarChartDisplayMode,
    cycleEnumValues,
    DataColName,
} from './BenchBarChart.types';

export let csvRows: string[][];
export let dataColName: DataColName;
export let initialDisplayMode: BarChartDisplayMode | undefined;

let internalDisplayMode: BarChartDisplayMode | undefined = undefined;
$: activeDisplaymode =
    internalDisplayMode ?? initialDisplayMode ?? BarChartDisplayMode.Absolute;

let cycleDisplay = () => {
    internalDisplayMode = cycleEnumValues(
        BarChartDisplayMode,
        activeDisplaymode as number
    );
};
</script>

<div class="chart_container">
    <div class="actions_container">
        <button class="button" on:click={cycleDisplay}>Scale</button>
    </div>
    <BenchBarChart {csvRows} {dataColName} displayMode={activeDisplaymode} />
</div>

<style>
</style>
