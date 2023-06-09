import request from "supertest";
import {app} from "../app";
import {Blog} from "../RepositoryInDB/blog-repositoryDB";
import {IPost} from "../Models/shemaAndModel";
import {likeStatus} from "../Models/Enums";
import mongoose from "mongoose";




const delay= async(ms:number)=>{
    return new Promise<void>((resolve,reject)=>{
        setTimeout(()=>resolve(),ms)
    })
}


const BasicAuthorized={
    authorization:'Authorization',
    password:'Basic YWRtaW46cXdlcnR5'
}

const mongoURI = process.env.MONGO_URI_CLUSTER || 'mongodb://127.0.0.1:27017'

describe('all test',()=> {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

describe('/Post CRUD',()=>{
    beforeAll(async ()=>{
        await request(app).delete('/testing/all-data')
    })

    const blogCheck = {
        name: 'one blog',
        description: 'one description',
        websiteUrl: 'https://api-swagger.it-incubator.ru/onewibsite'
    }

    let CreateBlog: any = null;
    let CreatePost:any=null;

    it('blog POST checking create blog true', async () => {

        const CreateBlogResponse = await request(app).post('/blogs/').
        set(BasicAuthorized.authorization, BasicAuthorized.password).send(blogCheck).expect(201)
        CreateBlog = CreateBlogResponse.body;

        const resultBlog: Blog = {
            id: expect.any(String),
            name: blogCheck.name,
            description: blogCheck.description,
            websiteUrl: blogCheck.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        }

        expect(CreateBlog).toEqual(resultBlog)
    })

    it('post POST checking create post true', async ()=>{
        const postCheck={
            title: 'one title',
            shortDescription: "one shortDescription",
            content: 'one content',
            blogId:CreateBlog.id
        }


        const CreatePostsResponse = await request(app).post('/posts/').
        set(BasicAuthorized.authorization, BasicAuthorized.password).send(postCheck).expect(201)
        CreatePost = CreatePostsResponse.body;

        const resultPost:IPost={
            id:expect.any(String),
            title:postCheck.title,
            shortDescription:postCheck.shortDescription,
            content:postCheck.content,
            blogId:CreateBlog.id,
            blogName:expect.any(String),
            createdAt:expect.any(String),
            extendedLikesInfo:{
                likesCount: expect.any(Number),
                dislikesCount: expect.any(Number),
                myStatus: expect.any(likeStatus),
                newestLikes:expect.any([])
            }
        }

        expect(resultPost).toEqual(CreatePost)

    })

    it('post GET by Id checking return post by id true',async ()=>{
        const resultGetRequest=await request(app).get('/posts/'+CreatePost.id).expect(200)
        expect(CreatePost).toEqual(resultGetRequest.body)
    })

    it('post UPDATE checking update post true',async ()=>{
        const postCheck2={
            title: 'update title',
            shortDescription: "update shortDescription",
            content: 'update content',
            blogId:CreateBlog.id
        }

        const resultPostUpdate:IPost={
            id:CreatePost.id,
            title:postCheck2.title,
            shortDescription:postCheck2.shortDescription,
            content:postCheck2.content,
            blogId:postCheck2.blogId,
            blogName:expect.any(String),
            createdAt:expect.any(String),
            extendedLikesInfo:{
                likesCount: expect.any(Number),
                dislikesCount: expect.any(Number),
                myStatus: expect.any(likeStatus),
                newestLikes:expect.any([])
            }
        }

        await request(app).put('/posts/'+CreatePost.id).
        set(BasicAuthorized.authorization, BasicAuthorized.password).
        send(postCheck2).expect(204)

        const resultGetRequest=await request(app).get('/posts/').expect(200)

        expect(resultGetRequest.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [resultPostUpdate]
        })
    })

    it('post DELETE by Id true',async ()=>{
        await request(app).delete('/posts/'+CreatePost.id).
        set(BasicAuthorized.authorization, BasicAuthorized.password).expect(204)

        const resultGetRequest=await request(app).get('/posts/').expect(200)

        expect(resultGetRequest.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        })

    })
})

    //connecting to base
})