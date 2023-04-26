import * as dotenv from 'dotenv'
dotenv.config()
import express, {NextFunction, Request, Response} from "express";
import {videosRouter} from "./routse/videos-router";
import {blogsRouter} from "./routse/blogs-router";
import {postsRouter} from "./routse/posts-router";
import {client, securityAttemptsEndpoints, sessionsTypeCollection} from "./db";
import {usersRouter} from "./routse/user-router";
import {authRouter} from "./routse/authRouter";
import {commentsRouter} from "./routse/commentsRouter";
import {securityRouter} from "./routse/securityDevices-route";
import cookieParser from "cookie-parser";
import useragent from "express-useragent"


export const app = express();



const convertJson = express.json();
const loggerMw = async (req: Request, res: Response, next: NextFunction) => {
    const loggerInfo = {
        url: req.url,
        method: req.method,
        devices: await sessionsTypeCollection.find().toArray(),
        refreshToken: req.cookies.refreshToken || 'without token',
        body: req.body
    }
    console.log(loggerInfo)
    return next()
}

app.set('trust proxy',true)
app.use(convertJson);
app.use(cookieParser())
app.use(useragent.express());
app.use(loggerMw)
app.use('/videos', videosRouter);
app.use('/blogs',blogsRouter);
app.use('/posts',postsRouter);
app.use('/users',usersRouter);
app.use('/auth',authRouter);
app.use('/comments',commentsRouter);
app.use('/security',securityRouter);

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await client.db('hometask3').collection('Posts').deleteMany({})
    await client.db('hometask3').collection('Blogs').deleteMany({})
    await client.db('hometask3').collection('Users').deleteMany({})
    await client.db('hometask3').collection('Comments').deleteMany({})
    await client.db('hometask3').collection('activeSessions').deleteMany({})
    await client.db('hometask3').collection('ipActiveEndpoint').deleteMany({})
    await client.db('hometask3').collection('SecurityAttemptsEndpoints').deleteMany({})

    return res.sendStatus(204);
});

