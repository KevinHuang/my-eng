import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { config } from "./config";
import cors from "koa2-cors";
import logger from "koa-logger";

import healthCheck from "./routes/healthcheck";

const app = new Koa();

const PORT = config.port ;

app.use(bodyParser());
app.use(
    cors({
        origin: "*"
    })
);
app.use(logger());

// add router :
app.use(healthCheck.routes());

// const router = new Router();
// router.get('/', async (ctx) => {
//     try {
//         ctx.body = {
//             status: "success",
//         };
//     } catch (err) {
//         console.error(err);
//     }
// })
// app.use(router.routes());

// start this app.
const server = app
    .listen(PORT, async() => {
        console.log(`Server listening on port: ${PORT}`);
    })
    .on("error",  err => {
        console.error(err);
    });

export default server ;