import concurrently from 'concurrently';

const port = process.env.PORT || 4777;

const angularCommand = `npm run ng -- serve --host 0.0.0.0 --port ${port} --open`;

const { result } = concurrently(
    [
        { command: 'npm run pug:watch', name: 'PUG_WATCH', prefixColor: 'bgGreen.bold' },
        {
            command: angularCommand,
            name: 'NG_SERVE',
            prefixColor: 'bgBlue.bold',
        },
    ],
    {
        prefix: 'name',
        killOthers: ['failure', 'success'],
    }
);

result.then(success, failure);

function success() {
    console.log('Success');
}

function failure() {
    console.log('Failure');
}
