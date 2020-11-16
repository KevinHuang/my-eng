import Router from "koa-router";

import user from './user';
import quiz from './quiz';
import group from './learn_group';

const routerAPI = new Router({
    prefix: '/api'
});

routerAPI.use('/user',user.routes());
routerAPI.use('/quiz',quiz.routes());
routerAPI.use('/group',group.routes());
export default routerAPI ;