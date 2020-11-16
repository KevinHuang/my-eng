import Router from "koa-router";
import { LearnGroupHelper } from "../dal/group_helper";


const routerUser = new Router();

routerUser.post('/joinGroup', async ctx => {
    try {
        const userInfo = ctx.session?.userInfo;
        const { group_code } = ctx.request.body;
        if (!group_code) { throw '沒有 group_code' }
        const grp = await LearnGroupHelper.get_group(group_code);
        if (!grp) { throw '沒有符合的 group_code !'}
        await LearnGroupHelper.join_group(userInfo.id, grp.id, 'student');
        ctx.body = { result: "OK" }
    } catch (error) {
        console.log(error);
        ctx.status = 500 ;
        ctx.body = error ;
    }
});

routerUser.get('/getMyGroups', async ctx => {
    try {
        const userInfo = ctx.session?.userInfo;
        const groups = await LearnGroupHelper.get_my_groups(userInfo.id);
        ctx.body = groups ;
    } catch (error) {
        console.log(error);
        ctx.status = 500 ;
        ctx.body = error ;
    }
    
});

routerUser.post('/removeGroup', async ctx => {
    try {
        const userInfo = ctx.session?.userInfo;
        const { group_id } = ctx.query;
        if (!group_id) { throw '沒有 group_id' }
        await LearnGroupHelper.remove_group(userInfo.id, group_id, 'student');
        ctx.body = { result: "OK" }
    } catch (error) {
        console.log(error);
        ctx.status = 500 ;
        ctx.body = error ;
    }
});



export default routerUser ;