"use strict";

const PORT = process.env.PORT || 8080;
const config = require('./config');

const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const bouncer = require('koa-bouncer');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport(config.sender);
const nunjucks = require('nunjucks');
const path = require('path');

const app = new koa();
const api = new Router({
    prefix: '/api'
});

api
    .post('/feedback', async (ctx, next) => {

        ctx.validateBody('site')
            .required('"site" is required')
            .isString()
            .trim();

        ctx.validateBody('email')
            .required('"email" is required')
            .isLength(4, 80, '"email" must be 4-80 chars')
            .trim()
            .isEmail('"email" must be a valid email address');

        ctx.validateBody('text')
            .required('"text" is required')
            .isString()
            .isLength(4, 1000, '"text" must be 4-1000 chars')
            .trim();

        console.log(ctx.vals);

        let mail = await transporter.sendMail({
            from: config.sender.auth.user,
            to: config.receiver.email,
            subject: config.receiver.subject(ctx.vals.site),
            html: nunjucks.render(path.join(__dirname, 'feedback.html'), ctx.vals)
        });

        console.log(mail);

        ctx.body = {message: "Feedback send successful"};
    })
    .all('/*', (ctx, next) => {
        ctx.status = 404;
        ctx.body = {message: "Not found"};
    });

// error handler
app
    .use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = err.status || typeof (err.code) === "number" ? err.code : 400;
            ctx.body = {message: err.message};
        }
    });

app
    .use(bodyParser())
    .use(bouncer.middleware())
    .use(api.routes())
    .use(api.allowedMethods());

app
    .use( (ctx) => {
        ctx.status = 404;
        ctx.body = {message: "Not found"};
    });

app.listen(PORT, () => {
    console.log(`Koa server started on port ${PORT}`);
});