import sh from 'shelljs';

export function run(commandString: string) {
    const result = sh.exec(`set -x && ${commandString}`);
    if (result.code !== 0) {
        throw new Error(`${result.stderr}`);
    }
    return result;
}

export * from 'shelljs';
