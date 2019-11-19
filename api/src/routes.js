const express = require("express");

const router = express.Router();
const category = require('./controllers/Category')
const course = require('./controllers/Course')

module.exports = () => {
  //index
  const indexRouter = express.Router();
  indexRouter.get("/", (req, res) => {
    res.status(200).json({ response: "MDSApp Service API is working properly." });
  });

  indexRouter.get("/category/:id", category.GetCategory);
  indexRouter.get("/category/:id/childs", category.GetCategoires);
  indexRouter.get("/course/:id", course.GetCourse);
  indexRouter.get("/course/:id/validation", course.GetCourseValidation);

  router.use("/", indexRouter);

  return router;
};
