import request from "supertest";
import {app} from "../app";
import {BlogsType} from "../RepositoryInDB/blog-repositoryDB";
import {PostType} from "../RepositoryInDB/posts-repositiryDB";
import {UserType} from "../RepositoryInDB/user-repositoryDB";
import any = jasmine.any;
import {header} from "express-validator";


const BasicAuthorized={
    authorization:'Authorization',
    password:'Basic YWRtaW46cXdlcnR5'
}

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

        const resultBlog: BlogsType = {
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

        const resultBlogUpdate: BlogsType = {
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

        const resultBlog: BlogsType = {
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

        const resultPost:PostType={
            id:expect.any(String),
            title:postCheck.title,
            shortDescription:postCheck.shortDescription,
            content:postCheck.content,
            blogId:CreateBlog.id,
            blogName:expect.any(String),
            createdAt:expect.any(String)
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

        const resultPostUpdate:PostType={
            id:CreatePost.id,
            title:postCheck2.title,
            shortDescription:postCheck2.shortDescription,
            content:postCheck2.content,
            blogId:postCheck2.blogId,
            blogName:expect.any(String),
            createdAt:expect.any(String)
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

describe('Output model checking(byBlogs) true', () => {
    beforeEach(async () => {
        await request(app).delete('/testing/all-data')
    });

    async function creatManyBlog(colBlog: number, searchName?: string) {
        for (let x = 0; x < colBlog; x++) {
            const blogCheckManyAdd = {
                name: 'checking blog',
                description: 'checking description',
                websiteUrl: 'https://api-swagger.it-incubator.ru/checking'
            }
            if (searchName && x == colBlog - 1) {
                blogCheckManyAdd.name = searchName!
            }
            const CreateBlogResponse = await request(app).post('/blogs/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(blogCheckManyAdd).expect(201)
        }
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
        const checkPagesCount = Math.ceil(checkBlogAdd / checkPageSize)

        console.log(resultGetRequest.body)
        const resultGetRequest2 = await request(app).get('/blogs/').expect(200)
        console.log(resultGetRequest2.body)
        expect(resultGetRequest.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: checkPageSize,
            totalCount: 1,
            items: expect.anything()
        })
    })

})

//не работает тест sortBy и sort direction
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

            console.log(resultGetRequest.body)
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

describe('user add',()=> {
    jest.setTimeout(2 * 60* 1000)
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })


    const userForChecking = {
        login: 'taft2',
        password: '1234223',
        email: 'tryUser@ram.by'
    }

    let CreateUser: any = null;

    it('user POST ADMIN checking create user true', async () => {


        const CreateUserResponse = await request(app).post('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(userForChecking).expect(201)
        CreateUser = CreateUserResponse.body;
        CreateUser.userConfirmationInfo = {
            userConformation: true,
            code: expect.any(String),
            expirationCode: expect.any(String)
        }
        CreateUser.hash = expect.any(String)
        CreateUser.password = expect.any(String)
        CreateUser.salt = expect.any(String)

        const resultBlog: UserType = {
            id: expect.any(String),
            login: userForChecking.login,
            password: userForChecking.password,
            email: userForChecking.email,
            salt: expect.any(String),
            hash: expect.any(String),
            createdAt: expect.any(String),
            userConfirmationInfo: {
                userConformation: true,
                code: expect.any(String),
                expirationCode: expect.any(String)
            }
        }

        expect(CreateUser).toEqual(resultBlog)
    })

    it('users get all,add one true', async () => {
        const resultGetRequest = await request(app).get('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).expect(200)

        expect(resultGetRequest.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [{
                id: CreateUser.id,
                login: CreateUser.login,
                email: CreateUser.email,
                createdAt: CreateUser.createdAt,
                userConfirmationInfo: CreateUser.userConfirmationInfo
            }]
        })
    })

    it('users DELETE by Id', async () => {
        await request(app).delete('/users/' + CreateUser.id).set(BasicAuthorized.authorization, BasicAuthorized.password).expect(204)

        const resultGetRequest = await request(app).get('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).expect(200)

        expect(resultGetRequest.body).toEqual({
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        })

    })


    it('users add two true', async () => {

    await request(app).delete('/testing/all-data')


        const userForChecking1 = {
            login: 'taft1',
            password: '1234223',
            email: 'tryUser1@ram.by'
        }
        const userForChecking2 = {
            login: 'taft2',
            password: '1234223',
            email: 'tryUser2@ram.by'
        }

        const CreateUserResponse = await request(app).post('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(userForChecking1).expect(201)
        const CreateUserResponse2 = await request(app).post('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(userForChecking2).expect(201)

        const resultGetRequest = await request(app).get('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).expect(200)

        expect(resultGetRequest.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items:expect.anything()
        })
    })

})

describe('auth/registration test', ()=> {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('regestration validation login false',async ()=>{

        const userForCheckingValidation = {
            login: 'userValidation1',
            password: '123422223',
            email: 'tryValidation1@ram.by'
        }

        userForCheckingValidation.login='gf'
        const AuthUserResponseFalseLoginMin = await request(app).post('/auth/registration').send(userForCheckingValidation).expect(400)
        userForCheckingValidation.login='ddfwerrfddee'
        const AuthUserResponseFalseLoginMax = await request(app).post('/auth/registration').send(userForCheckingValidation).expect(400)
        let userForCheckingValidationFalseType={
            login: 1,
            password: '123422223',
            email: 'tryValidation1@ram.by'
        }
        const AuthUserResponseFalseType = await request(app).post('/auth/registration').send(userForCheckingValidationFalseType).expect(400)
        const { password, ...userForCheckingValidationEmptyLogin}=userForCheckingValidationFalseType
        const AuthUserResponseEmptyLogin = await request(app).post('/auth/registration').send(userForCheckingValidationEmptyLogin).expect(400)

    })

    it('regestration validation password false',async ()=>{

        const userForCheckingValidation = {
            login: 'userValidation1',
            password: '56653',
            email: 'tryValidation1@ram.by'
        }


        const AuthUserResponseFalsePasswordMin= await request(app).post('/auth/registration').send(userForCheckingValidation).expect(400)
        userForCheckingValidation.password='55636363456463346454'
        const AuthUserResponseFalsePasswordMax = await request(app).post('/auth/registration').send(userForCheckingValidation).expect(400)
        let userForCheckingValidationFalseType={
            login: 'fgrrghrh',
            password: 1,
            email: 'tryValidation1@ram.by'
        }
        const AuthUserResponseFalseType = await request(app).post('/auth/registration').send(userForCheckingValidationFalseType).expect(400)
        const { password, ...userForCheckingValidationEmptyPassword}=userForCheckingValidationFalseType
        const AuthUserResponseEmptyLogin = await request(app).post('/auth/registration').send(userForCheckingValidationEmptyPassword).expect(400)

    })

    //why?pattern

    it('checking repeated body auth user false',async ()=> {

        const userForChecking1 = {
            login: 'user1',
            password: '123422223',
            email: 'tryUser1@ram.by'
        }
        const userForChecking1Copylogin = {
            login: 'user1',
            password: '12342222345',
            email: 'tryUserCopy1@ram.by'
        }
        const userForChecking2CopyEmail = {
            login: 'userCopy2',
            password: '123444444',
            email: 'tryUser1@ram.by'
        }

        const AuthUserResponse = await request(app).post('/auth/registration').send(userForChecking1).expect(204)

        const AuthUserResponseFalseLogin = await request(app).post('/auth/registration').send(userForChecking1Copylogin).expect(400)

        const AuthUserResponseFalseEmail = await request(app).post('/auth/registration').send(userForChecking2CopyEmail).expect(400)

    })




})

describe('token realize', ()=>{

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    const userForChecking1 = {
        login: 'token1',
        password: '1234222223',
        email: 'tryToken1@ram.by'
    }
    const userAuthForChecking1={
        loginOrEmail:userForChecking1.login,
        password:userForChecking1.password
    }



    it('give token(create admin) and auth with token true',async ()=>{

        const CreateUserResponse = await request(app).post('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(userForChecking1).expect(201)

        const AuthUserResponse = await request(app).post('/auth/login').send(userAuthForChecking1).expect(200)

        expect(AuthUserResponse.body.accessToken).toEqual(expect.any(String))

        const AuthUserMeResponse=await request(app).get('/auth/me').set({Authorization:'bearer '+AuthUserResponse.body.accessToken}).
        expect(200)

        expect(AuthUserMeResponse.body).toEqual({
            login:userForChecking1.login,
            email:userForChecking1.email,
            userId:CreateUserResponse.body.id
        })
    })
})

describe('auth/registration-confirmation test', ()=> {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('regestration validation code false',async ()=> {

        const checkCode = {
            code:null
        }

        const AuthUserResponseFalseCodeType = await request(app).post('/auth/registration-confirmation').send(checkCode).expect(400)

        const {code,...checkEmptyCode}=checkCode
        const AuthUserResponseFalseEmptyCode = await request(app).post('/auth/registration-confirmation').send(checkCode).expect(400)


    })


})








// const createUsers = async (count: number) => {
//     const users = []
//     for(let i = 0; i < count; i++){
//         const userInputData = {
//             login: `login${i}`,
//             email: `email${i}@gmail.com`,
//             password: `password${i}`,
//         }
//         const response = await request(app).post('/users').auth('admin', 'qwerty').send(userInputData)
//         users.push({...userInputData, ...response.body})
//     }
//     return users
// }\const users = await createUsers(10)
//         console.log(users)