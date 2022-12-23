import express, {Request, Response} from "express";
import {videosRouter} from "./routse/videos-router";
import {db} from "./routse/videos-router";
export const app=express();

const convertJson=express.json();
app.use(convertJson);

app.use('/videos',videosRouter);


app.delete('/testing/all-data',(req:Request,res:Response)=>{
db.splice(0,db.length);

res.status(204)
});

