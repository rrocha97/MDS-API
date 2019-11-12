const axios = require('axios')
const { MoodleCategoriesDataFunctions } = require('../../../constants')
const Auth = require('../../helpers/Auth')
const WebServiceUri = require('../../helpers/webserviceuri')
const Category = require('../../repositories/Category')
const { ConvertQuerySearch } = require('../../helpers/utils')


const GetCategoires = async (req, res) => {
    try {
        let categories = []
        let auth = new Auth
        await auth.revalidateTokens()
        let URI = new WebServiceUri(MoodleCategoriesDataFunctions.LOCAL_MOODLE_CATEGORIES_CHILDS, auth.getMoodleCategoriesToken(), `categoryid=${String(req.params.id)}`).getURI()
        let response = await axios.get(URI)
        if (response.data.errorcode === 'invalidtoken') {
            await auth.revalidateTokens()
            URI = new WebServiceUri(MoodleCategoriesDataFunctions.LOCAL_MOODLE_CATEGORIES_CHILDS, auth.getMoodleCategoriesToken(), `categoryid=${String(req.params.id)}`).getURI()
            response = await axios.get(URI)
        }
        let aux = response.data
        aux.forEach(childCategory => {
            categories.push(new Category(childCategory.id, childCategory.name, childCategory.idnumber, childCategory.description, childCategory.descriptionformat, childCategory.parent, childCategory.sortorder, childCategory.coursecount, childCategory.visible))
        })
        for (const category of categories) {
            if (ConvertQuerySearch(req.query.SetCourses) || ConvertQuerySearch(req.query.ValidateCategory)) {
                await category.SetCourses(ConvertQuerySearch(req.query.force), ConvertQuerySearch(req.query.ValidateCourse) || ConvertQuerySearch(req.query.ValidateCategory), auth)
                for (const course of category.courses) {
                    await course.SetContent(ConvertQuerySearch(req.query.force), auth)
                }
            }
            await category.SetChildCategories(ConvertQuerySearch(req.query.force), auth)
            if (ConvertQuerySearch(req.query.ValidateCategory)) {
                await category.ConsolidateStats()
            }
        }
        res.status(200).json(categories)
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }

};

module.exports = GetCategoires;
