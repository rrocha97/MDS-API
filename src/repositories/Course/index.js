const axios = require('axios')
const WebServiceUri = require('../../helpers/webserviceuri')
const Auth = require('../../helpers/Auth')
const CustomError = require('../../helpers/utils/CustomError')
const Week = require('./Week')
const { MoodleApiFunctions } = require('../../../constants')
// import { Module } from './Week/Module';
// import { throws } from 'assert';
// import { type } from 'os';
const { GetSyllabusWords, GetFolderNamesSuffixWords, GetFileNamesSuffixWords, GetPercentajeToBeValid, GetTotalFileNameSuffix, GetTotalFolderNameSuffix } = require('../../../constants')

class Course {
    constructor(id, category, sortorder, fullname, shortname,
        idnumber, summary, summaryformat, showgrades,
        newsitems, startdate, enddate, marker, maxbytes,
        legacyfiles, showreports, visible, visibleold,
        groupmode, defaultgroupingid, lang, calendarytype,
        theme, timecreated, timemodified, requested,
        enablecompletion, completionnotify, cacherev, weeks) {
        this.id = id
        this.category = category
        this.sortorder = sortorder
        this.fullname = fullname
        this.shortname = shortname
        this.idnumber = idnumber
        this.summary = summary
        this.summaryformat = summaryformat
        this.showgrades = showgrades
        this.newsitems = newsitems
        this.startdate = startdate
        this.enddate = enddate
        this.marker = marker
        this.maxbytes = maxbytes
        this.legacyfiles = legacyfiles
        this.showreports = showreports
        this.visible = visible
        this.visibleold = visibleold
        this.groupmode = groupmode
        this.defaultgroupingid = defaultgroupingid
        this.lang = lang
        this.calendarytype = calendarytype
        this.theme = theme
        this.timecreated = timecreated
        this.timemodified = timemodified
        this.requested = requested
        this.enablecompletion = enablecompletion
        this.completionnotify = completionnotify
        this.cacherev = cacherev
        this.weeks = weeks ? weeks : []
        this.organized = {}
        this.validation = {}
    }

    async SetContent(force = false, auth = new Auth) {
        if (this.weeks.length === 0 || force) {
            await axios.get(new WebServiceUri(MoodleApiFunctions.CORE_COURSE_GET_CONTENTS, auth.getMoodleMobileToken(), `courseid=${String(this.id)}`).getURI())
                .then(resp => {
                    if (resp.data.errorcode) {
                        this.weeks = []
                        throw new CustomError(resp.data.exception, resp.data.errorcode, resp.data.message, new WebServiceUri(MoodleApiFunctions.CORE_COURSE_GET_CONTENTS, auth.getMoodleMobileToken(), `courseid=${String(this.id)}`).getURI())
                    }
                    this.weeks = resp.data
                })
            await this.OrganizeContent()
        }
        return this.weeks
    }

    OrganizeContent() {
        if (this.weeks.length != 0) {
            for (const week of this.weeks) {
                if (week.modules.length != 0) {
                    week.modules.map(item => item).reduce((result, currenValue) => {
                        this.organized[currenValue.modname] = [].concat((this.organized[currenValue.modname] || []), currenValue)
                        return result
                    }, {})
                }
            }
        }
    }

    async RunValidation() {
        if (this.weeks.length === 0) {
            await this.SetContent(true)
        }

        if (!this.organized) {
            await this.OrganizeContent()
        }
        //# Initializacion of variables
        this.validation.valid = false
        this.validation.percentaje = 0
        this.validation.folders = {}
        const sillabus = this.organized.resource ? (this.organized.resource).filter(item => new RegExp(GetSyllabusWords().join('|')).test(item.name.toLowerCase()) || new RegExp(GetSyllabusWords().join('|')).test(item.contents[0].filename.toLowerCase())) : []
        this.validation.syllabus = sillabus.length > 0 ? true : false
        this.validation.syllabusVisible = sillabus.length > 0 ? sillabus[0].visible === 1 ? true : false : false
        this.validation.syllabus ? this.validation.percentaje += (10 / 2) : false
        this.validation.syllabusVisible ? this.validation.percentaje += (10 / 2) : false

        //validate folders
        const invisibleFolders = this.organized.folder ? (this.organized.folder).filter(item => item.visible === 0) : []
        if (invisibleFolders) {
            invisibleFolders.map(item => {
                item.name ? new RegExp(GetFolderNamesSuffixWords().join('|')).test(item.name.toLowerCase()) ? item.contents.length != 0 ? this.validation.percentaje += ((90 / GetTotalFolderNameSuffix()) / item.contents.length) : false : false : false
                if (item.contents.length > 0) {
                    item.contents.reduce((prev, current, index) => {
                        this.validation.folders[item.name] ? true : this.validation.folders[item.name] = {}
                        const filenameSplit = current.filename.split('-')
                        if (filenameSplit.length > 1) {
                            const filenameSplitSecond = filenameSplit[1].split('.')
                            if (filenameSplitSecond.length > 1) {
                                this.validation.folders[item.name][filenameSplit[0]] = [].concat((this.validation.folders[item.name][filenameSplit[0]] || []), filenameSplitSecond[0])
                            }
                        }
                    }, {})
                }
            })
        }

        //validate files
        for (const folder of Object.keys(this.validation.folders)) {
            for (const activity of Object.keys(this.validation.folders[folder])) {
                for (const suffix of (this.validation.folders[folder][activity])) {
                    new RegExp(GetFileNamesSuffixWords().join('|')).test(suffix.toLowerCase()) ? this.validation.percentaje += ((90 / GetTotalFolderNameSuffix()) / (Object.keys(this.validation.folders[folder]).length * GetTotalFileNameSuffix())) : false
                }
            }
        }

        this.validation.percentaje >= GetPercentajeToBeValid() ? this.validation.valid = true : false
    }

    async GetValidation() {
        if (!this.validation) {
            await this.RunValidation()
        }
        return this.validation
    }
}


module.exports = Course