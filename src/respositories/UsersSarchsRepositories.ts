import { EntityRepository, Repository } from "typeorm";
import { UsersSearchs } from "../models/UsersSearchs";

@EntityRepository(UsersSearchs)
class UsersSearchsRepositories extends Repository<UsersSearchs> {}

export { UsersSearchsRepositories };
