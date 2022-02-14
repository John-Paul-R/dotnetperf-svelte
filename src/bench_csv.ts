export const getEndRowIdx = (header: string[]) => {
    const endStatsRows = ['Allocated', 'Gen 2', 'Gen 1', 'Gen 0', 'StdDev'];

    for (const headName of endStatsRows) {
        const idx = header.indexOf(headName);
        if (idx !== -1) {
            return idx;
        }
    }
    throw new Error('Could not find a valid end stats row.');
};
