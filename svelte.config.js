import preprocess from 'svelte-preprocess';

const config = {
    preprocess: preprocess({
        typescript: {
            tsconfigFile: './tsconfig.json',
        }
    })
}

export default config;