const ConvertQuerySearch = (value) => {
    if (typeof value == 'string') return value == 'yes' ? true : false
    if (typeof value == null || typeof value == undefined) return false
}

const GetSyllabusWords = () => {
    if (process.env.SYLLABUS_WORDS) {
        return process.env.SYLLABUS_WORDS.split(',')
    }
    return []
}

const GetFileNamesSuffixWords = () => {
    if (process.env.FILENAMES_SUFFIX) {
        return process.env.FILENAMES_SUFFIX.split(',')
    }
    return []
}

const GetFolderNamesSuffixWords = () => {
    if (process.env.FOLDERNAMES_SUFFIX) {
        return process.env.FOLDERNAMES_SUFFIX.split(',')
    }
    return []
}

const GetTotalFileNameSuffix = () => {
    return GetFileNamesSuffixWords().length
}

const GetTotalFolderNameSuffix = () => {
    return GetFolderNamesSuffixWords().length
}

const GetPercentajeToBeValid = () => {
    if (process.env.COURSE_PERCENTAJE) {
        return Number.parseInt(process.env.COURSE_PERCENTAJE)
    }
    return 100
}

module.exports = {
    ConvertQuerySearch,
    GetSyllabusWords,
    GetFileNamesSuffixWords,
    GetFolderNamesSuffixWords,
    GetTotalFileNameSuffix,
    GetTotalFolderNameSuffix,
    GetPercentajeToBeValid
}