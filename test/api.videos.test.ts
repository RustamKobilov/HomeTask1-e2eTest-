import request from "supertest";
import {app} from "../src/app";

describe('/hometask_01/api/videos',()=>{

    it('should 404',()=>{
request(app).delete('/hometask_01/api/videos/7').expect(200)
    })
})