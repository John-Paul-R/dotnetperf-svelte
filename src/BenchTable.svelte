<script lang="ts">
import { csvAsCols, filterCols, transpose } from "./csv_parse";
export let csvString: string;
export let headerRow: string[] = [];
export let rowsToRender: string[][] = [];

{
    const cols = csvAsCols(csvString);
    const filteredCols = filterCols(cols, [0, 1, 43, 44, 45, 46, 47]);
    
    const rows = transpose(filteredCols);

    headerRow = rows[0];
    rowsToRender = rows.slice(1);
}

</script>

<main>
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
</main>

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
