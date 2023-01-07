"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../src/app");
describe('/hometask_01/api/videos', () => {
    it('should 404', () => {
        (0, supertest_1.default)(app_1.app).delete('/hometask_01/api/videos/7').expect(200);
    });
});
