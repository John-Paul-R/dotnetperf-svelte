export async function readCsvFile(file: any): Promise<string | undefined> {
    if (file.type !== 'text/csv') {
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file);
    const out = new Promise<string | undefined>((resolve) => {
        reader.addEventListener('load', async (e) => {
            resolve(reader.result?.toString());
        });
    });
    return out;
}
