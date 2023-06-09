import request from "supertest";
import {app} from "../app";
import {RecoveryPasswordModel} from "../Models/shemaAndModel";
import {userRepository} from "../RepositoryInDB/user-repositoryDB";
import {randomUUID} from "crypto";
import {JwtService} from "../application/jwtService";
import mongoose from "mongoose";


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

const mongoURI = process.env.MONGO_URI_CLUSTER || 'mongodb://127.0.0.1:27017'

const BasicAuthorized={
    authorization:'Authorization',
    password:'Basic YWRtaW46cXdlcnR5'
}


const jwtServices = new JwtService()
describe('recovery password',()=> {


    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    const userForChecking1 = {
        login: 'token1',
        password: '1234222223',
        email: 'tryToken1@ram.by'
    }
    const emailRecoveryPassword={
        email:userForChecking1.email
    }
    let userIdForTrueRecoveryPassword:any=null
    const newPasswordBody={
        newPassword: '1123jiyg',
        recoveryCode: 'null'
    }

    it('validation email false and check email in base',async ()=> {
        const CreateUserResponse = await request(app).post('/users/').set(BasicAuthorized.authorization, BasicAuthorized.password).send(userForChecking1).expect(201)
        const RecoveryPasswordResponse= await request(app).post('/auth/password-recovery').send(emailRecoveryPassword).expect(204)
        const RecoveryBase=await RecoveryPasswordModel.find({}).lean()
        newPasswordBody.recoveryCode=RecoveryBase[0].recoveryCode
        userIdForTrueRecoveryPassword=RecoveryBase[0].userId
        console.log(RecoveryBase)
        console.log(userIdForTrueRecoveryPassword)
        emailRecoveryPassword.email='ffa55.by'
        const EmailIncorrectInputRecoveryPasswordResponse=await request(app).post('/auth/password-recovery').send(emailRecoveryPassword).expect(400)
        emailRecoveryPassword.email='255ghht@gmail.com'
        const RecoveryBaseLength= await RecoveryPasswordModel.findOne({}).count()
        const emailNoInBaseInput=await request(app).post('/auth/password-recovery').send(emailRecoveryPassword).expect(204)
        const RecoveryBaseLengthAfter= await RecoveryPasswordModel.findOne({}).count()
        console.log(RecoveryBaseLengthAfter)
        expect(RecoveryBaseLength).toEqual(RecoveryBaseLengthAfter)
    })
    it('password recovery true',async ()=>{
        const oldPasswordUserInBase= await userRepository.getPasswordByUserId(userIdForTrueRecoveryPassword)
        console.log(oldPasswordUserInBase)
        const updatePasswordResponse=await request(app).post('/auth/new-password').send(newPasswordBody).expect(204)
        const checkNewPasswordUserInBase=await userRepository.getPasswordByUserId(userIdForTrueRecoveryPassword)
        console.log(checkNewPasswordUserInBase)
        expect(oldPasswordUserInBase?.password).not.toEqual(checkNewPasswordUserInBase?.password)
    })
    it('password recovery false',async ()=>{
        //аналог fake recoveryCode в email любой uuid
        newPasswordBody.newPassword='fake'
        const updatePasswordInvalidPasswordResponse=await request(app).post('/auth/new-password').send(newPasswordBody).expect(400)
        console.log(updatePasswordInvalidPasswordResponse.body)
        newPasswordBody.newPassword='truepassword'
        newPasswordBody.recoveryCode=randomUUID()
        const updatePasswordResponseFalseCode=await request(app).post('/auth/new-password').send(newPasswordBody).expect(400)
        console.log(updatePasswordResponseFalseCode.body)

    })
})

//connecting to base
})