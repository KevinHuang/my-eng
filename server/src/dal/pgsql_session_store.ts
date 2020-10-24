import { connection } from './database';

export default {
    get: async (key: string, maxAge: number | 'session', args: any) => {
        const record = await connection.oneOrNone(`
WITH row AS (
    SELECT
        $(key)::TEXT AS session_id
)
UPDATE
    session
SET
    expiry_date = FLOOR(EXTRACT(EPOCH FROM now()) * 1000) + $(maxAge)::INT
FROM
    row
WHERE
    session.session_id = row.session_id
    AND session.expiry_date > FLOOR(EXTRACT(EPOCH FROM now()) * 1000)
RETURNING session.*
            `, {
            key: key
            , maxAge: (maxAge === 'session' ? (8 * 60 * 60 * 1000) : maxAge)
        });
        if (record) {
            const data = record.data || {};
            data._id = key;
            return data;
        } else {
            return null;
        }
    },
    set: async (key: string, sess: any, maxAge: number | 'session', { rolling, changed }: { rolling: any, changed: any }) => {
        try {
            if (!changed) return;

            await connection.oneOrNone(`
WITH row AS (
    SELECT
        $(key)::TEXT AS session_id
        , $(data)::JSON AS data
), upd AS (
    UPDATE
        session
    SET
        expiry_date = FLOOR(EXTRACT(EPOCH FROM now()) * 1000) + $(maxAge)::INT
        , data = row.data
    FROM
        row
    WHERE
        session.session_id = row.session_id
), ins AS (
    INSERT INTO session(
        session_id
        , expiry_date
        , data
    )
    SELECT
        row.session_id
        , FLOOR(EXTRACT(EPOCH FROM now()) * 1000) + $(maxAge)::INT AS expiry_date
        , row.data
    FROM
        row
    WHERE
        NOT EXISTS (
            SELECT
                session.*
            FROM
                row
                INNER JOIN session
                    ON session.session_id = row.session_id
        )
), auto_clean AS (
    DELETE FROM session
    WHERE
        expiry_date < FLOOR(EXTRACT(EPOCH FROM now() - interval '5 minutes') * 1000)
)
SELECT 0
            `, {
                key: key
                , data: JSON.stringify(sess)
                , maxAge: (maxAge === 'session') ? (8 * 60 * 60 * 1000) : maxAge
            });
        } catch (error) {
            console.error(`set session occure error: ${error.message}`);
        }
    },
    destroy: async (key: string) => {
        try {
            await connection.none(`
DELETE FROM session
WHERE
    session_id = $(key)
            `, {
                key: key
            });
        } catch (error) {
            console.error(`set session occure error: ${error.message}`);
        }
    }
};