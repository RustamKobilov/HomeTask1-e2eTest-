import * as mongoose from "mongoose";
const dotenv =require('dotenv')
dotenv.config()
import {MongoClient} from 'mongodb'



const mongoURI= process.env.MONGO_URI_CLUSTER||'mongodb://127.0.0.1:27017' ;
const dbName='hometask3'

export const client = new MongoClient(mongoURI,{connectTimeoutMS:5000})
const db = client.db('hometask3')

export async function runDB(){
    console.log(mongoURI)
    try{
        await mongoose.connect(mongoURI+dbName)
        // await client.connect();
        // await db.command({ping:1})
        console.log('Connect successful')
    }
    catch (e) {
        console.log(e)
        console.log('DB connect crush')
        await mongoose.disconnect()
        // await client.close();
    }

}