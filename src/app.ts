import * as dotenv from 'dotenv'
dotenv.config()
import express, {Request, Response} from "express";
import {videosRouter} from "./routse/videos-router";
import {blogsRouter} from "./routse/blogs-router";
import {postsRouter} from "./routse/posts-router";
import {usersRouter} from "./routse/users-router";
import {authRouter} from "./routse/auth-router";
import {commentsRouter} from "./routse/comments-router";
import {securityRouter} from "./routse/devices-route";
import cookieParser from "cookie-parser";
import useragent from "express-useragent"
import {
    AttemptModel,
    BlogModel,
    CommentModel,
    DeviceModel,
    PostModel, ReactionModel,
    RecoveryPasswordModel,
    UserModel
} from "./Models/shemaAndModel";


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
    await RecoveryPasswordModel.deleteMany({})
    await ReactionModel.deleteMany({})

    return res.sendStatus(204);
});

