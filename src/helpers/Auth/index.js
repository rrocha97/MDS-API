const axios = require('axios')
const { Services } = require('../../consts')

class Auth {
    constructor() {
        this.SERVICE_MOODLE_CATEGORIES_TOKEN = process.env.SERVICE_MOODLE_CATEGORIES_TOKEN
        this.SERVICE_MOODLE_MOBILE_TOKEN = process.env.SERVICE_MOODLE_MOBILE_TOKEN
        this.SERVICE_MOODLE_URL = process.env.SERVICE_MOODLE_URL
        this.USERNAME = process.env.LOGIN_USERNAME
        this.PASSWORD = process.env.LOGIN_PASSWORD
    }

    static getInstance(): Auth {
        return this._instance || (this._instance = new this())
    }

    getMoodleCategoriesToken(): string {
        return this.SERVICE_MOODLE_CATEGORIES_TOKEN
    }

    public getMoodleMobileToken(): string {
        return this.SERVICE_MOODLE_MOBILE_TOKEN
    }

    public async revalidateTokens(): Promise<void> {
        await axios.get(this.getTokenUri(Services.MOODLE_CATEGORIES_DATA))
            .then(response => {
                this.SERVICE_MOODLE_CATEGORIES_TOKEN = response.data.token
            })
            .catch(ServerError => console.error(ServerError))

        await axios.get(this.getTokenUri(Services.MOODLE_MOBILE_APP))
            .then(response => {
                this.SERVICE_MOODLE_MOBILE_TOKEN = response.data.token
            })
            .catch(ServerError => console.error(ServerError))
    }

    private getTokenUri(service): string {
        if (!this.USERNAME.isEmpty() && !this.PASSWORD.isEmpty()) {
            return `${this.SERVICE_MOODLE_URL}/login/token.php?username=${this.USERNAME}&password=${this.PASSWORD}&service=${service}`
        }
        throw new Error(`We don't have valid params to get a token`)
    }
}

export default Auth;