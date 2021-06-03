import { EntityRepository, Repository } from "typeorm";
import { Search } from "../models/Search";

@EntityRepository(Search)
class SearchRepositories extends Repository<Search> {}

export { SearchRepositories };
