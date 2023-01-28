import * as dotenv from 'dotenv'
dotenv.config()
import express, {Request, Response} from "express";
import {videosRouter} from "./routse/videos-router";
import {db} from "./routse/videos-router";
import {blogsRouter} from "./routse/blogs-router";
import {postsRouter} from "./routse/posts-router";
import {dbPosts} from "./RepositoryInDB/posts-repositiryDB";
import {dbBlogs} from "./RepositoryInDB/blog-repositoryDB";
import {client} from "./db";
//import {dbPosts} from "./RepositoryInMemory/posts-repositiry";
//import {dbBlogs} from "./RepositoryInMemory/blog-repository";

export const app = express();


const convertJson = express.json();
app.use(convertJson);

app.use('/videos', videosRouter);
app.use('/blogs',blogsRouter);
app.use('/posts',postsRouter);


app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await client.db('hometask3').collection('Post').deleteMany({})
    await client.db('hometask3').collection('Blogs').deleteMany({})
    return res.sendStatus(204);
});

