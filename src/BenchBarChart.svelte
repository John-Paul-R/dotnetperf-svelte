<script lang="ts">
import * as c3 from 'c3';
import { transpose } from './csv_parse';
import { parseUnitNum } from './util';

export let csvRows: string[][];

const rows = csvRows;
const cols = transpose(rows);

const headerRow: string[] = rows[0];

const BenchNameIdx = 0;
const JobVersionIdx = 1;
const MaxItemsIdx = headerRow.indexOf('MaxItems');
const MeanTimeIdx = headerRow.indexOf('Mean');

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
        ? [...new Set(cols[MaxItemsIdx].slice(1))].sort()
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

<div id="chart" />

<style>
</style>
