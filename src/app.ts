import * as dotenv from 'dotenv'
dotenv.config()
import express, {Request, Response} from "express";
import {videosRouter} from "./routse/videos-router";
import {blogsRouter} from "./routse/blogs-router";
import {postsRouter} from "./routse/posts-router";
import {client} from "./db";
import {usersRouter} from "./routse/user-router";


export const app = express();


const convertJson = express.json();
app.use(convertJson);

app.use('/videos', videosRouter);
app.use('/blogs',blogsRouter);
app.use('/posts',postsRouter);
app.use('/users',usersRouter)


app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await client.db('hometask3').collection('Posts').deleteMany({})
    await client.db('hometask3').collection('Blogs').deleteMany({})
    return res.sendStatus(204);
});

