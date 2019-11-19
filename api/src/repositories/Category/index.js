const WebServiceUri = require('../../helpers/webserviceuri')
const Course = require('../Course')
const Auth = require('../../helpers/Auth')
const axios = require('axios')
const CustomError = require('../../helpers/utils/CustomError')
const { MoodleCategoriesDataFunctions } = require('../../../constants')

class Category {
    constructor(id, name, idnumber, description, descriptionformat,
        parent, sortorder, coursecount, visible) {
        this.id = id
        this.name = name
        this.idnumber = idnumber
        this.description = description ? description.replace('<', '&lt;').replace('>', '&gt;') : null
        this.descriptionformat = descriptionformat
        this.parent = parent
        this.sortorder = sortorder
        this.coursecount = coursecount
        this.visible = visible
        this.courses = []
        this.categories = []
        this.stats = {}
    }

    async SetCourses(force = false, validateCourse = false, auth = new Auth) {
        if (this.courses.length == 0 || force == true) {
            let resp = await axios.get(new WebServiceUri(MoodleCategoriesDataFunctions.LOCAL_MOODLE_CATEGORIES_COURSES, auth.getMoodleCategoriesToken(), `categoryid=${String(this.id)}`).getURI())
            if (resp.data.errorcode) {
                this.courses = []
                throw new CustomError(resp.data.exception, resp.data.errorcode, resp.data.message)
            }
            for (const course of (resp.data)) {
                const CourseToAdd = new Course(course.id, course.category, course.sortorder, course.fullname, course.shortname, course.idnumber, course.summary, course.summaryformat, course.showgrades, course.newsitems, course.startdate, course.enddate, course.marker, course.maxbytes, course.legacyfiles, course.showreports, course.visible, course.visibleold, course.groupmode, course.defaultgroupingid, course.lang, course.calendarytype, course.theme, course.timecreated, course.timemodified, course.requested, course.enablecompletion, course.completionnotify, course.cacherev, course.weeks)
                if (validateCourse) {
                    await CourseToAdd.RunValidation()
                }

                this.courses.push(CourseToAdd)
            }


        }
        return this.courses
    }

    async SetChildCategories(force = false, auth = new Auth) {
        if (this.categories.length == 0 || force) {
            await axios.get(new WebServiceUri(MoodleCategoriesDataFunctions.LOCAL_MOODLE_CATEGORIES_CHILDS, auth.getMoodleCategoriesToken(), `categoryid=${String(this.id)}`).getURI())
                .then(resp => {
                    if (resp.data.errorcode) {
                        this.categories = []
                        throw new CustomError(resp.data.exception, resp.data.errorcode, resp.data.message)
                    }
                    this.categories = resp.data
                })
        }
        return this.categories
    }

    async ConsolidateStats() {
        if (!this.courses) {
            await this.SetCourses(true, true)
        }
        this.stats.valid_courses = ((this.courses.filter(course => course.validation.valid === true)).length / this.courses.length) * 100
        this.stats.courses_with_syllabus = ((this.courses.filter(course => course.validation.syllabus === true)).length / this.courses.length) * 100
        this.stats.courses_with_syllabus_visible = ((this.courses.filter(course => course.validation.syllabusVisible === true)).length / this.courses.length) * 100
        this.stats.course_approbation = (this.courses.map(course => { return course.validation.percentaje }).reduce((total, current) => { return total + (current / this.courses.length) }, 0))
    }
}

module.exports = Category