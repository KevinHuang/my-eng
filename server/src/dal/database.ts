/**
 * 資料庫相關初始設定。
 *
 * Library：https://github.com/vitaly-t/pg-promise
 * TypeScript Ext Document：https://github.com/vitaly-t/pg-promise/tree/master/typescript
 */

import PGP from 'pg-promise';
import { Context } from 'koa';
import * as config from '../config.json';

const pgp = PGP();

/**資料庫連線 instance。 */
export const connection = pgp(config.DBCONFIG.cnString);