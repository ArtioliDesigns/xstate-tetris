import chokidar from 'chokidar';
import fs from 'fs';
import workerpool from 'workerpool';

const pool = workerpool.pool(__dirname + '/render-pug.js', {
    minWorkers: 'max',
});

const watcher = chokidar.watch('projects', {
    persistent: true,
});

process.title = 'pug-watch';

let allFiles: Record<string, boolean> = {};

watcher.on('add', (filePath) => _processFile(filePath, 'add'));
watcher.on('change', (filePath) => _processFile(filePath, 'change'));

function _processFile(filePath: string, watchEvent: string) {
    if (filePath.match(/\.pug$/)) {
        return _handlePug(filePath, watchEvent);
    }
}

function _handlePug(filePath: string, watchEvent: string) {
    allFiles[filePath] = true;

    if (watchEvent === 'change') {
        if (filePath.match(/pug_include/)) {
            return _renderDependants(filePath);
        }
        return _renderPug(filePath);
    }
    if (!filePath.match(/pug_include/)) {
        return _renderPug(filePath);
    }
}

function _renderDependants(filePath: string) {
    console.log(`### INFO: Looking for dependants of ${filePath}`);
    const pathToLookFor = filePath.match(/pug_include\/[-_a-z0-1]+.pug$/)![0];
    const dependants = Object.keys(allFiles).filter((filePath) => {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return fileContents.match(pathToLookFor);
    });
    console.log(`### INFO: Found dependants:`);
    console.log(dependants);
    dependants.forEach((dependant) => _handlePug(dependant, 'change'));
}

function _renderPug(filePath: string) {
    return new Promise(function (resolve, reject) {
        pool.exec('renderPug', [filePath])
            .then(function (result) {
                resolve(result);
            })
            .catch(function (err) {
                console.error(err);
                reject(err);
            });
    });
}
