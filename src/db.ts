import * as mongoose from "mongoose";
const dotenv =require('dotenv')
dotenv.config()
import {MongoClient} from 'mongodb'



const mongoURI= process.env.MONGO_URI_CLUSTER||'mongodb://127.0.0.1:27017/hometask3' ;


export async function runDB(){
    console.log(mongoURI)
    try{
        await mongoose.connect(mongoURI)

        console.log('Connect successful')
    }
    catch (e) {
        console.log(e)
        console.log('DB connect crush')
        await mongoose.disconnect()

    }

}