class WebServiceUri {
    constructor(wsfunction, token, params) {
        this.params = params
        this.wsfunction = wsfunction
        this.token = token
    }

    getURI() {
        if (this.params)
            return encodeURI(`http://savio.utb.edu.co/webservice/rest/server.php?wsfunction=${this.wsfunction}&${this.params}&moodlewsrestformat=json&wstoken=${this.token}`)
        else
            return encodeURI(`http://savio.utb.edu.co/webservice/rest/server.php?wsfunction=${this.wsfunction}&moodlewsrestformat=json&wstoken=${this.token}`)
    }
}

module.exports = WebServiceUri
