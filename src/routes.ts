import Routes from "express";
import ClassController from "./controllers/ClassesControlle";
import ConnectionsController from "./controllers/ConnectionsController";

const routes = Routes();
const classesController = new ClassController();
const connectionsController = new ConnectionsController();


routes.get("/classes", classesController.index);
routes.post("/classes", classesController.create);

routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);

export default routes;
