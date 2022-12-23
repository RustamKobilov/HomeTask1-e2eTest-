"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoModel = exports.Resolution = void 0;
const APIErrorResult = {
    messages: 'string',
    field: 'string'
};
var Resolution;
(function (Resolution) {
    Resolution["P144"] = "P144";
    Resolution["P240"] = "P240";
    Resolution["P360"] = "P360";
    Resolution["P480"] = "P480";
    Resolution["P720"] = "P720";
    Resolution["P1080"] = "P1080";
    Resolution["P1440"] = "P1440";
    Resolution["P2160"] = "P2160";
})(Resolution = exports.Resolution || (exports.Resolution = {}));
const CreateVideoInputModel = {
    title: 'string',
    //maxLength: 40
    author: 'string',
    //maxLength: 20
    availableResolutions: []
    //[...]
};
const UpdateVideoInputModel = {
    title: 'string',
    //maxLength: 40
    author: 'string',
    //maxLength: 20
    availableResolutions: [],
    canBeDownloaded: false,
    //By default - false
    minAgeRestriction: 0,
    //integer($int32),maximum: 18,minimum:1
    publicationDate: "publicationDate"
};
exports.VideoModel = {
    id: 0,
    title: 'string',
    //maxLength: 40
    author: 'string',
    //maxLength: 20
    canBeDownloaded: false,
    //By default - false
    minAgeRestriction: 0,
    //integer($int32),maximum: 18,minimum:1
    createdAT: 'createdAT',
    publicationDate: "publicationDate",
    availableResolutions: [],
};
// class Video {
//     id:	number;
//     title:string;
//     author:	string;
//     availableResolutions = ['P144'];
//     canBeDownloaded: boolean;
//     minAgeRestriction:	number;
//     createdAt:	string;
//     publicationDate:string;
//     //By default - +1 day from CreatedAt
//
// constructor(id:number,title:string,author:string,availableResolutions:[] ,canBeDownloaded:boolean,minAgeRestriction:number,
//             createdAt:string,publicationDate:string) {
// this.id=id;
// this.title=title;
// this.author=author;
// this.availableResolutions=availableResolutions;
// this.canBeDownloaded=canBeDownloaded;
// this.minAgeRestriction=minAgeRestriction;
// this.createdAt=createdAt;
// this.publicationDate=publicationDate;
// }
// }
