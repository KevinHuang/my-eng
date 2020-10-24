import { ParameterizedContext } from "koa";

export class Util {

    public static setError(ctx: ParameterizedContext, error: any) {
        ctx.status = 500;
        ctx.body = {
            error: error
        }
    }
}