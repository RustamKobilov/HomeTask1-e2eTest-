import * as dotenv from 'dotenv'
dotenv.config()
import express, {Request, Response} from "express";
import {videosRouter} from "./routse/videos-router";
import {blogsRouter} from "./routse/blogs-router";
import {postsRouter} from "./routse/posts-router";
import {usersRouter} from "./routse/user-router";
import {authRouter} from "./routse/authRouter";
import {commentsRouter} from "./routse/commentsRouter";
import {securityRouter} from "./routse/securityDevices-route";
import cookieParser from "cookie-parser";
import useragent from "express-useragent"
import {AttemptModel, BlogModel, CommentModel, DeviceModel, PostModel, UserModel} from "./Models/shemaAndModel";


export const app = express();


const convertJson = express.json();


app.set('trust proxy',true)
app.use(convertJson);
app.use(cookieParser())
app.use(useragent.express());
app.use('/videos', videosRouter);
app.use('/blogs',blogsRouter);
app.use('/posts',postsRouter);
app.use('/users',usersRouter);
app.use('/auth',authRouter);
app.use('/comments',commentsRouter);
app.use('/security',securityRouter);

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await PostModel.deleteMany({})
    await BlogModel.deleteMany({})
    await UserModel.deleteMany({})
    await CommentModel.deleteMany({})
    await DeviceModel.deleteMany({})
    await AttemptModel.deleteMany({})

    return res.sendStatus(204);
});

