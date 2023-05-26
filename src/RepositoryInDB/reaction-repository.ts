import {likeStatus} from "../Models/Enums";

export class Reaction{
    constructor( public parentId : string, public userId : string, public userLogin : string, public status : likeStatus, public createdAt : string){}

}