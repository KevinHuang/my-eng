import { connection } from './database';
import * as moment from 'moment';

export class LearnGroupHelper {
    /** 
     * 取得我的 title 
     * 邏輯是：我參加的群組，所採用的 title。
     * */
    public static get_my_groups(member_id: number): Promise<any[]> {
        const sql = `
        select 
        grp.*,
            mgb.role,
            mgb.subrole
        from (select * from mg_belong where ref_member_id = $1) AS mgb 
            INNER JOIN learn_group grp on grp.id = mgb.ref_group_id
        ORDER BY 
        grp.group_name
        `;
        // console.log(sql);
        return connection.manyOrNone(sql, [member_id]);
    }

    public static get_group(group_code: string) {
        const sql = `SELECT * FROM learn_group WHERE group_code = $1`
        return connection.oneOrNone(sql, [group_code]);
    }

    public static join_group(member_id: number, group_id: string, role: string): Promise<any[]> {
        const sql = `
        INSERT INTO mg_belong (ref_member_id, ref_group_id, role, last_update)
        SELECT ${member_id}, ${group_id}, '${role}', now()
        WHERE NOT EXISTS(select * from mg_belong where ref_member_id = ${member_id} and ref_group_id = ${group_id} and role='${role}');
        `;
        // console.log(sql);
        return connection.manyOrNone(sql, [member_id]);
    }

    public static remove_group(member_id: number, group_id: string, role: string): Promise<any[]> {
        const sql = `
        DELETE FROM mg_belong WHERE ref_member_id = $1 and ref_group_id = $2 and role=$3
        `;
        // console.log(sql);
        return connection.manyOrNone(sql, [member_id, group_id, role]);
    }
}
