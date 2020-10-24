import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import { Util } from './util';
import * as config from '../config.json';
import got from 'got';

const routerSignin = new Router();
const routerSignInHandler = new Router();

routerSignInHandler.get('/:signinType/callback', async ctx => {
    try {
        console.log(`${ctx.params.signinType} callback`);
        const clientID = config.SSO.google.clientID;
        const clientSecret = config.SSO.google.clientSecret;
        const redirectUri = config.SSO.google.redirectUri;

        const code: string = ctx.request.query.code;

        const startTime = new Date();

        // code 換 token
        const reqBody = "grant_type=authorization_code"
            + `&client_id=${clientID}`
            + `&client_secret=${clientSecret}`
            + `&redirect_uri=${redirectUri}`
            + `&code=${code}`;

        console.log(`reqBody= ${reqBody}`);
        // await this.logUserSSODetail(state, "?" + ctx.request.querystring, startTime);
        //拒絕授權、取消登入作業
        const error: string = ctx.request.query.error;
        if (error || !code) {
            // await this.ssoCancel(ctx, state.match(/^bind/), error);
            // await this.logUserSSODetail(state, "login cancel", startTime);
            Util.setError(ctx, { error: '拒絕授權，取消登入。' })
            return;
        }

        console.log(`get access token for code : ${code}`);

        // https://www.googleapis.com/oauth2/v4/token
        try {
            const targetUrl = `https://www.googleapis.com/oauth2/v4/token`;

            got.post(targetUrl, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: reqBody
            })
            var tokenRsp: any = JSON.parse((await got.post(targetUrl, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: reqBody
            })).body);
            console.log(`tokenRsp=`, tokenRsp);
            // await this.logUserSSODetail(state, "get tokenRsp=" + JSON.stringify(tokenRsp), startTime);
        }
        catch (exc) {
            // await this.logUserSSODetail(state, "get tokenRsp Failed", startTime);
            // await this.logUserSSODetail(state, "\t" + JSON.stringify(exc), startTime);
            console.log(exc);
            throw exc;
        }

        // console.log("tokenRsp : ", tokenRsp);
        // ctx.response.body = JSON.stringify(tokenRsp);
        // return;


        try {
            var jwt = require('jsonwebtoken');
            var idTokenInfo = jwt.decode(tokenRsp.id_token);
            console.log(`idTokenInfo:${JSON.stringify(idTokenInfo)}`);
        }
        catch (exc) {
            // await this.logUserSSODetail(state, "parse IDToken Failed", startTime);
            // await this.logUserSSODetail(state, "\t" + JSON.stringify(exc), startTime);
            throw exc;
        }

        // rspbody = decoded;
        // ctx.response.body = rspbody;
        // return;

        // User 資料 寫入 DB
        try {
            ctx.body = {
                signinType: 'google',
                email: idTokenInfo.email,
                given_name: idTokenInfo.given_name,
                family_name: idTokenInfo.family_name,
                sso_identity: idTokenInfo.sub
            }
            await finish(
                ctx
                , "google"
                , idTokenInfo.sub
                , tokenRsp.refresh_token
                , idTokenInfo.email
                , idTokenInfo.given_name
                , idTokenInfo.family_name
                , idTokenInfo.email
            );
        }
        catch (exc) {
            // await this.logUserSSODetail(state, "finish Failed", startTime);
            // await this.logUserSSODetail(state, "\t" + JSON.stringify(exc), startTime);
            throw exc;
        }
    } catch (error) {
        Util.setError(ctx, error);
    }

});


routerSignInHandler.get('/:signinType', ctx => {
    const { signinType } = ctx.params;
    if (signinType === 'google') {
        const clientID = config.SSO.google.clientID;
        const redirectUri = config.SSO.google.redirectUri;
        const scope = "https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile";
        // google scope 請參考：https://developers.google.com/identity/protocols/googlescopes
        const state = (new Date()).getMilliseconds().toString();

        ctx.response.redirect("https://accounts.google.com/o/oauth2/auth"
            + "?response_type=code"
            + "&client_id=" + encodeURIComponent(clientID)
            + "&redirect_uri=" + encodeURIComponent(redirectUri)
            + "&response_mode=query"
            + "&scope=" + (scope)
            + "&state=" + encodeURIComponent(state)
            + "&approval_prompt=force"      //必須設定為 force 才會取得 refresh token  -- https://stackoverflow.com/questions/8942340/get-refresh-token-google-api
            + "&include_granted_scopes=true"
            + "&access_type=offline"
        );
    }
});

routerSignInHandler.get('/', ctx => {
    try {
        ctx.body = {
            msg: 'please provide a signin type.'
        }
    } catch (error) {
        Util.setError(ctx, error);
    }
});

routerSignin.use('/signin', routerSignInHandler.routes());


//以上各種登入方式取得登入帳號的資料後都會統一將資料傳入這個function進行帳號資料建立
const finish = async (
    ctx: ParameterizedContext
    , sso_source: string            //ldap
    , sso_identity: string          //70bd09d6-c2c9-1038-85f3-f7d071544324
    , sso_refresh_token: string     //
    , sso_user_name: string         //gekalus@hotmail.com
    , sso_first_name: string        //潘明輝
    , sso_last_name: string         //
    , sso_email: string
) => {
    //1. 寫入 DB
    //2. 寫入 session.
    const userInfo = {
        signinType: 'google',
        email: sso_email,
        given_name: sso_first_name,
        family_name: sso_last_name,
        sso_identity: sso_identity,
        user_id: sso_user_name
    }
    if (ctx.session) {
        ctx.session.userInfo = userInfo;
    }

    //3. redirect back to client.
    ctx.redirect("/");

}


export default routerSignin;