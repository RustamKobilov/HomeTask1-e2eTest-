// import express, {NextFunction, Request, Response} from "express";
//
// const base64 = require("base-64");
//
// function decodeCredentials(authHeader:any) {
//     // authHeader: Basic YWRtaW46YWRtaW4=
//     const encodedCredentials = authHeader
//         .trim()
//         .replace(/Basic\s+/i, '');
//
//     const decodedCredentials = base64.decode(encodedCredentials);
//
//     return decodedCredentials.split(':');
// }
//
// module.exports = function middlewareAutorized(req:Request, res:Response, next:NextFunction) {
//     const [username, password] = decodeCredentials(req.headers.authorization || '');
//
//     if (username === 'admin' && password === 'qwerty') {
//         return next();
//     }
//
//     res.set('WWW-Authenticate', 'Basic realm="user_pages"');
//     res.status(401).send('Authentication required.');
// }