import Router from "koa-router";


const routerUser = new Router();

routerUser.get('/my_info', ctx => {
    ctx.body = {
        result: ctx.session ? ctx.session.userInfo : undefined
    }
});



export default routerUser ;