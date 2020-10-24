import Router from "koa-router";

import user from './user';

const routerAPI = new Router({
    prefix: '/api'
});

routerAPI.use('/user',user.routes());
export default routerAPI ;