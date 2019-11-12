const Contents = require('./Content')

class Module {
    constructor({ id, url, name, instance, uservisible: boolean,
        visibleoncoursepage, modicon, modname, modplural,
        availability, indent, contents }) {
        this.id = id
        this.url = url
        this.name = name
        this.instance = instance
        this.uservisible = uservisible
        this.visibleoncoursepage = visibleoncoursepage
        this.modicon = modicon
        this.modname = modname
        this.modplural = modplural
        this.availability = availability
        this.indent = indent
        this.contents = new Contents(contents)
    }
}

module.exports = Module