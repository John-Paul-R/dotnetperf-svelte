export type DataColName = 'Mean' | 'Median' | 'Allocated';
export enum BarChartDisplayMode {
    Absolute,
    Relative,
    PerValue,
}
export const maxDisplayModeIdx = Object.keys(BarChartDisplayMode).length;
/**
 * @param en The enum (type)
 * @param current The current enum value
 */
export function cycleEnumValues<T>(en: T, current: number) {
    return current + 1 >= Object.keys(en).length / 2 ? 0 : current + 1;
}
