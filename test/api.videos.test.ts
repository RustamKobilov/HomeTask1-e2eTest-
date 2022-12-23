import request from "supertest";
import {app} from "../src/app";

describe('/hometask_01/api/videos',()=>{

    it('shold 404',()=>{
request(app).delete('/').expect(400)
    })
})