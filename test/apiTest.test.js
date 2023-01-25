"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
const blog_repositoryDB_1 = require("../src/RepositoryInDB/blog-repositoryDB");
describe('/blogs GET', () => {
    test('get all blogs', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).get('/blogs').expect(200).send(blog_repositoryDB_1.dbBlogs);
    }));
    test('get blogs on Id true', () => __awaiter(void 0, void 0, void 0, function* () {
        const blogCheck = {
            id: '1234',
            name: 'string1',
            description: 'string1',
            websiteUrl: 'string2',
            createdAt: 'string4'
        };
        yield (0, supertest_1.default)(app_1.app).get('/blogs/1234').expect(200).send(blogCheck);
    }));
    test('get blogs on Id false', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).get('/blogs/27').expect(404);
    }));
});
describe('/Blogs', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete('/testing/all-data');
    }));
    const blogCheck = {
        name: 'string1121224',
        description: 'string1214214',
        websiteUrl: 'https://api-swagger.it-incubator.ru/post'
    };
    let CreateBlog = null;
    it('blog POST on true', () => __awaiter(void 0, void 0, void 0, function* () {
        const CreateBlogResponse = yield (0, supertest_1.default)(app_1.app).post('/blogs/').set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(blogCheck).expect(201);
        CreateBlog = CreateBlogResponse.body;
        expect(CreateBlog).toEqual({
            id: expect.any(String),
            name: 'string1121224',
            description: 'string1214214',
            websiteUrl: 'https://api-swagger.it-incubator.ru/post',
            createdAt: expect.any(String)
        });
        yield (0, supertest_1.default)(app_1.app).get('/blogs').expect(200).send(CreateBlog);
        //console.log(dbBlogs)
    }));
    it('blog UPDATE on true', () => __awaiter(void 0, void 0, void 0, function* () {
        const blogUpdate = {
            name: 'stringUPdate',
            description: 'stringUpdate',
            websiteUrl: 'https://api-swagger.it-incubator.ru/UPDATE'
        };
        yield (0, supertest_1.default)(app_1.app).put('/blogs/' + CreateBlog.id).set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(blogUpdate).expect(204);
        yield (0, supertest_1.default)(app_1.app).get('/blogs').expect(200, [Object.assign({ id: CreateBlog.id }, blogUpdate)]);
    }));
});
describe('/Posts', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.app).delete('/testing/all-data');
    }));
    const blogCheck = {
        name: 'string1121224',
        description: 'string1214214',
        websiteUrl: 'https://api-swagger.it-incubator.ru/post'
    };
    let CreateBlog1 = null;
    let postCheck = null;
    it('blog POST on true', () => __awaiter(void 0, void 0, void 0, function* () {
        const CreateBlogResponse = yield (0, supertest_1.default)(app_1.app).post('/blogs/').set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(blogCheck).expect(201);
        CreateBlog1 = Object.assign({}, CreateBlogResponse.body);
        expect(CreateBlog1).toEqual({
            id: expect.any(String),
            name: 'string1121224',
            description: 'string1214214',
            websiteUrl: 'https://api-swagger.it-incubator.ru/post',
            createdAt: expect.any(String)
        });
        console.log({ CreateBlog1 });
        yield (0, supertest_1.default)(app_1.app).get('/blogs').expect(200).send(Object.assign({}, CreateBlog1));
        postCheck = {
            "title": 'Posttitle',
            "shortDescription": 'PostshortDescription',
            "content": 'Postcontent',
            "blogId": CreateBlog1.id,
        };
    }));
    console.log({ CreateBlog1 });
    let CreatePost = null;
    it('posts POST on true', () => __awaiter(void 0, void 0, void 0, function* () {
        const CreatePostResponse = yield (0, supertest_1.default)(app_1.app).post('/posts/').set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(postCheck).expect(201);
        CreatePost = CreatePostResponse.body;
        expect(CreatePost).toEqual(Object.assign(Object.assign({ id: expect.any(String) }, postCheck), { blogName: CreateBlog1.name, createdAt: expect.any(String) }));
        yield (0, supertest_1.default)(app_1.app).get('/posts').expect(200, [CreatePost]);
        //console.log(dbBlogs)
    }));
    const blogCheck2 = {
        name: 'string1121224',
        description: 'string1214214',
        websiteUrl: 'https://api-swagger.it-incubator.ru/post'
    };
    let CreateBlog2 = null;
    it('blog2 POST on true', () => __awaiter(void 0, void 0, void 0, function* () {
        const CreateBlog2Response = yield (0, supertest_1.default)(app_1.app).post('/blogs/').set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(blogCheck2).expect(201);
        CreateBlog2 = CreateBlog2Response.body;
        expect(CreateBlog2).toEqual(Object.assign(Object.assign({ id: expect.any(String) }, blogCheck2), { createdAt: expect.any(String) }));
        yield (0, supertest_1.default)(app_1.app).get('/blogs').expect(200).send([CreateBlog1, CreateBlog2]);
        //console.log(dbBlogs)
    }));
    it('posts UPDATE on true', () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log(CreateBlog1.id + 'jjjtjtj')
        //  console.log(dbBlogs)
        const PostUpdate = {
            "title": "string",
            "shortDescription": "string",
            "content": "string",
            "blogId": CreateBlog2.blogId
        };
        yield (0, supertest_1.default)(app_1.app).put('/posts/' + CreatePost.id).set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(PostUpdate).expect(204);
        yield (0, supertest_1.default)(app_1.app).get('/posts').expect(200, [Object.assign(Object.assign({ id: CreatePost.id }, PostUpdate), { blogName: CreateBlog2.name, createdAt: expect.any(String) })]);
    }));
});
