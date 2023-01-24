import {app} from "./app"
import {randomUUID} from "crypto";
import {runDB} from "./db";
//process.env.PORT||
const port=3003

const startApp=async ()=> {
    await runDB()
    app.listen(port, async () => {
        console.log(`Example app listening on port ${port}`)
    })
}
    startApp();
