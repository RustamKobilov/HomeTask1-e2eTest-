import express, {Request, Response} from "express";
import {videosRouter} from "./routse/videos-router";
import {db} from "./routse/videos-router";
import {blogsRouter} from "./routse/blogs-router";
import {postsRouter} from "./routse/posts-router";
import {dbPosts} from "./Repository/posts-repositiry";
import {dbBlogs} from "./Repository/blog-repository";

export const app = express();


const convertJson = express.json();
app.use(convertJson);

app.use('/videos', videosRouter);
app.use('/blogs',blogsRouter);
app.use('/posts',postsRouter);


app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.splice(0, db.length);
    dbPosts.splice(0, db.length);
    dbBlogs.splice(0, db.length);
    res.sendStatus(204)
});

