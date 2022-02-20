export function csvAsCols(csv: string) {
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

export function filterCols(cols: string[][], colIndicies: number[]) {
    const indiciesSet = new Set(colIndicies);
    return cols.filter((cols, idx) => indiciesSet.has(idx));
}

export function colsAsCsv(cols: string[][]) {
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

export function transpose<T>(matrix: T[][]) {
    const rows = matrix.length,
        cols = matrix[0].length;
    const grid: T[][] = [];
    for (let j = 0; j < cols; j++) {
        grid[j] = Array<T>(rows);
    }
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[j][i] = matrix[i][j];
        }
    }
    return grid;
}

export function csvAsRows(csv: string) {
    const rows = csv.trim().split(/\r?\n|\r/);
    return rows.map((row) => splitCsvLine(row)); //row.split(/,/));
}

const splitCsvLine = (csvRow: string) => {
    const outValues = [];
    let inString = false;
    let arrCurStr = [];
    for (let i = 0; i < csvRow.length; i++) {
        const cur = csvRow[i];
        if (cur === '"') {
            inString = !inString;
            continue;
        }
        if (!inString && cur === ',') {
            outValues.push(arrCurStr.join(''));
            arrCurStr = [];
            continue;
        }
        arrCurStr.push(cur);
    }
    outValues.push(arrCurStr.join(''));
    return outValues;
};
