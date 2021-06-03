import { Router } from "express";
import { SearchController } from "./controllers/SearchController";
import { UserController } from "./controllers/UserController";

const router = Router();

const userController = new UserController();
const searchController = new SearchController();

router.get("/users/list", userController.list);
router.post("/users/create", userController.create);
router.patch("/users/:id/update", userController.update);
router.delete("/users/:id/delete", userController.delete);

router.get("/search/list", searchController.list);
router.post("/search/create", searchController.create);
router.patch("/search/:id/update", searchController.update);
router.delete("/search/:id/delete", searchController.delete);

export { router };
