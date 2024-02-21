const {Router} = require("express")
const MoviesController = require('../controllers/MoviesController')

const moviesRoutes = Router();
const moviesController = new MoviesController;

moviesRoutes.get("/", moviesController.index)
moviesRoutes.post("/", moviesController.create)
moviesRoutes.get("/:note_id", moviesController.show)
moviesRoutes.delete("/:note_id", moviesController.delete)


module.exports = moviesRoutes;
