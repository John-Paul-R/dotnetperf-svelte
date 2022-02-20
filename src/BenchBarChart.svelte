<script context="module" lang="ts">
export type DataColName = 'Mean' | 'Median' | 'Allocated';
export enum BarChartDisplayMode {
    Absolute,
    Relative,
}
export const maxDisplayModeIdx = Object.keys(BarChartDisplayMode).length;
/**
 * @param en The enum (type)
 * @param current The current enum value
 */
export function cycleEnumValues<T>(en: T, current: number) {
    return current + 1 >= Object.keys(en).length / 2 ? 0 : current + 1;
}
cycleEnumValues(BarChartDisplayMode, BarChartDisplayMode.Absolute);
</script>

<script lang="ts">
import * as c3 from 'c3';
import { transpose } from './csv_parse';
import { parseUnitNum } from './util';

export let csvRows: string[][];
export let dataColName: DataColName;
export let displayMode: BarChartDisplayMode;

const colNameToDisplayName: { [key in DataColName]: string } = {
    Mean: 'Mean Time',
    Median: 'Median Time',
    Allocated: 'Allocated Memory',
};

if (!dataColName) {
    throw new Error(
        `BenchBarChart: dataColName is required, but was '${dataColName}'.`
    );
}

const rows = csvRows;
const cols = transpose(rows);

const headerRow: string[] = rows[0];

const BenchNameIdx = 0;
const JobVersionIdx = 1;
const MaxItemsIdx = headerRow.indexOf('MaxItems');
const MeanTimeIdx = headerRow.indexOf(dataColName);

let chart: HTMLDivElement;

const benchMeanTimes = rows
    .slice(1)
    .map<[string, number]>((row) => [
        row[BenchNameIdx],
        parseUnitNum(row[MeanTimeIdx]),
    ])
    .reduce((accum, current) => {
        const [benchName, benchVal] = current;
        (accum[benchName] = accum[benchName] ?? []).push(benchVal);
        return accum;
    }, {} as { [key: string]: number[] });

const maxItems: c3.PrimitiveArray =
    MaxItemsIdx != -1
        ? [...new Set(cols[MaxItemsIdx].slice(1))]
              .map(Number)
              .sort((a, b) => a - b)
        : ['All'];

const buildDataCols = () => {
    const maxVal = Math.max(
        ...Object.values(benchMeanTimes).flatMap((arr) => arr)
    );

    const data = [
        ...Object.entries(benchMeanTimes).map<[string, ...number[]]>(
            ([benchName, benchData]) => [benchName, ...benchData]
        ),
    ];
    for (let i = 1; i < data[0].length; i++) {
        let maxInSet = -1;
        for (let j = 0; j < data.length; j++) {
            if (data[j][i] > maxInSet) {
                maxInSet = data[j][i] as number;
            }
        }
        const multiplier = maxVal / maxInSet;
        for (let j = 0; j < data.length; j++) {
            data[j][i] = ((data[j][i] as number) * multiplier) / maxVal; // out of 1
        }
    }

    return [['x', ...maxItems], ...data];
};

const dataCols: [string, ...c3.PrimitiveArray][] = [
    ['x', ...maxItems],
    ...Object.entries(benchMeanTimes).map<[string, ...number[]]>(
        ([benchName, benchData]) => [benchName, ...benchData]
    ),
];

let dataToRender = dataCols;
// let displayMode: string = '00default'; // eq "00default" or `benchName`
let absoluteDisplayMode = true;

console.log(dataCols);
var chartApi: c3.ChartAPI;
if (!chartApi) {
    setTimeout(() => {
        chartApi = c3.generate({
            title: {
                text: colNameToDisplayName[dataColName],
            },
            data: {
                x: 'x',
                columns: dataToRender,
                type: 'bar',
                order: null,
            },
            axis: {
                x: {
                    type: 'category', // this is needed to load string x value
                },
            },
            bindto: chart,
            zoom: {
                type: 'drag',
            },
            legend: {
                item: {
                    // onclick:
                },
            },
        });
        setTimeout(() => {
            updateRenderDataByDisplayMode(displayMode);
            // chartApi.resize();
        }, 0);
    }, 0);
}

const updateRenderDataByDisplayMode = (displayMode: BarChartDisplayMode) => {
    if (!chartApi) {
        return;
    }
    const renderData = (() => {
        switch (displayMode) {
            case BarChartDisplayMode.Absolute:
                return dataCols;
            case BarChartDisplayMode.Relative:
                return buildDataCols();
                defaut: throw new Error('BarChartDisplayMode out of range.');
        }
    })();

    chartApi.load({
        data: {
            keys: dataCols.map((arr) => arr[0]),
            rows: (() => {
                // Maps data cols to 'rows' format that c3 expects here. (columns was erroring for reasons I could not determine)
                const entries = renderData.map((arr) =>
                    arr.slice(1).map((dataEl) => [arr[0], dataEl])
                );
                const remapped = [];

                for (let i = 0; i < entries[0].length; i++) {
                    const rowThing = [];
                    for (let j = 0; j < entries.length; j++) {
                        rowThing.push(entries[j][i]);
                    }
                    remapped.push(rowThing);
                }
                return remapped.map(Object.fromEntries);
            })(),
        },
    });
    console.log('Rerender!');
    // Handles necessary resizing after data update (idk why needed, but trust)
    // This is done via setTimeout to allow the normal "data update" animation to play out.
    setTimeout(() => chartApi.resize());
};

$: updateRenderDataByDisplayMode(displayMode);
</script>

<div class="chart" bind:this={chart} />

<style>
.chart {
    border: 1px solid grey;
}
</style>
