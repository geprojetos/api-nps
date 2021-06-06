import { Router } from "express";
import { SearchController } from "./controllers/SearchController";
import { SendMailController } from "./controllers/SendMailController";
import { UserController } from "./controllers/UserController";

const router = Router();

const userController = new UserController();
const searchController = new SearchController();
const sendMailController = new SendMailController();

router.get("/users/list", userController.list);
router.post("/users/create", userController.create);
router.patch("/users/:id/update", userController.update);
router.delete("/users/:id/delete", userController.delete);

router.get("/search/list", searchController.list);
router.post("/search/create", searchController.create);
router.patch("/search/:id/update", searchController.update);
router.delete("/search/:id/delete", searchController.delete);

router.get("/users/searchs/list", sendMailController.list);
router.post("/users/searchs/create", sendMailController.create);
router.delete("/users/searchs/:id/delete", sendMailController.delete);

export { router };
