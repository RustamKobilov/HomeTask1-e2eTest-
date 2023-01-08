import {app} from "./app"
import {randomUUID} from "crypto";

const port=3003;

app.listen(port,() => {
    console.log(`Example app listening on port ${port}`)
})