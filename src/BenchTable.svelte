<script lang="ts">
import { csvAsCols, filterCols, transpose } from "./csv_parse";
export let csvString: string;
export let headerRow: string[] = [];
export let rowsToRender: string[][] = [];

const cols = csvAsCols(csvString);
const rows = transpose(cols);

const fullHeaderRow = rows[0];

const BenchNameIdx = 0;
const JobVersionIdx = 1;
const MaxItemsIdx = fullHeaderRow.indexOf('MaxItems');
const MeanTimeIdx = fullHeaderRow.indexOf('Mean');

const getEndRowIdx = (header: string[]) => {
    const endStatsRows = ['Gen 2', 'Gen 1', 'Gen 0', 'StdDev'];

    for (const headName of endStatsRows) {
        const idx = header.indexOf(headName);
        if (idx !== -1) {
            return idx; 
        } 
    }
    throw new Error("Could not find a valid end stats row.");
};

const range = (start: number, end: number) =>
    Array((end+1)-start)
        .fill(null)
        .map((_, i) => start + i);

{
    const filteredCols = filterCols(cols, [
        BenchNameIdx,
        JobVersionIdx,
        MaxItemsIdx, 
        ...range(MeanTimeIdx, getEndRowIdx(fullHeaderRow)),
    ]);
    
    const filteredRows = transpose(filteredCols);

    rowsToRender = filteredRows.slice(1);
    headerRow = filteredRows[0];
}

</script>

<div id="table">
    <table>
        <thead>
            {#each headerRow as colHead}
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
    td, th {
        border: 1px solid #ddd;
        padding: 8px;
    }
    tr:nth-child(even){background-color: #f2f2f2;}

</style>
