import express, {Request, Response} from "express";
import {videosRouter} from "./routse/videos-router";
import {db} from "./routse/videos-router";
import {blogsRouter} from "./routse/blogs-router";
import {postsRouter} from "./routse/posts-router";
import {dbPosts} from "./RepositoryInDB/posts-repositiryDB";
import {dbBlogs} from "./RepositoryInDB/blog-repositoryDB";
//import {dbPosts} from "./RepositoryInMemory/posts-repositiry";
//import {dbBlogs} from "./RepositoryInMemory/blog-repository";

export const app = express();


const convertJson = express.json();
app.use(convertJson);

app.use('/videos', videosRouter);
app.use('/blogs',blogsRouter);
app.use('/posts',postsRouter);


app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.splice(0, db.length);
    dbPosts.splice(0, dbPosts.length);
    dbBlogs.splice(0, dbBlogs.length);
    return res.sendStatus(204);
});

