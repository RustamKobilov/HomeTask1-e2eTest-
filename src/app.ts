import express, {Request, Response} from "express";
import {videosRouter} from "./routse/videos-router";
import {db} from "./routse/videos-router";
export const app=express();

const convertJson=express.json();
app.use(convertJson);

app.use('/hometask_01/api/videos',videosRouter);


app.delete('/ht_01/api/testing/all-data',(req:Request,res:Response)=>{
db.splice(0,db.length);

res.status(204).send('All data is deleted')
});

