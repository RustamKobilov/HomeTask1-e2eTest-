import {Request, Response, Router} from "express";
import {app} from "../app";
import {throws} from "assert";
import {Resolution} from "../Model";
import { addDays } from 'date-fns'
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

videosRouter.put('/:id', (req: Request, res: Response) => {

    //title
    if (req.body.title === undefined || !req.body.title.trim() || req.body.title > 40 || req.body.title < 1 || typeof req.body.title !== 'string') {
        return res.status(400).send({
            messages: 'title errors', field: 'поле title не корректно'
        })
    }
    //author
    if (req.body.author === undefined || !req.body.author.trim() || req.body.author > 20 || req.body.author < 1 || typeof req.body.author !== 'string') {
        return res.status(400).send({
            messages: 'author errors', field: 'поле author не корректно'
        })
    }
    //availableResolutions
    if (req.body.availableResolutions === undefined || req.body.availableResolutions.constructor !== Array) {
        return res.status(400).send({
            messages: 'availableResolutions errors', field: 'поле availableResolutions не корректно'
        })
    }
    //canBeDownloaded
    if (req.body.canBeDownloaded === undefined || typeof req.body.canBeDownloaded !== 'boolean') {
        return res.status(400).send({
            messages: 'canBeDownloaded errors', field: 'поле canBeDownloaded не корректно'
        })
    }
    //minAgeRestriction
    if (req.body.minAgeRestriction === undefined || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1 || typeof req.body.minAgeRestriction !== "number") {
        return res.status(400).send({
            messages: 'minAgeRestriction errors', field: 'поле minAgeRestriction не корректно'
        })
    }

    const resultBodyAvailableResolutions = req.body.availableResolutions;
    let flagRunEnum = resultBodyAvailableResolutions.filter(function (p: any) {
        return Object.values(Resolution).includes(p)
    })
    if (resultBodyAvailableResolutions.length !== flagRunEnum.length) {
       return  res.status(400).send({
            messages: 'availableResolutions errors', field: 'поле availableResolutions не корректно'
        })
    }
    //publicationDate
    if (req.body.publicationDate === undefined || typeof req.body.publicationDate !== 'string') {
      return  res.status(400).send({
            messages: 'publicationDate errors', field: 'поле publicationDate не корректно'
        })
    }

    const idReq = +req.params.id;
    const titleReq = req.body.title;
    const authorReq = req.body.author;
    const availableResolutionsReq = req.body.availableResolutions;
    const canBeDowloadedReq = req.body.canBeDownloaded;
    const minAgeRestrictionReq = req.body.minAgeRestriction;
    const publicationDateReq = req.body.publicationDate;


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
    if (req.body.title === undefined || !req.body.title.trim() || req.body.title > 40 || req.body.title < 1 || typeof req.body.title !== 'string') {
        return res.status(400).send({
            messages: 'title errors', field: 'поле title не корректно'
        })
    }
    //author
    if (req.body.author === undefined || !req.body.author.trim() || req.body.author > 20 || req.body.author < 1 || typeof req.body.author !== 'string') {
        return res.status(400).send({
            messages: 'author errors', field: 'поле author не корректно'
        })
    }
    //availableResolutions
    if (req.body.availableResolutions === undefined || req.body.availableResolutions.constructor !== Array) {
        return  res.status(400).send({
            messages: 'availableResolutions errors', field: 'поле availableResolutions не корректно'
        })
    }

    // const publicationDate = new Date(+new Date() + 1000 * 60 * 60 * 24).toISOString()

    const dateNow = new Date()

    const newVideo = {
        "id": +dateNow,
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": dateNow.toISOString(),
        "publicationDate": addDays(dateNow, 1).toISOString(),
        "availableResolutions": req.body.availableResolutions
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
    //let flagVideosSerch=db.find(v => v.id === video.id);
    db = db.splice(db.find(v => v.id === video.id),1)
    console.log(db)
    return res.sendStatus(204)
})