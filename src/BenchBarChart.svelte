<script lang="ts">
import * as c3 from 'c3';
import { transpose } from './csv_parse';
import { parseUnitNum } from './util';

type DataColName = 'Mean' | 'Median' | 'Allocated';
export let csvRows: string[][];
export let dataColName: DataColName;

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

const rows = [...[...csvRows]];
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

const maxItems =
    MaxItemsIdx != -1
        ? [...new Set(cols[MaxItemsIdx].slice(1))]
            .map(Number)
            .sort((a, b) => a - b)
        : ['All'];

const dataCols = [
    ['x', ...maxItems],
    ...Object.entries(benchMeanTimes).map(([benchName, benchData]) => [
        benchName,
        ...benchData,
    ]),
];

console.log(dataCols);

setTimeout(() => {
    c3.generate({
        title: {
            text: colNameToDisplayName[dataColName],
        },
        data: {
            x: 'x',
            columns: dataCols,
            type: 'bar',
            order: null,
        },
        axis: {
            x: {
                type: 'category', // this is needed to load string x value
            },
        },
        bindto: chart,
    });

    // groups are by size (variable)
    // bars are by collection type (benchmark name/id)

    // var full = [
    //     ['x', 'Tier I', 'Tier II', 'Tier III'],
    //     ['Apr 2015', 6, 13, 4],
    //     ['May 2015', 3, 3, 5],
    //     ['Jun 2015', 61, 0, 4],
    //     ['Jul 2015', 4, 0, 8]
    // ];

    // var chart = c3.generate({
    //     data: {
    //         x : 'x',
    //         columns: full,
    //         type: 'bar',
    //     },
    //     axis: {
    //         x: {
    //             type: 'category' // this is needed to load string x value
    //         }
    //     },
    // });
}, 0);
</script>

<div class="chart" bind:this={chart} />

<style>
.chart {
    border: 1px solid grey;
}
</style>
