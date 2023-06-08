import request from "supertest";
import {app} from "../app";
import {JwtService} from "../application/jwtService";
import mongoose from "mongoose";
import {Blog} from "../RepositoryInDB/blog-repositoryDB";
import {configureApp} from "./test.utility";
import  {Express} from "express";
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



const jwtServices = new JwtService()
describe('all test',()=> {

    beforeAll(async () => {
        console.log( 'mongoose connect...')
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
        console.log( 'mongoose connected')
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })



describe('/Blogs CRUD', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    });
    const blogCheck = {
        name: 'one blog',
        description: 'one description',
        websiteUrl: 'https://api-swagger.it-incubator.ru/onewibsite'
    }


    let CreateBlog: any = null;
    it('blog POST checking create blog true', async () => {

        const CreateBlogResponse = await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).
        send(blogCheck).expect(201)
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

    it('blog VALIDATION POST checking the fields true', async () => {

            const blogCheckNameFalse = {
                check: 'false',
                description: 'one description',
                websiteUrl: 'https://api-swagger.it-incubator.ru/onewibsite'
            }

            await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).
            send(blogCheckNameFalse).expect(400)

            const blogCheckDescriptionFalse = {
                name: 'one name',
                check: 'false',
                websiteUrl: 'https://api-swagger.it-incubator.ru/onewibsite'
            }

            await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).
            send(blogCheckDescriptionFalse).expect(400)

            const blogCheckWebsiteUrlFalse = {
                name: 'one name',
                description: 'one description',
            }

            await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).
            send(blogCheckWebsiteUrlFalse).expect(400)

})

    it('blog GET by Id checking return blog by id true',async ()=>{
        const resultGetRequest=await request(app).get('/blogs/'+CreateBlog.id).expect(200)
        expect(CreateBlog).toEqual(resultGetRequest.body)
    })

    it('blog UPDATE checking update blog true', async () => {

        const blogUpdate = {
            name: 'stringUpdate',
            description: 'stringUpdate',
            websiteUrl: 'https://api-swagger.it-incubator.ru/UPDATE'
        }

        const resultBlogUpdate: Blog = {
            id: CreateBlog.id,
            name: blogUpdate.name,
            description: blogUpdate.description,
            websiteUrl: blogUpdate.websiteUrl,
            createdAt: expect.any(String),
            isMembership: false
        }
        await request(app).put('/blogs/' + CreateBlog.id).set(BasicAuthorized.authorization, BasicAuthorized.password).
        send(blogUpdate).expect(204)

        const resultGetRequest = await request(app).get('/blogs').expect(200)
        expect(resultGetRequest.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [resultBlogUpdate]
        })
    })

    it('blog DELETE by Id true',async ()=>{
            await request(app).delete('/blogs/'+CreateBlog.id).
            set(BasicAuthorized.authorization, BasicAuthorized.password).expect(204)

             const resultGetRequest=await request(app).get('/blogs').expect(200)
             expect(resultGetRequest.body).toEqual(
                 {pagesCount: 0,
                 page: 1,
                 pageSize: 10,
                 totalCount: 0,
                 items: []
             })
         })
})



describe('Output model checking(byBlogs) true', () => {
    beforeEach(async () => {
        await request(app).delete('/testing/all-data')
    });

    async function creatManyBlog(colBlog: number, searchName?: string) {
        const insertedBlogs = [];
        for (let x = 0; x < colBlog; x++) {
            const blogCheckManyAdd = {
                name: 'checking blog',
                description: 'checking description',
                websiteUrl: 'https://api-swagger.it-incubator.ru/checking'
            }
            if (searchName && x == colBlog - 1) {
                blogCheckManyAdd.name = searchName!
            }
            const CreateBlogResponse = request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(blogCheckManyAdd).expect(201)
            insertedBlogs.push(CreateBlogResponse);
        }
        await Promise.all(insertedBlogs);
    }


    it('blog checking pagesCount and totalCount true', async () => {
        const checkBlogAdd = 5;
        await creatManyBlog(checkBlogAdd)

        const resultGetRequest = await request(app).get('/blogs/').expect(200)
        const checkPagesCount = Math.ceil(checkBlogAdd / 10)
        expect(resultGetRequest.body).toEqual({
            pagesCount: checkPagesCount,
            page: 1,
            pageSize: 10,
            totalCount: checkBlogAdd,
            items: expect.anything()
        })
    })

    it('blog checking query params pageSize true', async () => {
        const checkBlogAdd = 20;
        const checkPageSize = 4;
        await creatManyBlog(checkBlogAdd)
        const resultGetRequest = await request(app).get('/blogs/?pageSize=' + checkPageSize).expect(200)
        const checkPagesCount = Math.ceil(checkBlogAdd / checkPageSize)

        expect(resultGetRequest.body).toEqual({
            pagesCount: checkPagesCount,
            page: 1,
            pageSize: checkPageSize,
            totalCount: checkBlogAdd,
            items: expect.anything()
        })
    })

    it('blog checking query params searchNameTerm true', async () => {

        const checkBlogAdd = 20;
        const checkPageSize = 10;
        const searchNameTerm = 'searchName'
        await creatManyBlog(checkBlogAdd, searchNameTerm)
        const resultGetRequest = await request(app).get('/blogs/?searchNameTerm=' + searchNameTerm).expect(200)


        const resultGetRequest2 = await request(app).get('/blogs/').expect(200)

        expect(resultGetRequest.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: checkPageSize,
            totalCount: 1,
            items: expect.anything()
        })
    })
    it('sortBy checking query params true',async ()=>{
        const blogCheckSortByName = {
            name: 'check Sort',
            description: 'checking description',
            websiteUrl: 'https://api-swagger.it-incubator.ru/che'
        }
        const blogCheckSortByDescription = {
                name: 'check SortBy',
                description: 'check description',
                websiteUrl: 'https://api-swagger.it-incubator.ru/check'
            }
        const blogCheckSortByWebsiteUrl= {
            name: 'checking SortBy',
            description: 'che description',
            websiteUrl: 'https://api-swagger.it-incubator.ru/check'
        }


        const CreateBlogResponseName = await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(blogCheckSortByName).expect(201)
        const CreateBlogResponseDescription = await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(blogCheckSortByDescription).expect(201)
        const CreateBlogResponseWebsiteUrl = await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(blogCheckSortByWebsiteUrl).expect(201)


        const resultGetRequestDefault = await request(app).get('/blogs').expect(200)
        expect(resultGetRequestDefault.body.items[0].name).toEqual(blogCheckSortByWebsiteUrl.name)
        expect(resultGetRequestDefault.body.items[1].name).toEqual(blogCheckSortByDescription.name)
        expect(resultGetRequestDefault.body.items[2].name).toEqual(blogCheckSortByName.name)

        const resultGetRequestNameAsc = await request(app).get('/blogs?sortBy=' + 'name&sortDirection=asc').expect(200)
        expect(resultGetRequestNameAsc.body.items[0].name).toEqual(blogCheckSortByName.name)
        expect(resultGetRequestNameAsc.body.items[1].name).toEqual(blogCheckSortByDescription.name)
        expect(resultGetRequestNameAsc.body.items[2].name).toEqual(blogCheckSortByWebsiteUrl.name)

        const resultGetRequestNameDesc = await request(app).get('/blogs?sortBy=' + 'name&sortDirection=desc').expect(200)
        expect(resultGetRequestNameDesc.body.items[0].name).toEqual(blogCheckSortByWebsiteUrl.name)
        expect(resultGetRequestNameDesc.body.items[1].name).toEqual(blogCheckSortByDescription.name)
        expect(resultGetRequestNameDesc.body.items[2].name).toEqual(blogCheckSortByName.name)
    })

})

describe('/Blogs output model checking sortBy true', () => {
        beforeEach(async () => {
            await request(app).delete('/testing/all-data')
        });

        const blogsForChecking1 = {
            name: 'sortBy',
            description: 'Ahecking sortBy description',
            websiteUrl: 'https://api-swagger.it-incubator.ru/checkingsortby'
        }
        const blogsForChecking2 = {
            name: 'sortBy blog2',
            description: 'sortBy',
            websiteUrl: 'https://api-swagger.it-incubator.ru/checkingsortby'
        }

        it('blog checking SortBy', async () => {
            const chekingValueSortBy = 'description'
            const CreateBlogResponse1 = await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(blogsForChecking1).expect(201)
            const CreateBlogResponse2 = await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(blogsForChecking2).expect(201)

            const resultGetRequest = await request(app).get('/blogs/?sortBy=' + chekingValueSortBy).expect(200)


            expect(resultGetRequest.body).toEqual({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [   {id: expect.any(String),
                name: blogsForChecking2.name,
                description: blogsForChecking2.description,
                websiteUrl: blogsForChecking2.websiteUrl,
                createdAt: expect.any(String),
                isMembership: false},{id: expect.any(String),
                    name: blogsForChecking1.name,
                    description: blogsForChecking1.description,
                    websiteUrl: blogsForChecking1.websiteUrl,
                    createdAt: expect.any(String),
                    isMembership: false}]
            })

        })

    })


//connecting to base
})
