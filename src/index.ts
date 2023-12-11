const koa = require('koa');
console.log('hello word');

const t = 3;

console.log(t);

const app = new koa();

//配置中间件
app.use(async (ctx: any) => {
  ctx.body = 'hello koa2';
});

//监听端口
app.listen(3000);
