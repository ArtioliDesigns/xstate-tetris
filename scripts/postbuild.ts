import sh from 'shelljs';
import upath from 'upath';

import { run } from './_lib/shell';

const angularJSONPath = upath.resolve(upath.dirname(__filename), '../angular.json');
const angularJSON = require(angularJSONPath);

const testAppPath = upath.resolve(upath.dirname(__filename), '../test-app/index.html');

const buildPath = upath.resolve(upath.dirname(__filename), '../build');

const projects = Object.keys(angularJSON.projects);

console.log(`INFO: projects: ${projects}`);

const main = async () => {
    projects.forEach((project) => {
        const projectPath = upath.resolve(buildPath, project);
        sh.mkdir('-p', upath.resolve(projectPath, 'dist'));
        const allJavascriptFiles = [
            upath.resolve(projectPath, 'runtime.js'),
            upath.resolve(projectPath, 'polyfills.js'),
            upath.resolve(projectPath, 'main.js'),
        ];
        const allJavascriptFilesJoinString = allJavascriptFiles.join(' ');
        console.log(allJavascriptFilesJoinString);

        const distFileName = upath.resolve(projectPath, 'dist', `xstate-${project}.js`);
        console.log(distFileName);

        run(`cat ${allJavascriptFilesJoinString} > ${distFileName}`);
    });

    sh.cp(testAppPath, upath.resolve(buildPath, 'index.html'));
};

main();
