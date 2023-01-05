
const APIErrorResult: { messages:string,field:string}={
    messages: 'string',
    field:'string'
}

export enum Resolution {
    P144 ='P144',
    P240='P240',
    P360='P360',
    P480='P480',
    P720='P720',
    P1080='P1080',
    P1440='P1440',
    P2160='P2160'
}

const CreateVideoInputModel:{title:string,author:string,availableResolutions:[]}={
    title:	'string',
    //maxLength: 40
    author:	'string',
    //maxLength: 20
    availableResolutions: []
    //[...]
}

const UpdateVideoInputModel:{title:string,author:string,availableResolutions:[],canBeDownloaded:boolean,
    minAgeRestriction: number,publicationDate:string}={
    title:'string',
    //maxLength: 40
    author:	'string',
    //maxLength: 20
    availableResolutions:	[],
    canBeDownloaded: false,
    //By default - false

    minAgeRestriction: 0,
//integer($int32),maximum: 18,minimum:1
    publicationDate	: "publicationDate"

}

export const VideoModel:{id:number,title:string,author:string,canBeDownloaded:boolean,
    minAgeRestriction: number,createdAT:string,publicationDate:string,availableResolutions:[]}={
    id:0,
    title:'string',
    //maxLength: 40
    author:	'string',
    //maxLength: 20
    canBeDownloaded: false,
    //By default - false

    minAgeRestriction: 0,
//integer($int32),maximum: 18,minimum:1
    createdAT: 'createdAT',
    publicationDate	: "publicationDate",
    availableResolutions:	[],
}


















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
