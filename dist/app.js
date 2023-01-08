"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const videos_router_1 = require("./routse/videos-router");
const videos_router_2 = require("./routse/videos-router");
const blogs_router_1 = require("./routse/blogs-router");
const posts_router_1 = require("./routse/posts-router");
const posts_repositiry_1 = require("./Repository/posts-repositiry");
const blog_repository_1 = require("./Repository/blog-repository");
exports.app = (0, express_1.default)();
const convertJson = express_1.default.json();
exports.app.use(convertJson);
exports.app.use('/videos', videos_router_1.videosRouter);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.delete('/testing/all-data', (req, res) => {
    videos_router_2.db.splice(0, videos_router_2.db.length);
    posts_repositiry_1.dbPosts.splice(0, posts_repositiry_1.dbPosts.length);
    blog_repository_1.dbBlogs.splice(0, blog_repository_1.dbBlogs.length);
    return res.sendStatus(204);
});
