import Router from "koa-router";


const routerUser = new Router();

routerUser.get('/my_info', ctx => {
    ctx.body =  ctx.session ? ctx.session.userInfo : {}
    
});

routerUser.get('/signout', ctx => {
    ctx.session = null ;
    ctx.body = { result: "OK"};
});



export default routerUser ;