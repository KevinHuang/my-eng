
import { connection } from './database';
import * as moment from 'moment';

export class QuizHelper {
    /** 
     * 取得我的 title 
     * 邏輯是：我參加的群組，所採用的 title。
     * */
    public static get_my_topics(member_id: number): Promise<any[]> {
        const sql = `
        select 
            grp.group_name,
            topic.id topic_id,
            topic.name topic_name,
            topic.description,
            topic.uuid topic_uuid
        from mg_belong mgb 
            INNER JOIN learn_group grp on grp.id = mgb.ref_group_id
            INNER JOIN tg_use tgu ON grp.id = tgu.ref_group_id 
            INNER JOIN topic ON topic.id = tgu.ref_topic_id
        WHERE 
            mgb.ref_member_id = ${member_id}
        `;
        console.log(sql);
        return connection.manyOrNone(sql);
    }

    public static get_my_quiz_progress(member_id: number): Promise<any[]> {
        const sql = `
        with my_topics AS (
            select 
                grp.group_name,
                topic.id topic_id,
                topic.name topic_name
            from mg_belong mgb 
                INNER JOIN learn_group grp on grp.id = mgb.ref_group_id
                INNER JOIN tg_use tgu ON grp.id = tgu.ref_group_id 
                INNER JOIN topic ON topic.id = tgu.ref_topic_id
            WHERE 
                mgb.ref_member_id = ${member_id}
            ),
            
            q_count AS (
                SELECT 
                    count(id) as total_count,
                    ref_quiz_sheet_id
                FROM 
                    question
                GROUP BY 
                    ref_quiz_sheet_id
            )
            
            SELECT
                qs.id quiz_sheet_id,
                qs.name quiz_sheet_name, 
                qs.ref_topic_id topic_id,
                qs.sheet_order quiz_sheet_order,
                qs.uuid quiz_sheet_uuid,
                -- q_count.total_count,
            	coalesce(q_count.total_count, 0) as question_total_count,
                coalesce(qz.right_count, 0) as question_right_count,
                coalesce(qz.history, '[]'::jsonb) as history,
                CASE WHEN q_count.total_count = qz.right_count THEN true ELSE false END AS is_pass
            FROM
                quiz_sheet qs 
                LEFT OUTER JOIN (
                    SELECT * FROM quiz WHERE quiz.ref_member_id = ${member_id}
                )  qz on qz.ref_quiz_sheet_id = qs.id
                LEFT OUTER JOIN q_count ON q_count.ref_quiz_sheet_id = qs.id
            WHERE 
                qs.ref_topic_id IN (SELECT topic_id FROM my_topics)   
            ORDER BY
                qs.ref_topic_id,  qs.sheet_order    
        `;

        console.log(sql);
        return connection.manyOrNone(sql);
    }


    public static get_quiz_progress(member_id: number, quizsheet_uuid: string): Promise<any> {
        const sql = `
        with q_count AS (
                SELECT 
                    count(id) as total_count,
                    ref_quiz_sheet_id
                FROM 
                    question
                WHERE 
                    ref_quiz_sheet_id IN (select id from quiz_sheet where uuid='${quizsheet_uuid}')
                GROUP BY 
                    ref_quiz_sheet_id
            )
            
            SELECT
                qs.id quiz_sheet_id,
                qs.name quiz_sheet_name, 
                qs.ref_topic_id topic_id,
                qs.sheet_order quiz_sheet_order,
                qs.uuid quiz_sheet_uuid,
                -- q_count.total_count,
            	coalesce(q_count.total_count, 0) as question_total_count,
                coalesce(qz.right_count, 0) as question_right_count,
                coalesce(qz.history, '[]'::jsonb) as history,
                CASE WHEN q_count.total_count = qz.right_count THEN true ELSE false END AS is_pass
            FROM
                quiz_sheet qs 
                LEFT OUTER JOIN (
                    SELECT * FROM quiz WHERE quiz.ref_member_id = ${member_id}
                )  qz on qz.ref_quiz_sheet_id = qs.id
                LEFT OUTER JOIN q_count ON q_count.ref_quiz_sheet_id = qs.id
            WHERE 
                qs.uuid = '${quizsheet_uuid}'
            ORDER BY
                qs.ref_topic_id,  qs.sheet_order    
        `;

        console.log(sql);
        return connection.oneOrNone(sql);
    }

    public static getQuiz(member_id: number, quizsheet_uuid: string): Promise<any> {
        const sql = `select * from quiz where ref_member_id=$1 and ref_quiz_sheet_id in (select id from quiz_sheet where uuid= $2)`;

        console.log(sql);
        return connection.oneOrNone(sql, [member_id, quizsheet_uuid]);
    }

    public static getQuizInfo(quiz_uuid: string): Promise<any> {
        const sql = `select * from quiz where current_uuid=$1`;

        console.log(sql);
        return connection.oneOrNone(sql, [quiz_uuid]);
    }

    /** 建立一個學生對指定試卷的考試紀錄 */
    public static newQuiz(member_id: number, quizsheet_uuid: string, quiz_uuid: string): Promise<any> {
        const moment = require('moment');
        const sql = `
            WITH q AS (
                SELECT
                    count(id) as q_count,
                    ref_quiz_sheet_id
                FROM
                    question
                WHERE
                    ref_quiz_sheet_id in (SELECT id FROM quiz_sheet WHERE uuid='${quizsheet_uuid}')
                GROUP BY ref_quiz_sheet_id
            )
            
            INSERT INTO public.quiz(
                ref_member_id, ref_quiz_sheet_id, current_uuid, total_count, right_count, history, last_update)
            SELECT
                ${member_id} as ref_member_id,
                q.ref_quiz_sheet_id,
                '${quiz_uuid}' as current_uuid,
                q.q_count total_count,
                0 as right_count,
                '[{"uuid" : "${quiz_uuid}", "occur_at": "${moment().format()}", "right_count": 0 }]'::jsonb ,
                now() as last_update
            FROM q
            RETURNING * ;
        `;

        console.log(sql);
        return connection.oneOrNone(sql, [member_id, quizsheet_uuid]);
    }

    /** 一個學生對指定試卷，新增一筆考試紀錄 */
    public static addQuiz(member_id: number, quizsheet_uuid: string, quiz_uuid: string): Promise<any> {
        const moment = require('moment');
        const sql = `
            UPDATE public.quiz
            SET current_uuid = '${quiz_uuid}',
                history = history || '[{"uuid": "${quiz_uuid}", "occur_at" : "${moment().format()}", "right_count" : 0 }]'::jsonb ,
                last_update = now()
            WHERE
                ref_member_id = ${member_id} 
                AND
                ref_quiz_sheet_id IN (SELECT id FROM quiz_sheet WHERE uuid='${quizsheet_uuid}')
            RETURNING * ;
        `;

        console.log(sql);
        return connection.oneOrNone(sql, [member_id, quizsheet_uuid]);
    }
    
    /** 
     * 取得指定試卷的考題 
     * 技術參考：https://levelup.gitconnected.com/how-to-query-a-json-array-of-objects-as-a-recordset-in-postgresql-a81acec9fbc5
     * */
    public static getQuesions(quizsheet_uuid: string, quiz_uuid: string): Promise<any> {
        
        const sql = `
        WITH questions AS (
            SELECT *
            FROM question
            WHERE ref_quiz_sheet_id IN ( SELECT id FROM quiz_sheet WHERE uuid = $1)
        )
        
        , answers AS (
            SELECT 
                *
            FROM 
                answer,
                jsonb_to_recordset(answer.history) as items(quiz_uuid text, ans smallint)
            WHERE 
                ref_member_id = 3
                AND
                quiz_uuid = $2
        )
        
        SELECT 
            questions.*,
            article.content article_content,
            answers.quiz_uuid ,
            answers.ans user_answer
        FROM 
            questions 
            LEFT OUTER JOIN answers ON questions.id = answers.ref_question_id
            LEFT OUTER JOIN article ON questions.ref_article_id = article.id
        ORDER BY 
            questions.q_order
            
        `;

        console.log(sql);
        return connection.manyOrNone(sql, [quizsheet_uuid, quiz_uuid]);
    }

    public static getQuesion(question_id: string): Promise<any> {
        
        const sql = `
        SELECT 
            *
        FROM 
            question
        WHERE
            id= $1
        `;

        console.log(sql);
        return connection.oneOrNone(sql, [question_id]);
    }

    public static getUserAnswer(quiz_uuid: string, question_id: string, member_id: string): Promise<any> {
        
        const sql = `
            select 
                id, 
                ref_question_id,
                ref_member_id,
                answer,
                history
            from
                answer ans
            where 
                ref_member_id = ${member_id}
                and
                ref_question_id = ${question_id}
        `;

        console.log(sql);
        return connection.oneOrNone(sql);
    }

    public static updateUserAnswer(quiz_uuid: string, question_id: string, member_id: string, ans: string, is_correct: boolean): Promise<any> {
        
        const sql = `
            UPDATE answer ans
            SET history = jsonb_set(
                    history,
                    array[
                        (select ord - 1 from jsonb_array_elements(history) WITH ORDINALITY arr(opt, ord) where opt ->> 'quiz_uuid' = '${quiz_uuid}')::text,
                        'ans'
                    ],
                    '${ans}'::jsonb)
                , is_correct=${is_correct}
                , last_update = now()
                , answer = '${ans}'
            WHERE 
                ans.ref_question_id = ${question_id}
                AND
                ans.ref_member_id = ${member_id}
            RETURNING * ;
        `;

        console.log(sql);
        return connection.oneOrNone(sql);
    }

    public static appendUserAnswer(quiz_uuid: string, question_id: string, member_id: string, ans: string, is_correct:boolean): Promise<any> {
        const moment = require('moment');
        const sql = `
            UPDATE answer
            SET history = history || '[{"quiz_uuid":"${quiz_uuid}", "ans": "${ans}", "ans_time":"${moment().format()}"}]'::jsonb
                , is_correct=${is_correct}
                , last_update = now()
                , answer = '${ans}'
            WHERE 
                ref_question_id = ${question_id}
                AND
                ref_member_id = ${member_id}
            RETURNING * ;
        `;

        console.log(sql);
        return connection.oneOrNone(sql);
    }

    public static createUserAnswer(quiz_uuid: string, question_id: string, member_id: string, ans: string, is_correct:boolean): Promise<any> {
        const moment = require('moment');
        const sql = `
            INSERT INTO answer (ref_question_id, ref_member_id, answer, is_correct, last_update, history) VALUES
            ( ${question_id}, ${member_id}, '${ans}', ${is_correct}, now(),
            '[{"quiz_uuid":"${quiz_uuid}", "ans": "${ans}", "ans_time":"${moment().format()}"}]'::jsonb )
            RETURNING *;
        `;

        console.log(sql);
        return connection.oneOrNone(sql);
    }

    public static updateQuizStatus(quiz_uuid: string, quizsheet_id: string, member_id: string): Promise<any> {
        const moment = require('moment');
        const sql = `
        WITH answer_status AS (
            select 
                ans.ref_member_id member_id,
                q.ref_quiz_sheet_id quiz_sheet_id,
                sum( case when ans.is_correct then 1 else 0 end) as right_count,
                count(q.id) as total_question_count
            from
                answer ans inner join 
                question q on ans.ref_question_id = q.id
            where
                ans.ref_member_id = ${member_id}
                and 
                ref_quiz_sheet_id = ${quizsheet_id}
            group by 
                q.ref_quiz_sheet_id,
                ans.ref_member_id
        ),
            
        update_data AS (
            UPDATE quiz
            SET 
                total_count = answer_status.total_question_count,
                right_count = answer_status.right_count,
                last_update = now()
            FROM
                answer_status
            WHERE 
                ref_member_id = answer_status.member_id 
                AND
                ref_quiz_sheet_id = answer_status.quiz_sheet_id
            
            RETURNING * 
        )
            
        SELECT * FROM update_data ;
        `;

        console.log(sql);
        return connection.oneOrNone(sql);
    }

    public static getQuestionAndAnswers(member_id: number, quizsheet_uuid: string): Promise<any> {
        const sql = `
            SELECT 
                q.*,
                ans.is_correct,
                ans.history
            FROM
                ( 
                    select * from question where ref_quiz_sheet_id in (
                        select id from quiz_sheet where uuid = $1
                    )
                ) as q 
                INNER JOIN (
                    select * from answer where ref_member_id = $2
                ) AS ans on ans.ref_question_id = q.id
            ORDER BY q.q_order
        `;

        console.log(sql);
        return connection.many(sql, [quizsheet_uuid, member_id]);
    }


    public static getQuestionStatistics(member_id: number, quizsheet_uuid: string): Promise<any> {
        const sql = `
        SELECT 
            q.*,
            summary.total_count,
            summary.right_count
        FROM
            (
                SELECT
                    ref_question_id,
                    count(id) as total_count,
                    sum(case WHEN is_correct THEN 1 ELSE 0 END) as right_count
                FROM
                    (
                    select 
                        answer.id, 
                        ref_question_id, 
                        jsonb_array_elements(history) ->> 'ans' as user_ans,
                        q.answer,
                        (jsonb_array_elements(history) ->> 'ans' = q.answer::text) as is_correct
                    FROM
                        answer 
                        INNER JOIN question q ON q.id = answer.ref_question_id
                    WHERE
                        q.ref_quiz_sheet_id in (
                                SELECT id FROM quiz_sheet WHERE uuid= $1
                        )
                        and ref_member_id = $2
                    ) as A
                GROUP BY 
                    ref_question_id
            ) AS summary 
            INNER JOIN question q on q.id = summary.ref_question_id
        `;
        console.log(sql);
        return connection.many(sql, [quizsheet_uuid, member_id]);
    }


}