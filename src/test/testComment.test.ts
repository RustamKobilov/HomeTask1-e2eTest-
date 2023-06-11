import request from "supertest";
import {app} from "../app";
import mongoose from "mongoose";
import {Blog} from "../RepositoryInDB/blog-repositoryDB";
import {IPost} from "../Models/shemaAndModel";


const delay = async (ms: number) => {
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => resolve(), ms)
    })
}

const mongoURI = process.env.MONGO_URI_CLUSTER || 'mongodb://127.0.0.1:27017'
const BasicAuthorized = {
    authorization: 'Authorization',
    password: 'Basic YWRtaW46cXdlcnR5'
}


describe('all test', () => {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })


    describe('/Comment CRUD', () => {
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
        let accessToken: any = null;
        let refreshToken: any = null;
        let refreshTokenCookies: any = null;
        let userId: any = null;


        const userForChecking1 = {
            login: 'token1',
            password: '1234222223',
            email: 'tryToken1@ram.by'
        }
        const userAuthForChecking1 = {
            loginOrEmail: userForChecking1.login,
            password: userForChecking1.password
        }


        it('blog POST checking create blog true', async () => {

            const CreateBlogResponse = await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(blogCheck).expect(201)
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
                    //TODO myStatus no ENUM?
                    myStatus: expect.any(String),
                    newestLikes: expect.anything()
                }
            }

            expect(resultPost).toEqual(CreatePost)

        })

        it('give token(create admin) and auth with token true', async () => {

            const CreateUserResponse = await request(app).post('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(userForChecking1).expect(201)

            const AuthUserResponse = await request(app).post('/auth/login').send(userAuthForChecking1).expect(200)

            expect(AuthUserResponse.body.accessToken).toEqual(expect.any(String))

            ///refreshToken
            const cookies = AuthUserResponse.headers['set-cookie']
            console.log(cookies)
            refreshTokenCookies = cookies.filter(function (val: string) {
                return val.split('=')[0] == 'refreshToken'
            })
            console.log('refresh token cookies ' + refreshTokenCookies)
            refreshToken = refreshTokenCookies.map(function (val: string) {
                return val.split('=')[1]
            }).map(function (val: string) {
                return val.split(';')[0]
            })[0]

            expect(refreshToken).toEqual(expect.any(String))
            ///
            userId = CreateUserResponse.body.id
            accessToken = AuthUserResponse.body.accessToken
            ///

            const AuthMeUserResponse = await request(app).get('/auth/me').set({Authorization: 'bearer ' + accessToken}).expect(200)

            expect(AuthMeUserResponse.body).toEqual({
                login: userForChecking1.login,
                email: userForChecking1.email,
                userId: CreateUserResponse.body.id
            })
        })

        it('comment POST checking create comment true', async () => {
            const commentCheck = {
                content: "my comment for check comment POST"
            }
            console.log(CreatePost.id)
            const CreateCommentsResponse = await request(app).post(/posts/ + CreatePost.id + /comments/)
                .send(commentCheck).set({Authorization: 'bearer ' + accessToken}).expect(201)

            CreateComment = CreateCommentsResponse.body

            const resultComment = {
                id: CreateComment.id,
                content: CreateComment.content,
                commentatorInfo: {
                    userId: expect.any(String),
                    userLogin: expect.any(String)
                },
                createdAt: expect.any(String),
                likesInfo: {
                    dislikesCount: expect.any(Number),
                    likesCount: expect.any(Number),
                    myStatus: expect.any(String),
                }
            }

            expect(resultComment).toEqual(CreateComment)

        })

        it('comment GET by Id checking return comment by id true', async () => {
            const resultGetRequest = await request(app).get('/comments/' + CreateComment.id).expect(200)
            expect(CreateComment).toEqual(resultGetRequest.body)
        })

        it('comment UPDATE checking update comment true',async ()=>{
            const commentCheck2= {
                content: "my comment for check comment UPDATE"
            }


            const resultCommentUpdate = {
                id: CreateComment.id,
                content: commentCheck2.content,
                commentatorInfo: {
                    userId: expect.any(String),
                    userLogin: expect.any(String)
                },
                createdAt: expect.any(String),
                likesInfo: {
                    dislikesCount: expect.any(Number),
                    likesCount: expect.any(Number),
                    myStatus: expect.any(String),
                }
            }

            await request(app).put('/comments/'+ CreateComment.id)
                .send(commentCheck2).set({Authorization: 'bearer ' + accessToken}).expect(204)

            const resultGetRequest = await request(app).get('/comments/'+CreateComment.id).expect(200)

            console.log(resultGetRequest.body)
            expect(resultGetRequest.body).toEqual(resultCommentUpdate)
        })

        it('comment DELETE by Id true',async ()=>{
            await request(app).delete('/comments/'+CreateComment.id)
                .set({Authorization: 'bearer ' + accessToken}).expect(204)

            const resultGetRequest=await request(app).get('/posts/'+CreatePost.id+'/comments/').expect(200)

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