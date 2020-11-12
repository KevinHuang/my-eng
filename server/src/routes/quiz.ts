import { QuizHelper } from './../dal/quiz_helper';
import Router from "koa-router";
import { v4 as uuidv4 } from 'uuid';


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
        console.log(error);
        ctx.status = 500 ;
        ctx.body = error ;
    }
});

subRouter.get('/getQuizProgress', async ctx => {
    
    try {
        const { quizsheet_uuid } = ctx.query;
        if (!quizsheet_uuid) { throw '沒有 quizsheet uuid' }
        const userInfo = ctx.session?.userInfo;
        const result = await QuizHelper.get_quiz_progress(userInfo.id, quizsheet_uuid);
        ctx.body = result;
    } catch (error) {
        console.log(error);
        ctx.status = 500 ;
        ctx.body = error ;
    }
});

subRouter.get('/startQuiz', async ctx => {
    
    try {
        const { quizsheet_uuid } = ctx.query;
        if (!quizsheet_uuid) { throw '沒有 quizsheet uuid' }
        const userInfo = ctx.session?.userInfo;
        let quiz = await QuizHelper.getQuiz(userInfo.id, quizsheet_uuid);
        const quiz_uqid = uuidv4() ;
        if (!quiz) {
            quiz = await QuizHelper.newQuiz(userInfo.id, quizsheet_uuid, quiz_uqid )
        } else {
            quiz = await QuizHelper.addQuiz(userInfo.id, quizsheet_uuid, quiz_uqid )
        }
        // console.log(quiz);
        ctx.body = quiz;
    } catch (error) {
        ctx.status = 500 ;
        ctx.body = error ;
    }
});

subRouter.get('/getQuizInfo', async ctx => {
    
    try {
        const { quiz_uuid } = ctx.query;
        if (!quiz_uuid) { throw '沒有 quiz uuid' }
        const userInfo = ctx.session?.userInfo;
        let quiz = await QuizHelper.getQuizInfo(quiz_uuid);
        
        console.log(quiz);
        ctx.body = quiz;
    } catch (error) {
        console.log(error);
        ctx.status = 500 ;
        ctx.body = error ;
    }
});

subRouter.get('/getQuestions', async ctx => {
    try {
        const { quizsheet_uuid, quiz_uuid } = ctx.query;
        if (!quizsheet_uuid) { throw '沒有 quizsheet uuid' }
        if (!quiz_uuid) { throw '沒有 quiz uuid' }
        const userInfo = ctx.session?.userInfo;
        let questions = await QuizHelper.getQuesions(quizsheet_uuid, quiz_uuid);
        ctx.body = questions;
    } catch (error) {
        console.log(error);
        ctx.status = 500 ;
        ctx.body = error ;
    }
});

subRouter.post('/setAnswer', async ctx => {
    try {
        console.log(ctx.request);
        const { question_id, quiz_uuid, ans, quizsheet_uuid } = ctx.request.body;
        if (!question_id) { throw '沒有 question_id' }
        if (!quiz_uuid) { throw '沒有 quiz uuid' }
        if (!ans) { throw '沒有 ans' }
        if (!quizsheet_uuid) { throw '沒有 quizsheet_uuid' }

        const userInfo = ctx.session?.userInfo;
        // 1. 判斷 quiz_uuid 是不是還有效
        const quiz = await QuizHelper.getQuiz(userInfo.id, quizsheet_uuid);
        if (!quiz) { throw '沒有符合的 Quiz'}
        if (quiz.current_uuid !== quiz_uuid) { throw `quiz uuid: ${quiz_uuid} 已經無效，不能更改資料！` }
        // 2. 找到題目。
        const q = await QuizHelper.getQuesion(question_id);
        if (!q) { throw '沒有符合的 question!' }
        // 3. 比對答案，判斷是否答對。
        const is_correct = ( q.answer.toString() === ans );
        // 4. 判斷此題是否已經作答過
        let hasAnswered = false ;
        const ansHistory = await QuizHelper.getUserAnswer(quiz_uuid, question_id, userInfo.id);
        if (ansHistory) {
            console.log(ansHistory);
            ansHistory.history.forEach((ansHis: { quiz_uuid: any; }) => {
                if (ansHis.quiz_uuid === quiz_uuid) {
                    hasAnswered = true;
                }
            });
            if (hasAnswered) {
                await QuizHelper.updateUserAnswer(quiz_uuid, question_id, userInfo.id, ans, is_correct);
            } else {
                await QuizHelper.appendUserAnswer(quiz_uuid, question_id, userInfo.id, ans, is_correct);
            }
        } else {
            await QuizHelper.createUserAnswer(quiz_uuid, question_id, userInfo.id, ans, is_correct);
        }
        // if (hasAnswered) {
        //     await QuizHelper.updateUserAnswer(quiz_uuid, question_id, userInfo.id, ans, is_correct);
        // } else {
        //     await QuizHelper.addUserAnswer(quiz_uuid, question_id, userInfo.id, ans, is_correct);
        // }
        // 5. 更新試卷的答對率
        await QuizHelper.updateQuizStatus(quiz_uuid, quiz.ref_quiz_sheet_id, userInfo.id);
        ctx.body = { result: "OK" };
    } catch (error) {
        console.log(error);
        ctx.status = 500 ;
        ctx.body = error ;
    }
});


export default subRouter ;