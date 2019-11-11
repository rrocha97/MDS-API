const axios = require('axios')
const { MoodleCategoriesDataFunctions } = require('../../../constants')

const GetCategory = async (req, res) => {
    try {
        let categories = []
        const URI = new WebServiceUri(MoodleCategoriesDataFunctions.LOCAL_MOODLE_CATEGORIES_CHILDS, Auth.getInstance().getMoodleCategoriesToken(), `categoryid=${String(req.params.id)}`).getURI()
        //await axios.get(URI)

        res.status(200).json({ response: ' result.value ' });
    } catch (error) {
        res.status(500).json({ response: 'me las cague!' });
    }

};

module.exports = GetCategory;
