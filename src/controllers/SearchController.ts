import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Search } from "../models/Search";
import { SearchRepositories } from "../respositories/SearchRepositories";

class SearchController {
  async list(request: Request, response: Response) {
    const searchRespository = getCustomRepository(SearchRepositories);

    const list = await searchRespository.find();

    return response.status(200).json(list);
  }

  async create(request: Request, response: Response) {
    const { title, description } = request.body;

    const searchRespository = getCustomRepository(SearchRepositories);

    if (!title && !description) {
      return response.status(400).json({
        error: "title and description is required",
      });
    }

    if (!title) {
      return response.status(400).json({
        error: "title is required",
      });
    }

    if (!description) {
      return response.status(400).json({
        error: "description is required",
      });
    }

    const searchAlreadyExists = await searchRespository.findOne({
      title,
      description,
    });

    if (searchAlreadyExists) {
      return response.status(400).json({
        error: "Search already exists",
      });
    }

    const search = searchRespository.create({ title, description });

    await searchRespository.save(search);

    return response.status(201).json(search);
  }
}

export { SearchController };
