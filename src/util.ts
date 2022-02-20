export const range = (start: number, end: number) =>
    Array(end + 1 - start)
        .fill(null)
        .map((_, i) => start + i);

export const parseUnitNum = (timeStr: string) =>
    Number(timeStr.substring(0, timeStr.length - 3).replace(',', ''));
