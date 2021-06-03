import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../respositories/UsersRepositories";

class UserController {
  async list(request: Request, response: Response) {
    const userRepository = getCustomRepository(UsersRepositories);

    const list = await userRepository.find();

    return response.status(200).json(list);
  }

  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const userRepository = getCustomRepository(UsersRepositories);

    const userAlreadyExists = await userRepository.findOne({
      email,
    });

    if (userAlreadyExists) {
      return response.status(400).json({
        error: "User already exists",
      });
    }

    const user = userRepository.create({
      name,
      email,
    });

    await userRepository.save(user);
    return response.status(201).json(user);
  }
}

export { UserController };
