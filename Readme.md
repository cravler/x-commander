# x-commander

Extended version of [commander.js](https://github.com/tj/commander.js)

## Installation

```sh
npm install x-commander
```

## Usage

```js
const { program } = require('x-commander');

// defaults
program.configureHelp({
    labels: {
        usage: 'Usage:',
        description: undefined,
        arguments: 'Arguments:',
        options: 'Options:',
        commands: 'Commands:',
    },
    styles: {
        label: str => str,
        usage: str => str,
        description: str => str,
        term: str => str,
        termDescription: str => str,
    },
    formatParams: {
        newLineUsage: false,
        indentDescription: false,
        baseIndentWidth: 0,
        itemIndentWidth: 2,
        itemSeparatorWidth: 2,
        minColumnWidthForWrap: 40,
    },
    formatHelp(cmd, helper) {
        return helper.renderHelpTemplate(cmd, helper);
    }
});
```

## License

MIT
