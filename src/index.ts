import { rewriteImport } from './utils';
import path from 'path';
import fs from 'fs';
import Koa from 'koa';
import { parse } from '@vue/compiler-sfc';
import { compile } from '@vue/compiler-dom';
const app: Koa = new Koa();
const ENV = 'demo';
// 用户启动路径
const userPath: string = process.cwd();
//配置中间件
app.use(async (ctx: Koa.Context) => {
  const { url, query } = ctx.request;
  if (url === '/') {
    ctx.body = fs.readFileSync(
      path.join(userPath, ENV, './public/index.html'),
      'utf8',
    );
    ctx.type = 'text/html';
  } else if (url.endsWith('.js')) {
    const p = path.join(userPath, ENV, './src', url);
    ctx.body = rewriteImport(fs.readFileSync(p, 'utf8'));
    ctx.type = 'application/javascript';
  } else if (url.startsWith('/@modules/')) {
    // 处理npm包导入
    const folderPath = path.join(userPath, 'node_modules', url.slice(10));
    const packageJSON: Record<string, any> = JSON.parse(
      fs.readFileSync(path.join(folderPath, 'package.json'), 'utf-8'),
    );
    const entryFile: string | undefined = packageJSON.module;
    if (!entryFile) {
      console.error('无法识别该库', folderPath);
      return;
    }
    console.log(path.join(folderPath, entryFile));
    ctx.body = rewriteImport(
      fs.readFileSync(path.join(folderPath, entryFile), 'utf-8'),
    );
    ctx.type = 'application/javascript';
  } else if (url.indexOf('.vue') > -1) {
    //处理vue模板转换
    // 路径
    const vueName = url.split('?')[0];
    const p = path.join(userPath, ENV, './src', vueName);
    // .vue转译为SFC
    const sfc = parse(fs.readFileSync(p, 'utf8'));
    if (!query.type) {
      // 获取脚本内容
      const scriptContent = sfc.descriptor.script?.content;
      console.log(scriptContent);
      // 替换默认导出为一个常量
      const script = rewriteImport(
        scriptContent?.replace('export default ', 'const __script = ') || '',
      );
      ctx.type = 'text/javascript';
      ctx.body = `
        ${script}
        // url解析
        import {render as __render} from '${vueName}?type=template'
        __script.render = __render
        export default __script
      `;
    } else if (query.type === 'template') {
      const tpl = sfc.descriptor.template?.content;
      const render = compile(tpl || '<div></div>', { mode: 'module' }).code;
      ctx.type = 'application/javascript';
      ctx.body = rewriteImport(render);
    }
  }
});

//监听端口
app.listen(3000, () => {
  console.log('http://127.0.0.1:3000/');
});
