import { Router } from "express";
import { SearchController } from "./controllers/SearchController";
import { UserController } from "./controllers/UserController";

const router = Router();

const userController = new UserController();
const searchController = new SearchController();

router.get("/users/list", userController.list);
router.post("/users/create", userController.create);
router.patch("/users/update/:id", userController.update);
router.delete("/users/delete/:id", userController.delete);

router.get("/search/list", searchController.list);
router.post("/search/create", searchController.create);

export { router };
