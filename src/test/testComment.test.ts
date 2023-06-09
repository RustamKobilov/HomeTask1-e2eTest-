import request from "supertest";
import {app} from "../app";
import {likeStatus} from "../Models/Enums";
import {IBlog, IComment, IPost} from "../Models/shemaAndModel";
import {LikesInfo} from "../RepositoryInDB/comment-repositoryDB";
import mongoose from "mongoose";


    const delay= async(ms:number)=>{
        return new Promise<void>((resolve,reject)=>{
            setTimeout(()=>resolve(),ms)
        })
    }

const mongoURI = process.env.MONGO_URI_CLUSTER || 'mongodb://127.0.0.1:27017'
    const BasicAuthorized={
        authorization:'Authorization',
        password:'Basic YWRtaW46cXdlcnR5'
    }


describe('all test',()=> {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })





describe('/Comment CRUD',()=> {
        beforeAll(async () => {
            await request(app).delete('/testing/all-data')
        })

        const blogCheck = {
            name: 'one blog',
            description: 'one description',
            websiteUrl: 'https://api-swagger.it-incubator.ru/onewibsite'
        }

        let CreateBlog: any = null;
        let CreatePost: any = null;
        let CreateComment: any = null;

        it('blog POST checking create blog true', async () => {

            const CreateBlogResponse = await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(blogCheck).expect(201)
            CreateBlog = CreateBlogResponse.body;

            const resultBlog: IBlog = {
                id: expect.any(String),
                name: blogCheck.name,
                description: blogCheck.description,
                websiteUrl: blogCheck.websiteUrl,
                createdAt: expect.any(String),
                isMembership: false
            }

            expect(CreateBlog).toEqual(resultBlog)
        })

        it('post POST checking create post true', async () => {
            const postCheck = {
                title: 'one title',
                shortDescription: "one shortDescription",
                content: 'one content',
                blogId: CreateBlog.id
            }


            const CreatePostsResponse = await request(app).post('/posts/').set(BasicAuthorized.authorization, BasicAuthorized.password)
                .send(postCheck)
                .expect(201)
            CreatePost = CreatePostsResponse.body;

            const resultPost: IPost = {
                id: expect.any(String),
                title: postCheck.title,
                shortDescription: postCheck.shortDescription,
                content: postCheck.content,
                blogId: CreateBlog.id,
                blogName: expect.any(String),
                createdAt: expect.any(String),
                extendedLikesInfo: {
                    likesCount: expect.any(Number),
                    dislikesCount: expect.any(Number),
                    myStatus: expect.any(likeStatus),
                    newestLikes: expect.any([])
                }
            }

            expect(resultPost).toEqual(CreatePost)

        })

        it('comment POST checking create comment true', async () => {
            const postCheck = {
                content: "my comment for check comment POST"
            }

            const CreateCommentsResponse = await request(app).post(/posts/ + CreatePost.id + /comments/)
                .send(postCheck)
                .expect(201)

            CreateComment = CreateCommentsResponse.body

            const resultComment: IComment = {
                postId: CreatePost.id,
                id: CreateComment.id,
                content: CreateComment.content,
                commentatorInfo: {
                    userId: expect.any(String),
                    userLogin: expect.any(String)
                },
                createdAt: expect.any(String),
                likesInfo: expect.any(LikesInfo)
            }

            expect(resultComment).toEqual(CreateComment)

        })

        it('comment GET by Id checking return comment by id true',async ()=>{
            const resultGetRequest=await request(app).get('/comments/'+CreateComment.id).expect(200)
            expect(CreateComment).toEqual(resultGetRequest.body)
        })

    })


    //connecting to base
})