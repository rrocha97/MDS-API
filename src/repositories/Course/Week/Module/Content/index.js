

class Contents {

   constructor({ type, filename, filepath, filesize, fileurl,
      timecreated, timemodified, sortorder, mimetype,
      isexternalfile, userid, author, license }) {
      this.type = type
      this.filename = filename
      this.filepath = filepath
      this.filesize = filesize
      this.fileurl = fileurl
      this.timecreated = timecreated
      this.timemodified = timemodified
      this.sortorder = sortorder
      this.mimetype = mimetype
      this.isexternalfile = isexternalfile
      this.userid = userid
      this.author = author
      this.license = license
   }
}

module.exports = Contents