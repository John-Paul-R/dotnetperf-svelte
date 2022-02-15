<script lang="ts">
import { getEndRowIdx } from './bench_csv';

import { filterCols, transpose } from './csv_parse';
import { range } from './util';
export let csvRows: string[][];

const rows = csvRows;
const cols = transpose(rows);

const fullHeaderRow = rows[0];

const BenchNameIdx = 0;
const JobVersionIdx = 1;
const MaxItemsIdx = fullHeaderRow.indexOf('MaxItems');
const MeanTimeIdx = fullHeaderRow.indexOf('Mean');

let headerRowToRender: string[] = [];
let rowsToRender: string[][] = [];
{
    const filteredCols = filterCols(cols, [
        BenchNameIdx,
        JobVersionIdx,
        MaxItemsIdx,
        ...range(MeanTimeIdx, getEndRowIdx(fullHeaderRow)),
    ]);

    const filteredRows = transpose(filteredCols);

    rowsToRender = filteredRows.slice(1);
    headerRowToRender = filteredRows[0];
}
</script>

<div id="table">
    <table>
        <thead>
            {#each headerRowToRender as colHead}
                <th>{colHead}</th>
            {/each}
        </thead>
        <tbody>
            {#each [...rowsToRender] as row}
                <tr>
                    {#each row as el}
                        <td>{el}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
table {
    font-family: 'Courier New', Courier, monospace;
    border-collapse: collapse;
}
td,
th {
    border: 1px solid #ddd;
    padding: 8px;
}
tr:nth-child(even) {
    background-color: var(--color-base-2);
}
</style>
