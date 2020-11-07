import Router from "koa-router";


const routerUser = new Router();

routerUser.get('/isSignIn', ctx => {
    const userInfo = ctx.session?.userInfo;
    ctx.body = { signin: !!userInfo };
});

routerUser.get('/my_info', ctx => {
    ctx.body =  ctx.session ? ctx.session.userInfo : {}
    
});

routerUser.get('/signout', ctx => {
    ctx.session = null ;
    ctx.body = { result: "OK"};
});



export default routerUser ;