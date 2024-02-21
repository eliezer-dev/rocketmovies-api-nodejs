const {Router} = require("express")
const UsersController = require('../controllers/UsersController')

const usersRoutes = Router();
const usersController = new UsersController;
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

usersRoutes.get("/", ensureAuthenticated, usersController.index)
usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
usersRoutes.get("/:user_id", ensureAuthenticated, usersController.show)
usersRoutes.delete("/:user_id", usersController.delete)

module.exports = usersRoutes;
