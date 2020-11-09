
import { connection } from './database';

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
                qs.sheet_order,
                q_count.total_count,
            	coalesce(q_count.total_count, 0) as total_count,
                coalesce(qz.right_count, 0) as right_count,
                coalesce(qz.history, '[]'::JSON) as history,
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

    
}