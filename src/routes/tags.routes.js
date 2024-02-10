const {Router} = require("express")
const TagsController = require('../controllers/TagsController')

const tagsRoutes = Router();
const tagscontroller = new TagsController;

tagsRoutes.get("/", tagscontroller.index)
tagsRoutes.get("/:tag_id", tagscontroller.show)

module.exports = tagsRoutes;
