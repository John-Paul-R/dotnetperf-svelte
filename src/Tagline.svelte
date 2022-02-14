<script lang="ts">
import { getNumber } from './number_provider';
export let authorName: string;

function csvAsCols(csv: string) {
    const rows = csv.trim().split(/\r?\n|\r/);
    const cols: string[][] = new Array(rows[0].split(',').length)
        .fill(null)
        .map(() => []);
    for (const row of rows) {
        const tds = row.split(',');
        for (let i = 0; i < tds.length; i++) {
            cols[i].push(tds[i]);
        }
    }

    return cols;
}

function filterCols(cols: string[][], colIndicies: number[]) {
    const indiciesSet = new Set(colIndicies);
    return cols.filter((cols, idx) => indiciesSet.has(idx));
}

function colsAsCsv(cols: string[][]) {
    let csv = '';
    for (let r = 0; r < cols[0].length; r++) {
        for (let c = 0; c < cols.length; c++) {
            csv += cols[c][r] + ',';
        }
        csv = csv.substring(0, csv.length - 1);
        csv += '\n';
    }
    return csv;
}

function csvAsRows(csv: string) {
    const rows = csv.trim().split(/\r?\n|\r/);
    return rows.map((row) => row.split(','));
}

export let rowsToRender: string[][] = [];

fetch(
    new Request(
        'https://static.jpcode.dev/benchmarks/dotnet/Bench_Dictionaries.Bench-report.csv',
        {
            method: 'GET',
        }
    )
).then(async (data) => {
    const csv = await data.text();
    const cols = csvAsCols(csv);
    const filteredCols = filterCols(cols, [0, 1, 42, 43, 44, 45, 46, 47]);
    const filteredColsAsCsv = colsAsCsv(filteredCols);
    rowsToRender = csvAsRows(filteredColsAsCsv);
    console.log(filteredCols);
    console.log(filteredColsAsCsv);
    console.log(csv);
    console.log(rowsToRender);
    // csv_string_to_table(colsAsCsv(filteredCols), document.getElementById('table'));
});

let repeatedDivs = Array(getNumber(10))
    .fill(0)
    .map((el) => 'div text');
</script>

<main>
    {#each repeatedDivs as d, i}
        <div>{d} {i}</div>
    {/each}
    <div id="table">
        <table>
            {#each [...rowsToRender] as row}
                <tr>
                    {#each row as el}
                        <td>{el}</td>
                    {/each}
                </tr>
            {/each}
        </table>
    </div>
    <h2>by {authorName} {getNumber(100)}</h2>
</main>

<style>
h2 {
    color: #454545;
    font-weight: 350;
}

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
    background-color: #f2f2f2;
}
</style>
