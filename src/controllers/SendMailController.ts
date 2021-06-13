import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SearchRepositories } from "../respositories/SearchRepositories";
import { UsersRepositories } from "../respositories/UsersRepositories";
import { UsersSearchsRepositories } from "../respositories/UsersSarchsRepositories";
import { SendMailService } from "../services/SendMailService";

class SendMailController {
  async list(request: Request, response: Response) {
    const usersSearchsRespositories = getCustomRepository(
      UsersSearchsRepositories
    );
    const usersSearchs = await usersSearchsRespositories.find();

    response.status(200).json(usersSearchs);
  }

  async create(request: Request, response: Response) {
    const sendMailService = new SendMailService();
    const { email, search_id } = request.body;

    const usersRepositories = getCustomRepository(UsersRepositories);
    const searchsRespositories = getCustomRepository(SearchRepositories);
    const usersSearchsRespositories = getCustomRepository(
      UsersSearchsRepositories
    );

    if (!email || !search_id) {
      return response.status(404).json({
        error: "email and search_id is required",
      });
    }

    const user = await usersRepositories.findOne({ email });
    if (!user) {
      return response.status(404).json({
        error: "User is not found",
      });
    }

    const search = await searchsRespositories.findOne({ id: search_id });
    if (!search) {
      return response.status(404).json({
        error: "Search is not found",
      });
    }

    const sendMailServiceResponse = await sendMailService.execute(
      user.email,
      search.title,
      search.description
    );

    if (!sendMailServiceResponse) {
      return response.status(400).json({
        error: "Error duration send mail",
      });
    }

    const usersSearchs = usersSearchsRespositories.create({
      user_id: user.id,
      search_id: search.id,
    });
    await usersSearchsRespositories.save(usersSearchs);

    return response.status(201).json(usersSearchs);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;
    const usersSearchsRespositories = getCustomRepository(
      UsersSearchsRepositories
    );

    if (!id) {
      return response.status(404).json({
        error: "id is required for remover user searchs",
      });
    }

    const usersSearchs = await usersSearchsRespositories.findOne({ id });
    if (!usersSearchs) {
      return response.status(404).json({
        error: "User Search is not found",
      });
    }

    await usersSearchsRespositories.delete({ id });

    return response.status(200).json({
      success: `User Search ${id} is removed`,
    });
  }
}

export { SendMailController };
