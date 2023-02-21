import * as dotenv from 'dotenv'
dotenv.config()

import {app} from "./app"
import {runDB} from "./db";
//
const port= process.env.PORT || 3003

const startApp=async ()=> {
    await runDB()
    app.listen(port, async () => {
        console.log(`Example app listening on port ${port}`)
    })
}
    startApp().then(()=>console.log('App start success'));
