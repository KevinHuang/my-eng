import { QuizHelper } from './../dal/quiz_helper';
import Router from "koa-router";


const subRouter = new Router();

subRouter.get('/getMyTopics', async ctx => {
    const userInfo = ctx.session?.userInfo;
    try {
        const result = await QuizHelper.get_my_topics(userInfo.id);
        ctx.body = result;
    } catch (error) {
        ctx.status = 500 ;
        ctx.body = error ;
    }
});

subRouter.get('/getMyQuizProgress', async ctx => {
    const userInfo = ctx.session?.userInfo;
    try {
        const result = await QuizHelper.get_my_quiz_progress(userInfo.id);
        ctx.body = result;
    } catch (error) {
        ctx.status = 500 ;
        ctx.body = error ;
    }
});

export default subRouter ;