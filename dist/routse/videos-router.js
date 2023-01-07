"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.videosRouter = void 0;
const express_1 = require("express");
const date_fns_1 = require("date-fns");
exports.videosRouter = (0, express_1.Router)({});
exports.db = [{
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
var videoResolution;
(function (videoResolution) {
    videoResolution["P144"] = " P144";
    videoResolution["P240"] = "P240";
    videoResolution["P360"] = "P360";
    videoResolution["P480"] = "P480";
    videoResolution["P720"] = "P720";
    videoResolution["P1080"] = "P1080";
    videoResolution["P1440"] = "P1440";
    videoResolution["P2160"] = " P2160";
})(videoResolution || (videoResolution = {}));
const createVideoValidation = (title, author, availableResolutions) => {
    const errors = [];
    console.log('title: ' + title);
    console.log('typeof title: ' + typeof title);
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40 || title.length < 1) {
        errors.push({
            message: 'title errors', field: 'title'
        });
    }
    //author
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20 || author.length < 1) {
        errors.push({ message: 'author errors', field: 'author' });
    }
    //availableResolutions
    if (!availableResolutions || availableResolutions.constructor !== Array) {
        errors.push({ message: 'availableResolutions errors', field: 'availableResolutions' });
    }
    let flagRunEnum = availableResolutions.filter(function (p) {
        return Object.values(videoResolution).includes(p);
    });
    if (availableResolutions.length !== flagRunEnum.length) {
        errors.push({
            message: 'availableResolutions errors', field: 'availableResolutions'
        });
    }
    return errors;
};
const updateVideoValidation = (title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate) => {
    //const errors = createVideoValidation(title, author, availableResolutions)
    const errors = [];
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40 || title.length < 1) {
        errors.push({
            message: 'title errors', field: 'title'
        });
    }
    //author
    if (!author || typeof author !== 'string' || !author.trim() || author.length > 20 || author.length < 1) {
        errors.push({ message: 'author errors', field: 'author' });
    }
    //availableResolutions
    if (!availableResolutions || availableResolutions.constructor !== Array) {
        errors.push({ message: 'availableResolutions errors', field: 'availableResolutions' });
    }
    //canBeDownloaded
    if (!canBeDownloaded || typeof canBeDownloaded !== 'boolean') {
        errors.push({ message: 'canBeDownloaded errors', field: 'canBeDownloaded' });
    }
    //minAgeRestriction
    if (!minAgeRestriction || minAgeRestriction > 18 || minAgeRestriction < 1 || typeof minAgeRestriction !== 'number') {
        errors.push({ message: 'minAgeRestriction errors', field: 'minAgeRestriction' });
    }
    //publicationDate
    if (!publicationDate || typeof publicationDate !== 'string') {
        errors.push({ message: 'publicationDate errors', field: 'publicationDate' });
    }
    if (!availableResolutions || availableResolutions.constructor !== Array) {
        errors.push({ message: 'availableResolutions errors', field: 'availableResolutions' });
    }
    let flagRunEnum = availableResolutions.filter(function (p) {
        return Object.values(videoResolution).includes(p);
    });
    if (availableResolutions.length !== flagRunEnum.length) {
        errors.push({
            message: 'availableResolutions errors', field: 'availableResolutions'
        });
    }
    return errors;
};
exports.videosRouter.put('/:id', (req, res) => {
    const idReq = +req.params.id;
    const titleReq = req.body.title;
    const authorReq = req.body.author;
    const availableResolutionsReq = req.body.availableResolutions;
    const canBeDowloadedReq = req.body.canBeDownloaded;
    const minAgeRestrictionReq = req.body.minAgeRestriction;
    const publicationDateReq = req.body.publicationDate;
    const errors = updateVideoValidation(titleReq, authorReq, availableResolutionsReq, canBeDowloadedReq, minAgeRestrictionReq, publicationDateReq);
    if (errors.length > 0) {
        return res.status(400).send({ errorsMessages: errors });
    }
    const video = exports.db.find(v => v.id === idReq);
    if (!video) {
        return res.sendStatus(404);
    }
    video.title = titleReq;
    video.author = authorReq;
    video.canBeDownloaded = canBeDowloadedReq;
    video.minAgeRestriction = minAgeRestrictionReq;
    video.publicationDate = publicationDateReq;
    video.availableResolutions = availableResolutionsReq;
    return res.sendStatus(204);
});
exports.videosRouter.post('/', (req, res) => {
    //title
    const title = req.body.title;
    const author = req.body.author;
    const availableResolutions = req.body.availableResolutions;
    const errors = createVideoValidation(title, author, availableResolutions);
    if (errors.length > 0)
        return res.status(400).send({ errorsMessages: errors });
    // const publicationDate = new Date(+new Date() + 1000 * 60 * 60 * 24).toISOString()
    const dateNow = new Date();
    const newVideo = {
        "id": +dateNow,
        "title": title,
        "author": author,
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": dateNow.toISOString(),
        "publicationDate": (0, date_fns_1.addDays)(dateNow, 1).toISOString(),
        "availableResolutions": availableResolutions
    };
    exports.db.push(newVideo);
    return res.status(201).send(newVideo);
});
exports.videosRouter.get('/', (req, res) => {
    return res.status(200).send(exports.db);
});
exports.videosRouter.get('/:id', (req, res) => {
    const idParams = +req.params.id;
    const videoSearchId = exports.db.find(v => v.id === idParams);
    if (!videoSearchId) {
        return res.sendStatus(404);
    }
    return res.status(200).send(videoSearchId);
});
exports.videosRouter.delete('/:id', (req, res) => {
    const idReq = +req.params.id;
    const video = exports.db.find(v => v.id === idReq);
    if (!video) {
        return res.sendStatus(404);
    }
    let flagVideosSerch = exports.db.find(v => v.id === video.id);
    exports.db.splice(exports.db.indexOf(flagVideosSerch), 1);
    return res.sendStatus(204);
});
