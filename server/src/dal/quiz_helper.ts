
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

    
}