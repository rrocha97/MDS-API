const axios = require('axios')
const { MoodleCategoriesDataFunctions } = require('../../../constants')
const Auth = require('../../helpers/Auth')
const WebServiceUri = require('../../helpers/webserviceuri')
const Category = require('../../repositories/Category')
const { ConvertQuerySearch } = require('../../helpers/utils')


const GetCategory = async (req, res) => {
    try {
        let auth = new Auth
        await auth.revalidateTokens()
        let URI = new WebServiceUri(MoodleCategoriesDataFunctions.LOCAL_MOODLE_CATEGORIES_GET_CATEGORY, auth.getMoodleCategoriesToken(), `categoryid=${String(req.params.id)}`).getURI()
        let response = await axios.get(URI)

        let aux = response.data
        const category = new Category(aux.id, aux.name, aux.idnumber, aux.description, aux.descriptionformat, aux.parent, aux.sortorder, aux.coursecount, aux.visible)

        await category.SetCourses(ConvertQuerySearch(req.query.force), ConvertQuerySearch(req.query.ValidateCourse) || ConvertQuerySearch(req.query.ValidateCategory), auth)
        for (const course of category.courses) {
            await course.SetContent(ConvertQuerySearch(req.query.force), auth)
        }
        await category.SetChildCategories(ConvertQuerySearch(req.query.force), auth)
        if (ConvertQuerySearch(req.query.ValidateCategory)) {
            await category.ConsolidateStats()
        }
        res.status(200).json(category)
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }

};

module.exports = GetCategory;
