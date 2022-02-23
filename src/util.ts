export const range = (start: number, end: number) =>
    Array(end + 1 - start)
        .fill(null)
        .map((_, i) => start + i);

const numberWithUnitRegex = /([0-9,\.]+)\s?(\S+)/;
export const parseUnitNum = (timeStr: string) =>
    Number(timeStr.match(numberWithUnitRegex)?.[1]?.replace(',', ''));
