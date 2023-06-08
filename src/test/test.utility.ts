import cookieParser from "cookie-parser";
import useragent from "express-useragent";
import {videosRouter} from "../routse/videos-router";
import {blogsRouter} from "../routse/blogs-router";
import {postsRouter} from "../routse/posts-router";
import {usersRouter} from "../routse/users-router";
import {authRouter} from "../routse/auth-router";
import {commentsRouter} from "../routse/comments-router";
import {securityRouter} from "../routse/devices-route";
import express, {Express} from "express";


export const configureApp=(app:Express)=>{
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
    return app;
}