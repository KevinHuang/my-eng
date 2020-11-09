import Router from "koa-router";

import user from './user';
import quiz from './quiz';

const routerAPI = new Router({
    prefix: '/api'
});

routerAPI.use('/user',user.routes());
routerAPI.use('/quiz',quiz.routes());
export default routerAPI ;