import request from "supertest";
import {app} from "../app";
import {User} from "../RepositoryInDB/user-repositoryDB";
import mongoose from "mongoose";
import {JwtService} from "../application/jwtService";


describe('all test',()=> {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })



const delay= async(ms:number)=>{
    return new Promise<void>((resolve,reject)=>{
        setTimeout(()=>resolve(),ms)
    })
}

const mongoURI = 'mongodb://127.0.0.1:27017' ;
//process.env.MONGO_URI_CLUSTER||
const BasicAuthorized={
    authorization:'Authorization',
    password:'Basic YWRtaW46cXdlcnR5'
}


const jwtServices = new JwtService()


describe('user add', ()=> {
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

        const resultBlog: User = {
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


//connecting to base
})
