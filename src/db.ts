import * as dotenv from 'dotenv'
dotenv.config()
const {MongoClient} =require('mongodb');

const mongoURI=process.env.mongoURI ||'mongodb://127.0.0.1:27017';

export const client = new MongoClient(mongoURI)
export async function runDB(){
    try{
        await client.connect();
        await client.db('hometask3').command({ping:1})
    console.log('Connect successful')
    }
    catch (e) {
        console.log(e)
        console.log('DB connect crush')
        await client.close();
    }

}