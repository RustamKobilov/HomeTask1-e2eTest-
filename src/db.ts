const {MongoClient} =require('mongodb');
//process.env.mongoURI ||'mongodb://localhost:27017/baseOne';
const mongoURI='mongodb://127.0.0.1:27017';
//mongodb+srv://adminincubator:<password>@clusterapi.o5rglql.mongodb.net/?retryWrites=true&w=majority
export const client = new MongoClient(mongoURI)
export async function runDB(){
    try{
        await client.connect();
        //await client.db('baseOne').command({ping:1})
    console.log('Connect successful')
    }
    catch (e) {
        console.log(e)
        console.log('DB connect crush')
        await client.close();
    }

}