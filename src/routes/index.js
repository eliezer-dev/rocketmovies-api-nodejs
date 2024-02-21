const {Router} = require ('express');
const usersRoutes = require('./users.routes');
const moviesRoutes = require('./movies.routes');
const tagsRoutes = require('./tags.routes');
const sessionsRoutes = require("./sessions.routes")
const routes = Router();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated")

routes.use("/users", usersRoutes);
routes.use("/movies", ensureAuthenticated, moviesRoutes);
routes.use("/tags", ensureAuthenticated, tagsRoutes);
routes.use("/sessions", sessionsRoutes);

module.exports = routes;