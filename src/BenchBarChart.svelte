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
    console.log('one', data);
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
    console.log('two', data);

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

setTimeout(() => {
    var chartApi = c3.generate({
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
                onclick: (id) => {
                    console.log(id);
                    console.log(benchMeanTimes[id]);
                    absoluteDisplayMode = !absoluteDisplayMode;
                    const renderData = absoluteDisplayMode
                        ? dataCols
                        : buildDataCols();

                    chartApi.load({
                        data: {
                            keys: dataCols.map((arr) => arr[0]),
                            rows: (() => {
                                const entries = renderData.map((arr) =>
                                    arr
                                        .slice(1)
                                        .map((dataEl) => [arr[0], dataEl])
                                );
                                console.log('entries', entries);
                                const remapped = [];

                                for (let i = 0; i < entries[0].length; i++) {
                                    const rowThing = [];
                                    for (let j = 0; j < entries.length; j++) {
                                        rowThing.push(entries[j][i]);
                                    }
                                    remapped.push(rowThing);
                                }
                                console.log('remapped', remapped);
                                return remapped.map(Object.fromEntries);
                            })(),
                        },
                    });
                },
            },
        },
    });

    // chartApi.zoom.enable(true);

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
