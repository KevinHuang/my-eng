import Koa from "koa";
import bodyParser from "koa-bodyparser";
import KoaSession from 'koa-session';
import serve from 'koa-static';
import sessionStore from './dal/pgsql_session_store';
import config from './config.json';
import cors from "koa2-cors";
import logger from "koa-logger";
import Router from "koa-router"
import { Util } from "./routes/util";
import { createReadStream } from 'fs';


// import healthCheck from "./routes/healthcheck";



const app = new Koa();

const PORT = process.env.PORT || '3003';

// session setup
const session_conf: Partial<KoaSession.opts> = {
    key: '@nancy-english_web', /** (string) cookie key (default is koa:sess) */
    maxAge: 'session', // 用戶端 cookie 過期時間，多久沒使用 cookie 會失效。
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    store: sessionStore
};
app.keys = ['@nancy-english_web']; // 不設定 koa-session 不運作。
app.use(KoaSession(session_conf, app));

// 
app.use(bodyParser({ enableTypes: ['json', 'form', 'text', 'xml'], jsonLimit: '5mb' }));

app.use(
    cors({
        origin: "*"
    })
);
app.use(logger());

// ==== Routing ==========
const router = new Router();

import signin from './routes/signin';
router.use( signin.routes(), signin.allowedMethods());

import api from './routes/api';
router.use(api.routes(), api.allowedMethods());

app.use(router.routes());


const routerRoot = new Router();
routerRoot.get('/', async (ctx) => {
    try {
        console.log(`http get /  ${__dirname}`);
        // ctx.type = 'html';
        // ctx.body = createReadStream(`${__dirname}/../public/index.html`);
        ctx.redirect("http://localhost:4200");
    } catch (err) {
        console.error(err);
        Util.setError(ctx, err);
    }
})
app.use(routerRoot.routes()); 

// ==== static public folder ======
app.use(serve("./public", { index: 'none' })); // 靜態檔案。



// start this app.
const server = app
    .listen(PORT, async () => {
        console.log(`Server listening on port: ${PORT} ...`);
    })
    .on("error", err => {
        console.error(err);
    });

export default server;