import request from "supertest";
import {app} from "../app";
import {DeviceModel} from "../Models/shemaAndModel";
import {JwtService} from "../application/jwtService";
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


const jwtServices = new JwtService()


describe('all test',()=> {

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })



describe('auth/registration test',  ()=> {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('registration validation login false',async ()=>{

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

    it('registration validation password false',async ()=>{

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

describe('auth login token realize', ()=>{

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

    let accessToken:any=null;
    let refreshToken:any=null;
    let refreshTokenCookies:any=null;
    let userId:any=null;
    let deviceId:any=null;

    it('give token(create admin) and auth with token true',async ()=>{

        const CreateUserResponse = await request(app).post('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(userForChecking1).expect(201)

        const AuthUserResponse = await request(app).post('/auth/login').send(userAuthForChecking1).expect(200)

        expect(AuthUserResponse.body.accessToken).toEqual(expect.any(String))

        ///refreshToken
        const cookies = AuthUserResponse.headers['set-cookie']
        console.log(cookies)
        refreshTokenCookies=cookies.filter(function(val:string){return val.split('=')[0]=='refreshToken'})
        console.log('refresh token cookies ' + refreshTokenCookies)
        refreshToken= refreshTokenCookies.map(function (val:string){return val.split('=')[1]}).map(function(val:string){return val.split(';')[0]})[0]

        expect(refreshToken).toEqual(expect.any(String))
        ///
        userId=CreateUserResponse.body.id
        accessToken=AuthUserResponse.body.accessToken
        ///

        const AuthMeUserResponse=await request(app).get('/auth/me').set({Authorization:'bearer '+accessToken}).expect(200)

        expect(AuthMeUserResponse.body).toEqual({
            login:userForChecking1.login,
            email:userForChecking1.email,
            userId:CreateUserResponse.body.id
        })
    })
    it('refresh-token return 2 token(access,refresh),old token delete',async ()=>{

        const AuthUserRefreshTokensResponse=await request(app).post('/auth/refresh-token')
            .set({Authorization:'bearer '+accessToken})
            .set('Cookie', [refreshTokenCookies]).expect(200)
        expect(AuthUserRefreshTokensResponse.body.accessToken).not.toEqual(accessToken) //access token не старый
        expect(AuthUserRefreshTokensResponse.body.accessToken).toEqual(expect.any(String))

        const cookies = AuthUserRefreshTokensResponse.headers['set-cookie']
        const newRefreshTokenCookies=cookies.filter(function(val:string){return val.split('=')[0]=='refreshToken'})
        const newRefreshToken= newRefreshTokenCookies.map(function (val:string){return val.split('=')[1]}).map(function(val:string){return val.split(';')[0]})[0]

        expect(newRefreshToken).not.toEqual(refreshToken)//refresh token не старый
        expect(newRefreshToken).toEqual(expect.any(String))

        console.log('new refresh token ' + newRefreshToken)
        console.log('OldRefreshToken ' + refreshToken)


        const lastActiveDate=await jwtServices.getLastActiveDateFromRefreshToken(newRefreshToken)
        const verifyToken=await jwtServices.verifyToken(newRefreshToken)
        deviceId=verifyToken.deviceId
        const countUserToken=await DeviceModel.countDocuments({userId:userId,deviceId:deviceId})
        expect(countUserToken).toEqual(1)//check many token

        refreshToken=newRefreshToken
        accessToken=AuthUserRefreshTokensResponse.body.accessToken
        refreshTokenCookies=newRefreshTokenCookies
    })
    it('logout',async ()=>{
        const LogoutUserRefreshTokensBadResponse=await request(app).post('/auth/logout')
            .expect(401)
        const LogoutUserRefreshTokensResponse=await request(app).post('/auth/logout')
            .set('Cookie', [refreshTokenCookies]).expect(204)

        const countUserToken=await DeviceModel.countDocuments({id:userId,deviceId:deviceId})
        expect(countUserToken).toEqual(0)

    })
})

describe('auth/registration-confirmation test',  ()=> {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    it('registration validation code false',async ()=> {

        const checkCode = {
            code:null
        }

        const AuthUserResponseFalseCodeType = await request(app).post('/auth/registration-confirmation').send(checkCode).expect(400)

        const {code,...checkEmptyCode}=checkCode
        const AuthUserResponseFalseEmptyCode = await request(app).post('/auth/registration-confirmation').send(checkEmptyCode).expect(400)
        const checkFalseCode={code:'fakecode'}
        const AuthUserResponseFalseCode = await request(app).post('/auth/registration-confirmation').send(checkFalseCode).expect(400)

    })
})

    //connecting to base
})