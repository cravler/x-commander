const commander = require('commander');
const { HelpTemplate } = require('./package'); // internal package

class Help extends commander.Help {

    /**
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {string}
     */
    renderHelpTemplate(cmd, helper) {
        return (new HelpTemplate(cmd, helper)).render();
    };

    /**
     * @inheritdoc
     */
    formatHelp(cmd, helper) {
        return helper.renderHelpTemplate(cmd, helper);
    };

}

class Command extends commander.Command {

    /**
     * @inheritdoc
     */
    createCommand(...args) {
        return new Command(...args);
    };

    /**
     * @inheritdoc
     */
    createHelp() {
        return Object.assign(new Help(), this.configureHelp());
    };

}

const program = new Command();

for (let key in commander) {
    if (typeof commander[key] === 'function' && /^\s*class\s+/.test(commander[key].toString())) {
        program[key] = commander[key];
    }
}

program.HelpTemplate = HelpTemplate;
program.Command = Command;
program.Help = Help;

module.exports = program;