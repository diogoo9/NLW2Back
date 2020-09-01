import Routes from "express";
import ClassController from "./controllers/ClassesControlle";

const routes = Routes();
const classesController = new ClassController();

routes.post("/classes", classesController.create);

export default routes;
