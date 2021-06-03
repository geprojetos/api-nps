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
      return response.status(404).json({
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

  async update(request: Request, response: Response) {
    const params = request.params;
    const { name, email } = request.body;
    const userRepository = getCustomRepository(UsersRepositories);

    if (!params.id) {
      return response.status(404).json({
        error: "id is required for update user",
      });
    }

    let user = await userRepository.findOne({
      id: params.id,
    });

    if (!user) {
      return response.status(404).json({
        error: "user is not found",
      });
    }

    if (!name && !email) {
      return response.status(404).json({
        error: "name or email is required for update user",
      });
    }

    if (name && email) {
      await userRepository.update(params.id, { name, email });
      Object.assign(user, { name, email });
    }

    if (name) {
      await userRepository.update(params.id, { name });
      Object.assign(user, { name });
    }

    if (email) {
      await userRepository.update(params.id, { email });
      Object.assign(user, { email });
    }

    return response.status(200).json(user);
  }

  async delete(request: Request, response: Response) {
    const params = request.params;
    const userRepository = getCustomRepository(UsersRepositories);

    if (!params.id) {
      return response.status(404).json({
        error: "id is required for removed user",
      });
    }

    const user = await userRepository.findOne({
      id: params.id,
    });

    if (!user) {
      return response.status(404).json({
        error: "User is not find",
      });
    }

    userRepository.delete({ id: params.id });

    return response.status(200).json({
      success: `User ${user.email} is removed`,
    });
  }
}

export { UserController };
