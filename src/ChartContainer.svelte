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

const displayModeDisplayName = (displayMode: BarChartDisplayMode) => {
    switch (activeDisplaymode) {
        case BarChartDisplayMode.Absolute:
            return 'Absolute';
        case BarChartDisplayMode.Relative:
            return 'Normalized Maximums';
        case BarChartDisplayMode.PerValue:
            return 'Per [Bench Variable]';
    }
};
</script>

<div class="chart_container">
    <div class="actions_container">
        <button class="button" on:click={cycleDisplay}>Scale</button>
        <div>
            Mode: <span>{displayModeDisplayName(activeDisplaymode)}</span>
        </div>
    </div>
    <BenchBarChart {csvRows} {dataColName} displayMode={activeDisplaymode} />
</div>

<style>
</style>
