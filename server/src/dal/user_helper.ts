
import { connection } from './database';

export class UserHelper {
    /**取得所有的代理人名單 */
    public static get_agents(): Promise<any[]> {
        const sql = `
            SELECT
                sso.id user_id, sso.sso_first_name AS name, sso.sso_user_name as user_name, sso.sso_source,
                agents.bywhom, agents.assign_time
            FROM agents
                INNER JOIN "user_sso" sso ON sso.id = agents.ref_user_sso_id
            ORDER BY agents.assign_time DESC;
        `;
        return connection.manyOrNone(sql);
    }

    /**取得所有的代理人名單 */
    public static addUser(sso_source: string, 
                          sso_identity: string,
                          sso_refresh_token: string,
                          sso_user_name: string,
                          sso_first_name: string,
                          sso_last_name: string,
                          sso_email: string): Promise<any> {
        const sql = `
        WITH raw_data AS (
            SELECT 
                '${sso_user_name}' AS user_id,
                '${sso_first_name}' AS given_name,
                '${sso_last_name}' AS family_name,
                '${sso_source}' AS signin_type,
                '${sso_refresh_token}' AS refresh_token,
                '${sso_identity}' AS sso_identity
        ),
        
        insert_data AS (
            INSERT INTO public.member( user_id, given_name, family_name , signin_type, refresh_token, sso_identity) 
            SELECT
                raw.user_id,
                raw.given_name,
                raw.family_name,
                raw.signin_type,
                raw.refresh_token,
                raw.sso_identity
            FROM
                raw_data raw 
                LEFT OUTER JOIN "member" m ON m.user_id = raw.user_id  
            WHERE
                m.id is null
            RETURNING member.id
        ),
        
        update_data AS (
        
            UPDATE 
                public.member
            SET 
                given_name= raw.given_name , 
                family_name= raw.family_name, 
                enabled= true, 
                signin_type= raw.signin_type, 
                refresh_token= raw.refresh_token, 
                sso_identity= raw.sso_identity
            FROM raw_data raw
            WHERE 
                raw.user_id =  "member".user_id
            RETURNING id
        )
        
        SELECT * FROM insert_data 
        UNION 
        SELECT * FROM update_data
        `;
        // console.log(sql);
        return connection.oneOrNone(sql);
    }
}