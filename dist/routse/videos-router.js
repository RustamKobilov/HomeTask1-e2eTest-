"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.videosRouter = void 0;
const express_1 = require("express");
const Model_1 = require("../Model");
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
exports.videosRouter.put('/:id', (req, res) => {
    //proverka
    //id [обработать если перердадут не цифру]
    if (+req.params.id === undefined) {
        res.status(404).send({ messages: 'id errors', field: 'поле id не корректно'
        });
    }
    //title
    if (req.body.title === undefined || req.body.title > 40 || req.body.title < 1 || typeof req.body.title !== 'string') {
        res.status(400).send({ messages: 'title errors', field: 'поле title не корректно'
        });
    }
    //author
    if (req.body.author === undefined || req.body.author > 20 || req.body.author < 1 || typeof req.body.author !== 'string') {
        res.status(400).send({ messages: 'author errors', field: 'поле author не корректно'
        });
    }
    //availableResolutions
    if (req.body.availableResolutions === undefined || req.body.availableResolutions.constructor !== Array) {
        res.status(400).send({
            messages: 'availableResolutions errors', field: 'поле availableResolutions не корректно'
        });
    }
    //canBeDownloaded
    if (req.body.canBeDownloaded === undefined || typeof req.body.canBeDownloaded !== 'boolean') {
        res.status(400).send({ messages: 'canBeDownloaded errors', field: 'поле canBeDownloaded не корректно'
        });
    }
    //minAgeRestriction
    if (req.body.minAgeRestriction === undefined || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 1 || typeof req.body.minAgeRestriction !== "number") {
        res.status(400).send({ messages: 'minAgeRestriction errors', field: 'поле minAgeRestriction не корректно'
        });
    }
    const resultBodyAvailableResolutions = req.body.availableResolutions;
    let flagRunEnum = resultBodyAvailableResolutions.filter(function (p) { return Object.values(Model_1.Resolution).includes(p); });
    if (resultBodyAvailableResolutions.length !== flagRunEnum.length) {
        res.status(400).send({
            messages: 'availableResolutions errors', field: 'поле availableResolutions не корректно'
        });
    }
    //publicationDate
    if (req.body.publicationDate === undefined || typeof req.body.publicationDate !== 'string') {
        res.status(400).send({ messages: 'publicationDate errors', field: 'поле publicationDate не корректно'
        });
    }
    const idReq = +req.params.id;
    const titleReq = req.body.title;
    const authorReq = req.body.author;
    const availableResolutionsReq = req.body.availableResolutions;
    const canBeDowloadedReq = req.body.canBeDownloaded;
    const minAgeRestrictionReq = req.body.minAgeRestriction;
    const publicationDateReq = req.body.publicationDate;
    const flagSearchVideo = exports.db.filter(p => p['id'] === idReq);
    if (flagSearchVideo.length < 1) {
        res.status(404);
    }
    const updateVideo = {
        "id": idReq,
        "title": titleReq,
        "author": authorReq,
        "canBeDownloaded": canBeDowloadedReq,
        "minAgeRestriction": minAgeRestrictionReq,
        "createdAt": publicationDateReq,
        "publicationDate": publicationDateReq,
        "availableResolutions": availableResolutionsReq
    };
    const flagNumberVideoInBase = exports.db.splice(exports.db.indexOf(flagSearchVideo), 1, updateVideo);
    console.log(exports.db);
    res.status(204);
});
exports.videosRouter.post('/', (req, res) => {
    //title
    if (req.body.title === undefined || req.body.title > 40 || req.body.title < 1 || typeof req.body.title !== 'string') {
        res.status(400).send({ messages: 'title errors', field: 'поле title не корректно'
        });
    }
    //author
    if (req.body.author === undefined || req.body.author > 20 || req.body.author < 1 || typeof req.body.author !== 'string') {
        res.status(400).send({ messages: 'author errors', field: 'поле author не корректно'
        });
    }
    //availableResolutions
    if (req.body.availableResolutions === undefined || req.body.availableResolutions.constructor !== Array) {
        res.status(400).send({
            messages: 'availableResolutions errors', field: 'поле availableResolutions не корректно'
        });
    }
    let idDbNewVideo = 1;
    if (exports.db.length !== 0) {
        idDbNewVideo = exports.db.length;
    }
    const newVideo = {
        "id": idDbNewVideo,
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": new Date().toISOString(),
        "publicationDate": new Date().toISOString(),
        "availableResolutions": req.body.availableResolutions
    };
    exports.db.push(newVideo);
    res.status(201).send(newVideo);
});
exports.videosRouter.get('/', (req, res) => {
    res.status(200).send(exports.db);
});
exports.videosRouter.get('/:id', (req, res) => {
    //id [обработать если перердадут не цифру]
    if (+req.params.id === undefined) {
        res.status(404).send({
            messages: 'id errors', field: 'поле id не корректно'
        });
    }
    const idParams = +req.params.id;
    const videoSearchId = exports.db.filter(s => { return s.id === idParams; });
    if (videoSearchId.length === 0) {
        res.status(404);
    }
    res.status(200).send(videoSearchId);
});
exports.videosRouter.delete('/:id', (req, res) => {
    //id [обработать если перердадут не цифру]
    if (+req.params.id === undefined) {
        res.status(404).send({
            messages: 'id errors', field: 'поле id не корректно'
        });
    }
    const idReq = +req.params.id;
    const flagSearchVideo = exports.db.filter(p => p['id'] === idReq);
    if (flagSearchVideo.length < 1) {
        res.status(400).send('Not Found');
    }
    const flagNumberVideoInBase = exports.db.splice(exports.db.indexOf(flagSearchVideo), 1);
    console.log(exports.db);
    res.status(204);
});
