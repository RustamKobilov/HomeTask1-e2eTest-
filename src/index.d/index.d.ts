import {UserType} from "../RepositoryInDB/user-repositoryDB";

declare global{
    declare namespace Express{
        export interface Request{
            user:UserType|null
        }
    }
}