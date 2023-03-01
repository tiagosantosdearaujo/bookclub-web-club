import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import UserController from "../controllers/user";
import CategoryController from "../controllers/category";
import AuthorController from "../controllers/author";

const routes = new Router();

// ------ unauthenticated routes------------------------
routes.post("/user", UserController.create);
routes.post("/loguin", UserController.loguin);
routes.post("/forgot-password", UserController.forgotPassword);
routes.post("/reset-password", UserController.resetPassword);

// ------ authenticated routes--------------------------
routes.use(authMiddleware);
routes.get("/user", UserController.get);
routes.get("/category", CategoryController.getAll);
routes.post("/author", AuthorController.create);
routes.post("/author", AuthorController.getAll);
routes.post("/author", AuthorController.get);
export default routes;
