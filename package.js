class HelpTemplate {

    /**
     * @param {Command} cmd
     * @param {Help} helper
     */
    constructor(cmd, helper) {
        this.cmd = cmd;
        this.helper = helper;
    };

    /**
     * @returns {string}
     */
    usage() {
        return this.helper.commandUsage(this.cmd);
    };

    /**
     * @returns {string}
     */
    description() {
        return this.helper.commandDescription(this.cmd);
    };

    /**
     * @returns {{ term: string, description: string }[]}
     */
    arguments() {
        return this.helper.visibleArguments(this.cmd);
    };

    /**
     * @returns {{ term: string, description: string }[]}
     */
    options() {
        return this.helper.visibleOptions(this.cmd).map(option => ({
            term: this.helper.optionTerm(option),
            description: this.helper.optionDescription(option)
        }));
    };

    /**
     * @returns {{ term: string, description: string }[]}
     */
    commands() {
        return this.helper.visibleCommands(this.cmd).map(cmd => ({
            term: this.helper.subcommandTerm(cmd),
            description: this.helper.subcommandDescription(cmd)
        }));
    };

    /**
     * @returns {string}
     */
    render() {
        const params = {
            newLineUsage: false,
            indentDescription: false,
            baseIndentWidth: 0,
            itemIndentWidth: 2,
            itemSeparatorWidth: 2,
            minColumnWidthForWrap: 40,
            ...(this.helper.formatParams || {})
        };

        const newLineUsage = params.newLineUsage;
        const indentDescription = params.indentDescription;
        const baseIndentWidth = params.baseIndentWidth;
        const itemIndentWidth = params.itemIndentWidth;
        const itemSeparatorWidth = params.itemSeparatorWidth;
        const minColumnWidthForWrap = params.minColumnWidthForWrap;

        const helpWidth = (this.helper.helpWidth || 80) - (baseIndentWidth * 2);
        const termWidth = this.helper.padWidth(this.cmd, this.helper);

        const baseIndent = ' '.repeat(baseIndentWidth);
        const itemIndent = ' '.repeat(itemIndentWidth);

        const applyStyle = (type, value) => {
            const fn = (this.helper.styles || {})[type] || (str => str);
            return fn(value);
        };

        const formatList = (arr) => {
            return arr.map(({ term, description }) => {
                if (description) {
                    const formatedTerm = term.padEnd(termWidth + itemSeparatorWidth);
                    return [
                        applyStyle(
                            'term',
                            formatedTerm
                        ),
                        applyStyle(
                            'termDescription',
                            this.helper.wrap(
                                `${formatedTerm}${description}`,
                                helpWidth - itemIndentWidth,
                                termWidth + itemSeparatorWidth,
                                minColumnWidthForWrap
                            ).substring(formatedTerm.length)
                        )
                    ].join('');
                }
                return applyStyle(
                    'term',
                    term
                );
            }).join('\n').replace(/^/gm, itemIndent);
        };

        const labels = {
            usage: 'Usage:',
            description: undefined,
            arguments: 'Arguments:',
            options: 'Options:',
            commands: 'Commands:',
            ...(this.helper.labels || {})
        };
        Object.keys(labels).map(key => {
            if (labels[key]) {
                labels[key] = applyStyle(
                    'label',
                    labels[key]
                );
            }
        });

        // Usage
        let output = [
            labels.usage + (newLineUsage ? '\n' + itemIndent : ' ') +
            applyStyle(
                'usage',
                this.usage()
            ),
            ''
        ];

        // Description
        if (this.description().length) {
            if (labels.description) {
                output = output.concat([labels.description]);
            }
            output = output.concat([
                applyStyle(
                    'description',
                    this.helper.wrap(
                        (labels.description || indentDescription ? itemIndent : '') + this.description(),
                        helpWidth,
                        (labels.description || indentDescription ? itemIndentWidth : 0),
                        minColumnWidthForWrap
                    )
                ),
                ''
            ]);
        }

        // Arguments
        if (this.arguments().length) {
            output = output.concat([
                labels.arguments,
                formatList(this.arguments()),
                ''
            ]);
        }

        // Options
        if (this.options().length) {
            output = output.concat([
                labels.options,
                formatList(this.options()),
                ''
            ]);
        }

        // Commands
        if (this.commands().length) {
            output = output.concat([
                labels.commands,
                formatList(this.commands()),
                ''
            ]);
        }

        return output.join('\n').replace(/^/gm, baseIndent).trimEnd() + '\n';
    };

}

module.exports = { HelpTemplate };