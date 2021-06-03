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

  async update(request: Request, response: Response) {
    const params = request.params;
    const { title, description } = request.body;

    if (!params.id) {
      return response.status(404).json({
        error: "id is required for update search",
      });
    }

    const searchRespository = getCustomRepository(SearchRepositories);
    const search = await searchRespository.findOne({ id: params.id });

    if (!search) {
      return response.status(404).json({
        error: "search is not found",
      });
    }

    if (!title && !description) {
      return response.status(404).json({
        error: "title or description is required for update",
      });
    }

    if (title && description) {
      await searchRespository.update(params.id, { title, description });
      Object.assign(search, { title, description });
    }

    if (title) {
      await searchRespository.update(params.id, { title });
      Object.assign(search, { title });
    }

    if (description) {
      await searchRespository.update(params.id, { description });
      Object.assign(search, { description });
    }
    return response.status(200).json(search);
  }

  async delete(request: Request, response: Response) {
    const params = request.params;

    if (!params.id) {
      return response.status(404).json({
        error: "id is required for removed search",
      });
    }

    const searchRespository = getCustomRepository(SearchRepositories);
    const search = await searchRespository.findOne({ id: params.id });

    if (!search) {
      return response.status(404).json({
        error: "search is not find",
      });
    }

    await searchRespository.delete({ id: params.id });

    return response.status(200).json({
      success: `search ${search.title} id removed`,
    });
  }
}

export { SearchController };
