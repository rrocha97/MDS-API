const express = require("express");

const router = express.Router();
const category = require('./controllers/Category')

module.exports = () => {
  //index
  const indexRouter = express.Router();
  indexRouter.get("/", (req, res) => {
    res.status(200).json({ response: "MDSApp Service API is working properly." });
  });

  indexRouter.get("/category/:id", category.GetCategory);
  indexRouter.get("/category/:id/childs", category.GetCategoires);


  router.use("/", indexRouter);

  return router;
};
