import { Router } from "express";
import authMiddleware from "../middlewares/auth";
import UserController from "../controllers/user";

const routes = new Router();

// ------ unauthenticated routes------------------------
routes.post("/user", UserController.craete);
routes.post("/loguin", UserController.loguin);
routes.post("/forgot-password", UserController.forgotPassword);
routes.post("/reset-password", UserController.resetPassword);

// ------ authenticated routes--------------------------
routes.use(authMiddleware);
routes.get("/user", UserController.get);

export default routes;