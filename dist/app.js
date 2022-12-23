"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const videos_router_1 = require("./routse/videos-router");
const videos_router_2 = require("./routse/videos-router");
exports.app = (0, express_1.default)();
const convertJson = express_1.default.json();
exports.app.use(convertJson);
exports.app.use('/hometask_01/api/videos', videos_router_1.videosRouter);
exports.app.delete('/ht_01/api/testing/all-data', (req, res) => {
    videos_router_2.db.splice(0, videos_router_2.db.length);
    res.status(204);
});
