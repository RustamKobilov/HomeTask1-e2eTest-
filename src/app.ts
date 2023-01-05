import express, {Request, Response} from "express";
import {videosRouter} from "./routse/videos-router";
import {db} from "./routse/videos-router";
import {blogsRouter} from "./routse/blogs-router";

export const app = express();


const convertJson = express.json();
app.use(convertJson);

app.use('/videos', videosRouter);
app.use('/blogs',blogsRouter);


app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.splice(0, db.length);
    res.sendStatus(204)
});

