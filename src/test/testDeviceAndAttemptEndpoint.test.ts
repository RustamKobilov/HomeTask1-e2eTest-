import request from "supertest";
import {app} from "../app";
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

describe('Session and device for User /SecurityDevices', ()=> {
    jest.setTimeout(60000)
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    const userForChecking1 = {
        login: 'token1',
        password: '1234222223',
        email: 'tryToken1@ram.by'
    }
    const userAuthForChecking1 = {
        loginOrEmail: userForChecking1.login,
        password: userForChecking1.password
    }

    let accessToken: any = null;
    let refreshToken: any = null;
    let refreshTokenCookies: any = null;
    let userId: any = null;
    let deviceId: any = null;
    let deviceId2: any = null;
    let deviceId3: any = null;
    let lastActiveDate: any = null;
    let lastActiveDate2: any = null;
    let lastActiveDate3: any = null;
    let deviceName = 'TestDevice1'
    let deviceName2 = 'TestDevice2'
    let deviceName3 = 'TestDevice3'

    it('add device,during auth/login true', async () => {
        const CreateUserResponse = await request(app).post('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(userForChecking1).expect(201)

        const AuthUserResponse = await request(app).post('/auth/login').set('User-Agent', deviceName).send(userAuthForChecking1).expect(200)

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

        const securityDeviceResponse = await request(app).get('/security/devices')
            .set('Cookie', [refreshTokenCookies])
            .expect(200)

        lastActiveDate = await jwtServices.getLastActiveDateFromRefreshToken(refreshToken)
        const verifyToken = await jwtServices.verifyToken(refreshToken)
        deviceId = verifyToken.deviceId

        console.log(securityDeviceResponse.body)

        expect(securityDeviceResponse.body).toEqual([{
            ip: expect.any(String),
            title: deviceName,
            lastActiveDate: lastActiveDate,
            deviceId: deviceId
        }])
    })
    it('add many devices for one user', async () => {
        const AddDevice2Response = await request(app).post('/auth/login').set('User-Agent', deviceName2).send(userAuthForChecking1).expect(200)
        const AddDevice3Response = await request(app).post('/auth/login').set('User-Agent', deviceName3).send(userAuthForChecking1).expect(200)

        //refresh2
        const cookies2 = AddDevice2Response.headers['set-cookie']
        const refreshTokenCookies2 = cookies2.filter(function (val: string) {
            return val.split('=')[0] == 'refreshToken'
        })
        const refreshToken2 = refreshTokenCookies2.map(function (val: string) {
            return val.split('=')[1]
        }).map(function (val: string) {
            return val.split(';')[0]
        })[0]
        expect(refreshToken2).toEqual(expect.any(String))
        //

        //refresh3
        const cookies3 = AddDevice3Response.headers['set-cookie']
        const refreshTokenCookies3 = cookies3.filter(function (val: string) {
            return val.split('=')[0] == 'refreshToken'
        })
        const refreshToken3 = refreshTokenCookies3.map(function (val: string) {
            return val.split('=')[1]
        }).map(function (val: string) {
            return val.split(';')[0]
        })[0]
        expect(refreshToken).toEqual(expect.any(String))
        //

        //lastActiveDate and deviceId2
        lastActiveDate2 = await jwtServices.getLastActiveDateFromRefreshToken(refreshToken2)
        const verifyToken2 = await jwtServices.verifyToken(refreshToken2)
        deviceId2 = verifyToken2.deviceId
        //

        //lastActiveDate and deviceId3
        lastActiveDate3 = await jwtServices.getLastActiveDateFromRefreshToken(refreshToken3)
        const verifyToken3 = await jwtServices.verifyToken(refreshToken3)
        deviceId3 = verifyToken3.deviceId
        //

        const securityDeviceResponse = await request(app).get('/security/devices')
            .set('Cookie', [refreshTokenCookies3])
            .expect(200)

        console.log(securityDeviceResponse.body)

        expect(securityDeviceResponse.body).toEqual([{
            ip: expect.any(String),
            title: deviceName,
            lastActiveDate: lastActiveDate,
            deviceId: deviceId
        },
            {
                ip: expect.any(String),
                title: deviceName2,
                lastActiveDate: lastActiveDate2,
                deviceId: deviceId2
            },
            {
                ip: expect.any(String),
                title: deviceName3,
                lastActiveDate: lastActiveDate3,
                deviceId: deviceId3
            }

        ])

    })
    it('input device,before created. refresh device', async () => {
        const OldDeviceInputResponse = await request(app).post('/auth/login').set('User-Agent', deviceName3).send(userAuthForChecking1).expect(200)

        accessToken = OldDeviceInputResponse.body.accessToken
        refreshTokenCookies = OldDeviceInputResponse.headers['set-cookie']
        refreshToken = refreshTokenCookies.filter(function (val: string) {
            return val.split('=')[0] == 'refreshToken'
        })//refreshTokenUpdate

        const securityDeviceResponse = await request(app).get('/security/devices')
            .set('Cookie', [refreshTokenCookies])
            .expect(200)

        const deviceRefreshName3 = securityDeviceResponse.body.filter(function (val: any) {
            return val.title == deviceName3
        })
        console.log(securityDeviceResponse.body)
        expect(securityDeviceResponse.body.length).toEqual(3)
        expect(securityDeviceResponse.body[0]).toEqual({
            ip: expect.any(String),
            title: deviceName,
            lastActiveDate: lastActiveDate,
            deviceId: deviceId
        })
        expect(securityDeviceResponse.body[1]).toEqual({
            ip: expect.any(String),
            title: deviceName2,
            lastActiveDate: lastActiveDate2,
            deviceId: deviceId2
        })
        expect(deviceRefreshName3.deviceId).not.toEqual(deviceId3)
        expect(deviceRefreshName3.lastActiveDate).not.toEqual(lastActiveDate3)

    })

    it('check update refreshToken,expire deviceId', async () => {
        await delay(10000)
        const NewDeviceInputResponse = await request(app).post('/auth/login')
            .set('User-Agent', deviceName3)
            .send(userAuthForChecking1).expect(200)

        const newAccessToken = NewDeviceInputResponse.body.accessToken
        const newRefreshTokenCookies = NewDeviceInputResponse.headers['set-cookie']
        const newRefreshToken = newRefreshTokenCookies.filter(function (val: string) {
            return val.split('=')[0] == 'refreshToken'
        })//refreshTokenUpdate
        const AuthUserRefreshTokensResponse = await request(app).post('/auth/refresh-token')
            .set({Authorization: 'bearer ' + newAccessToken})
            .set('Cookie', [refreshTokenCookies]).expect(401)

    })
})
describe('limit request for one Ip',  ()=> {

    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })

    const userForChecking1 = {
        login: 'token1',
        password: '1234222223',
        email: 'tryToken1@ram.by'
    }
    const userAuthForChecking1 = {
        loginOrEmail: userForChecking1.login,
        password: userForChecking1.password
    }

    let deviceName = 'TestDevice1'
//TODO what attempt count 0?
    it('check limit request for one device',async ()=>{
        const CreateUserResponse = await request(app).post('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(userForChecking1).expect(201)
        for(let x=0;x<4;x++){
            const AuthUserResponse1 = await request(app).post('/auth/login').set('User-Agent',deviceName).send(userAuthForChecking1)
            const AuthUserResponseFalseLoginMin = await request(app).post('/auth/registration').send(userForChecking1)
        }
        const AuthUserResponse1 = await request(app).post('/auth/login').set('User-Agent',deviceName).send(userAuthForChecking1).expect(429)
        const AuthUserResponseFalseLoginMin = await request(app).post('/auth/registration').send(userForChecking1).expect(429)

    })
})

//connecting to base
})