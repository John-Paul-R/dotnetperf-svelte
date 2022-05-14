<script lang="ts">
import * as c3 from 'c3';
import { BarChartDisplayMode, DataColName } from './BenchBarChart.types';
import { transpose } from './csv_parse';
import { parseUnit, parseUnitNum } from './util';

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
const DataColIdx = headerRow.indexOf(dataColName);
const MeanTimeIdx = headerRow.indexOf('Mean');
const BenchmarkVariableIdx =
    headerRow.at(MeanTimeIdx - 1) === 'WarmupCount'
        ? undefined
        : MeanTimeIdx - 1;
const BenchmarkVariableName = BenchmarkVariableIdx
    ? headerRow.at(BenchmarkVariableIdx)
    : undefined;

let chart: HTMLDivElement;

const benchMeanTimes = rows
    .slice(1)
    .map<[string, number]>((row) => [
        row[BenchNameIdx],
        parseUnitNum(row[DataColIdx]),
    ])
    .reduce((accum, current) => {
        const [benchName, benchVal] = current;
        (accum[benchName] = accum[benchName] ?? []).push(benchVal);
        return accum;
    }, {} as { [key: string]: number[] });

const maxItems: c3.PrimitiveArray =
    BenchmarkVariableIdx !== undefined
        ? [...new Set(cols[BenchmarkVariableIdx].slice(1))]
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

const buildDataColsPerValue = () => {
    const data = [
        ...Object.entries(benchMeanTimes).map<[string, ...number[]]>(
            ([benchName, benchData]) => [benchName, ...benchData]
        ),
    ];

    let maxValue = 0;
    for (let k = 1; k <= maxItems.length; k++) {
        const benchVarValue = maxItems[k - 1] as number;

        console.log('bench Var value:', benchVarValue);
        for (let j = 0; j < data.length; j++) {
            console.log(`data`, j, k, data[j][k]);
            const newValue = (data[j][k] as number) / benchVarValue;
            data[j][k] = newValue;

            if (newValue > maxValue) {
                maxValue = newValue;
            }
        }
    }

    // This normalization is not really needed (and causes us to lose info)
    //   Without it, each data point is the Value per BenchmarkVar (e.g. Mean Time per Item)
    // normalize (max val 1)
    // for (let k = 1; k <= maxItems.length; k++) {
    //     for (let j = 0; j < data.length; j++) {
    //         data[j][k] = (data[j][k] as number) / maxValue;
    //         if (Number.isNaN(data[j][k])) {
    //             console.log(j, k, data[j][k]);
    //         }
    //     }
    // }

    return [['x', ...maxItems], ...data];
};

const dataCols: [string, ...c3.PrimitiveArray][] = [
    ['x', ...maxItems],
    ...Object.entries(benchMeanTimes).map<[string, ...number[]]>(
        ([benchName, benchData]) => [benchName, ...benchData]
    ),
];

let dataToRender = dataCols;
const seriesUnits = parseUnit(rows[1][DataColIdx]);
const getYAxisTitle = (
    displayMode: BarChartDisplayMode,
    seriesUnits: string | undefined
) => {
    if (displayMode === BarChartDisplayMode.Absolute && seriesUnits) {
        return `${colNameToDisplayName[dataColName]} (${seriesUnits})`;
    }
    if (displayMode === BarChartDisplayMode.Relative) {
        return `${colNameToDisplayName[dataColName]} (relative)`;
    }
    return colNameToDisplayName[dataColName];
};
let chartApi: c3.ChartAPI | undefined;
if (!chartApi) {
    setTimeout(() => {
        chartApi = c3.generate({
            title: {
                text: `${colNameToDisplayName[dataColName]} by ${BenchmarkVariableName}`,
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
            case BarChartDisplayMode.PerValue:
                return buildDataColsPerValue();
            default:
                throw new Error('BarChartDisplayMode out of range.');
        }
    })();

    chartApi.load({
        data: {
            // @ts-expect-error It seems that c3 has the wrong type expectation here.
            keys: dataCols.map((arr) => arr[0]),
            // @ts-expect-error It seems that c3 has the wrong type expectation here.
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
                return remapped.map<{ [key: string]: number }[]>(
                    Object.fromEntries
                );
            })(),
        },
    });

    chartApi.axis.labels({
        y: getYAxisTitle(displayMode, seriesUnits),
        x: BenchmarkVariableName,
    });
    console.log('Rerender!');
    // Handles necessary resizing after data update (idk why needed, but trust)
    // This is done via setTimeout to allow the normal "data update" animation to play out.
    setTimeout(() => chartApi?.resize());
};

$: updateRenderDataByDisplayMode(displayMode);
</script>

<div class="chart" bind:this={chart} />

<style>
.chart {
    border: 1px solid grey;
}
</style>
