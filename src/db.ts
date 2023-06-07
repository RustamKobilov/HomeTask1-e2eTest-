const dotenv =require('dotenv')
dotenv.config()
import {MongoClient} from 'mongodb'
import {BlogsType} from "./RepositoryInDB/blog-repositoryDB";
import {PostType} from "./RepositoryInDB/posts-repositiryDB";
import {UserType} from "./RepositoryInDB/user-repositoryDB";
import {CommentType} from "./RepositoryInDB/commentator-repositoryDB";

const mongoURI= process.env.MONGO_URI_CLUSTER||'mongodb://127.0.0.1:27017' ;

export const client = new MongoClient(mongoURI,{connectTimeoutMS:5000})
const db = client.db('hometask3')
export const blogsCollection = db.collection<BlogsType>('Blogs');
export const postsCollection =  db.collection<PostType>('Posts');
export const usersCollection = db.collection<UserType>('Users');
export const commentsCollection = db.collection<CommentType>('Comments');
export async function runDB(){
    console.log(mongoURI)
    try{
        await client.connect();
        await db.command({ping:1})
        console.log('Connect successful')
    }
    catch (e) {
        console.log(e)
        console.log('DB connect crush')
        await client.close();
    }

}