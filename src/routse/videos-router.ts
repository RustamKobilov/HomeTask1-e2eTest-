import {Request, Response, Router} from "express";
import { addDays } from 'date-fns';
export const videosRouter = Router({})

export let db: Array<any> = [{
    "id": 4,
    "title": "string",
    "author": "string",
    "canBeDownloaded": true,
    "minAgeRestriction": null,
    "createdAt": "2022-12-22T09:15:19.747Z",
    "publicationDate": "2022-12-22T09:15:19.747Z",
    "availableResolutions": [
        "P144"
    ]
}, {
    "id": 2,
    "title": "string2",
    "author": "string2",
    "canBeDownloaded": true,
    "minAgeRestriction": null,
    "createdAt": "2022-12-22T09:15:19.747Z",
    "publicationDate": "2022-12-22T09:15:19.747Z",
    "availableResolutions": [
        "P144"
    ]
}];

enum videoResolution{ P144=' P144',
P240='P240', P360='P360', P480='P480', P720='P720',
P1080='P1080', P1440='P1440', P2160=' P2160' }

const createVideoValidation = (title: string, author: string, availableResolutions: string[]) => {
    const errors = []
    console.log('title: ' + title)
    console.log('typeof title: ' + typeof title)
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40 || title.length < 1) {
        errors.push({
            message: 'title errors', field: 'title'
        })
    }
//author
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20 || author.length < 1) {
        errors.push({message: 'author errors', field: 'author'})
    }

//availableResolutions
    if (!availableResolutions || availableResolutions.constructor !== Array) {
        errors.push({message: 'availableResolutions errors', field: 'availableResolutions'})
    }

    let flagRunEnum = availableResolutions.filter(function (p: any) {
        return Object.values(videoResolution).includes(p)
    })
    if (availableResolutions.length !== flagRunEnum.length) {
        errors.push({
            message: 'availableResolutions errors', field: 'availableResolutions'
        })
    }
        return errors
}
const updateVideoValidation = (title: string, author: string, availableResolutions: string[], canBeDownloaded: boolean,
                               minAgeRestriction: number,publicationDate:string) => {
    //const errors = createVideoValidation(title, author, availableResolutions)
    const errors = [];

    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40 || title.length < 1) {
        errors.push({
            message: 'title errors', field: 'title'
        })
    }
//author
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20 || author.length < 1) {
        errors.push({message: 'author errors', field: 'author'})
    }
//availableResolutions
    if (!availableResolutions || availableResolutions.constructor !== Array) {
        errors.push({message: 'availableResolutions errors', field: 'availableResolutions'})
    }
    //canBeDownloaded
    if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean') {
        errors.push({message: 'canBeDownloaded errors', field: 'canBeDownloaded'})
    }
    //minAgeRestriction
    if (!minAgeRestriction || minAgeRestriction > 18 || minAgeRestriction < 1 || typeof minAgeRestriction !== 'number') {
        errors.push({message: 'minAgeRestriction errors', field: 'minAgeRestriction'})
    }
    //publicationDate
    if (!publicationDate || typeof publicationDate !== 'string') {
        errors.push({message: 'publicationDate errors', field: 'publicationDate'})
    }
    if (!availableResolutions || availableResolutions.constructor !== Array) {
        errors.push({message: 'availableResolutions errors', field: 'availableResolutions'})
    }

    let flagRunEnum = availableResolutions.filter(function (p: any) {
        return Object.values(videoResolution).includes(p)
    })
    if (availableResolutions.length !== flagRunEnum.length) {
        errors.push({
            message: 'availableResolutions errors', field: 'availableResolutions'
        })
    }
        return errors
}
videosRouter.put('/:id', (req: Request, res: Response) => {

    const idReq = +req.params.id;
    const titleReq = req.body.title;
    const authorReq = req.body.author;
    const availableResolutionsReq = req.body.availableResolutions;
    const canBeDowloadedReq = req.body.canBeDownloaded;
    const minAgeRestrictionReq = req.body.minAgeRestriction;
    const publicationDateReq = req.body.publicationDate;
    const errors=updateVideoValidation(titleReq,authorReq,availableResolutionsReq,canBeDowloadedReq,minAgeRestrictionReq,publicationDateReq)
    if(errors.length>0){return res.status(400).send({errorsMessages: errors})}

    const video = db.find(v => v.id === idReq)
    if (!video) {
        return res.sendStatus(404)
    }
    video.title = titleReq
    video.author = authorReq
    video.canBeDownloaded = canBeDowloadedReq
    video.minAgeRestriction = minAgeRestrictionReq
    video.publicationDate = publicationDateReq
    video.availableResolutions = availableResolutionsReq

    return res.sendStatus(204)
})
videosRouter.post('/', (req: Request, res: Response) => {
    //title
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const errors = createVideoValidation(title, author, availableResolutions)
    if (errors.length > 0) return res.status(400).send({errorsMessages: errors})
    // const publicationDate = new Date(+new Date() + 1000 * 60 * 60 * 24).toISOString()

    const dateNow = new Date()

    const newVideo = {
        "id": +dateNow,
        "title": title,
        "author": author,
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": dateNow.toISOString(),
        "publicationDate": addDays(dateNow, 1).toISOString(),
        "availableResolutions": availableResolutions
    };
    db.push(newVideo)
    return res.status(201).send(newVideo)
})

videosRouter.get('/', (req: Request, res: Response) => {

    return res.status(200).send(db)
})
videosRouter.get('/:id', (req: Request, res: Response) => {
    const idParams = +req.params.id;
    const videoSearchId = db.find(v=>v.id===idParams)
    if(!videoSearchId){
       return  res.sendStatus(404)
    }

    return res.status(200).send(videoSearchId)
})

videosRouter.delete('/:id', (req: Request, res: Response) => {

    const idReq = +req.params.id;

    const video = db.find(v => v.id === idReq)

    if (!video) {
        return res.sendStatus(404)
    }
    let flagVideosSerch=db.find(v => v.id === video.id);
    db.splice(db.indexOf(flagVideosSerch),1)
    return res.sendStatus(204)

})

