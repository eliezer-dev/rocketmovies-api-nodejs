const {Router} = require("express")
const UsersController = require('../controllers/UsersController')
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const multer = require("multer")
const uploadConfig = require("../configs/upload");

const usersRoutes = Router();
const usersController = new UsersController;
const userAvatarController = new UserAvatarController
const upload = multer(uploadConfig.MULTER)

usersRoutes.get("/", ensureAuthenticated, usersController.index)
usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensureAuthenticated, usersController.update)
usersRoutes.get("/:user_id", ensureAuthenticated, usersController.show)
usersRoutes.delete("/:user_id", usersController.delete)
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)

module.exports = usersRoutes;
