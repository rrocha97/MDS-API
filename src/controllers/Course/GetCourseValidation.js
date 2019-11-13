const axios = require('axios')
const { MoodleApiFunctions } = require('../../../constants')
const Auth = require('../../helpers/Auth')
const WebServiceUri = require('../../helpers/webserviceuri')
const Course = require('../../repositories/Course')
const { ConvertQuerySearch } = require('../../helpers/utils')


const GetCourseValidation = async (req, res) => {
    try {
        let auth = new Auth
        await auth.revalidateTokens()
        let URI = new WebServiceUri(MoodleApiFunctions.CORE_COURSE_GET_COURSES_BY_FIELD, auth.getMoodleMobileToken(), `field=id&value=${String(req.params.id)}`).getURI()
        let response = await axios.get(URI)

        if (response.data.courses.length == 1) {
            const aux = response.data.courses[0]
            const course = new Course(aux.id, aux.category, aux.sortorder, aux.fullname, aux.shortname, aux.idnumber, aux.summary, aux.summaryformat, aux.showgrades, aux.newsitems, aux.startdate, aux.enddate, aux.marker, aux.maxbytes, aux.legacyfiles, aux.showreports, aux.visible, aux.visibleold, aux.groupmode, aux.defaultgroupingid, aux.lang, aux.calendarytype, aux.theme, aux.timecreated, aux.timemodified, aux.requested, aux.enablecompletion, aux.completionnotify, aux.cacherev, aux.weeks)
            await course.SetContent(ConvertQuerySearch(req.query.force), auth)
            await course.RunValidation()
            res.status(200).json(await course.GetValidation())
        } else {
            res.status(404).json({ error: ErrorResponses.RESOURCE_NOT_FOUND })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }

};

module.exports = GetCourseValidation;
