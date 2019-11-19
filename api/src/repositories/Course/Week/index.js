const Module = require('./Module')

class Week {

    constructor(id, name, visible, summary,
        summaryformat, section, hiddenbynumsections,
        uservisible, modules) {
        this.id = id
        this.name = name
        this.visible = visible
        this.summary = summary ? summary.replace('<', '&lt;').replace('>', '&gt;') : null
        this.summaryformat = summaryformat
        this.section = section
        this.hiddenbynumsections = hiddenbynumsections
        this.uservisible = uservisible
        this.modules = new Module(modules)
    }
}

module.exports = Week