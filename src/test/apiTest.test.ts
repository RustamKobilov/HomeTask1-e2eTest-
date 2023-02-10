// import request from "supertest";
// import {app} from "../app";
// import {BlogsType, dbBlogs} from "../RepositoryInDB/blog-repositoryDB";
//
// describe('/blogs GET', () => {
//
//     test('get all blogs', async () => {
//         await request(app).get('/blogs').expect(200).send(dbBlogs)
//     })
//
//
//     test('get blogs on Id true', async () => {
//         const blogCheck: BlogsType = {
//             id: '1234',
//             name: 'string1',
//             description: 'string1',
//             websiteUrl: 'string2',
//             createdAt: 'string4'
//         }
//         await request(app).get('/blogs/1234').expect(200).send(blogCheck)
//     })
//
//     test('get blogs on Id false', async () => {
//         await request(app).get('/blogs/27').expect(404)
//     })
// })
//
//
// describe('/Blogs', () => {
//     beforeAll(async () => {
//         await request(app).delete('/testing/all-data')
//     });
//     const blogCheck = {
//         name: 'string1121224',
//         description: 'string1214214',
//         websiteUrl: 'https://api-swagger.it-incubator.ru/post'
//     }
//
//     let CreateBlog: any = null;
//     it('blog POST on true', async () => {
//
//         const CreateBlogResponse = await request(app).post('/blogs/').set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(blogCheck).expect(201)
//         CreateBlog = CreateBlogResponse.body;
//
//         expect(CreateBlog).toEqual({
//             id: expect.any(String),
//             name: 'string1121224',
//             description: 'string1214214',
//             websiteUrl: 'https://api-swagger.it-incubator.ru/post',
//             createdAt: expect.any(String)
//
//         })
//
//         await request(app).get('/blogs').expect(200).send(CreateBlog)
//
//         //console.log(dbBlogs)
//     })
//
//
//     it('blog UPDATE on true', async () => {
//
//         const blogUpdate = {
//             name: 'stringUPdate',
//             description: 'stringUpdate',
//             websiteUrl: 'https://api-swagger.it-incubator.ru/UPDATE'
//         }
//
//         await request(app).put('/blogs/' + CreateBlog.id).set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(blogUpdate).expect(204)
//
//         await request(app).get('/blogs').expect(200, [{id: CreateBlog.id, ...blogUpdate}])
//
//     })
// })
//
// describe('/Posts', () => {
//     beforeAll(async () => {
//         await request(app).delete('/testing/all-data')
//     });
//
//     const blogCheck = {
//         name: 'string1121224',
//         description: 'string1214214',
//         websiteUrl: 'https://api-swagger.it-incubator.ru/post'
//     }
//     let CreateBlog1: any = null;
//     let postCheck: any = null;
//
//     it('blog POST on true', async () => {
//
//         const CreateBlogResponse = await request(app).post('/blogs/').set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(blogCheck).expect(201)
//         CreateBlog1 = {...CreateBlogResponse.body};
//
//         expect(CreateBlog1).toEqual({
//             id: expect.any(String),
//             name: 'string1121224',
//             description: 'string1214214',
//             websiteUrl: 'https://api-swagger.it-incubator.ru/post',
//             createdAt: expect.any(String)
//
//         })
// console.log({CreateBlog1})
//         await request(app).get('/blogs').expect(200).send({...CreateBlog1})
//         postCheck = {
//         "title": 'Posttitle',
//         "shortDescription": 'PostshortDescription',
//         "content": 'Postcontent',
//         "blogId": CreateBlog1.id,
//     }
//
//     })
//     console.log({CreateBlog1})
//
//     let CreatePost: any = null;
//     it('posts POST on true', async () => {
//
//         const CreatePostResponse = await request(app).post('/posts/').set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(postCheck).expect(201)
//         CreatePost = CreatePostResponse.body;
//
//         expect(CreatePost).toEqual({
//             id: expect.any(String), ...postCheck,
//             blogName: CreateBlog1.name,
//             createdAt: expect.any(String)
//
//         })
//
//         await request(app).get('/posts').expect(200, [CreatePost])
//
//         //console.log(dbBlogs)
//     })
//
//     const blogCheck2 = {
//         name: 'string1121224',
//         description: 'string1214214',
//         websiteUrl: 'https://api-swagger.it-incubator.ru/post'
//     }
//     let CreateBlog2: any = null;
//
//     it('blog2 POST on true', async () => {
//
//         const CreateBlog2Response = await request(app).post('/blogs/').set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(blogCheck2).expect(201)
//         CreateBlog2 = CreateBlog2Response.body;
//
//         expect(CreateBlog2).toEqual({
//             id: expect.any(String),
//             ...blogCheck2,
//             createdAt: expect.any(String)
//
//         })
//
//         await request(app).get('/blogs').expect(200).send([CreateBlog1, CreateBlog2])
//
//         //console.log(dbBlogs)
//     })
//
//     it('posts UPDATE on true', async () => {
// //console.log(CreateBlog1.id + 'jjjtjtj')
//         //  console.log(dbBlogs)
//         const PostUpdate = {
//             "title": "string",
//             "shortDescription": "string",
//             "content": "string",
//             "blogId": CreateBlog2.blogId
//         }
//
//         await request(app).put('/posts/' + CreatePost.id).set('Authorization', 'Basic YWRtaW46cXdlcnR5 ').send(PostUpdate).expect(204)
//
//         await request(app).get('/posts').expect(200, [{
//             id: CreatePost.id, ...PostUpdate,
//             blogName: CreateBlog2.name, createdAt: expect.any(String)
//         }])
//     })
// })
//
