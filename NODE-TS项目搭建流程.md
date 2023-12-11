# npm 项目初始化

1. npm init -y # 项目初始化

# typescript安装与vscode ts调试

1. pnpm i typescript -D # 安装typescript
2. npx tsc --init # 生成tsconfig配置

```json
{
  "outDir": "./build",
  "paths": {
    "*": ["src/*"]
  },
  "baseUrl": "./",
  "sourceMap": true // 方便断点调试
}
```

3. pnpm i @types/node -D # node ts的类型包
4. npm install -D ts-node # 安装ts-node,用于调试，它可以不编译直接运行ts代码
5. vscode 安装Typescript Debugger
6. 打开vscode左侧调试面板，点击创建launch.json文件，选择typescript

```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "ts-node",
      "type": "node",
      "request": "launch",
      "args": [
        "${workspaceFolder}\\src\\index.ts" //路径位置
      ],
      "runtimeArgs": [
        // 反方向执行
        "-r",
        "ts-node/register"
      ],
      "cwd": "${workspaceRoot}",
      "protocol": "inspector",
      "internalConsoleOptions": "openOnSessionStart"
    }
  ]
}
```

7. 配置生效可以愉快调试了

# Eslint、Prettier

1. npx eslint --init
2. pnpm i prettier -D
3. 配置.prettierrc.js

```javascript
module.exports = {
  // 一行最多 80 字符
  printWidth: 80,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用 tab 缩进，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号代替双引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾使用逗号
  trailingComma: 'all',
  // 大括号内的首尾需要空格 { foo: bar }
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: 'always',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 lf
  endOfLine: 'lf',
};
```

4. vscode 设置进行配置错误提示和自动保存修复

```javascript
{
  /* eslint配置和prettier配置相关 begin */
  // 1. 识别ts、tsx文件,并设置保存自动修复
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript"],
  "typescript.tsdk": "node_modules/typescript/lib",
  "eslint.migration.2_x": "off",
  // 2. 配置Prettier 插件
  "files.eol": "\n",
  "editor.tabSize": 4,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
  /* eslint配置和prettier配置相关 over */
}
```

# 解决eslint和prettier冲突的方法

1. 链接：https://github.com/prettier/eslint-config-prettier
2. pnpm install --save-dev eslint-config-prettier
3. .eslintrc.js 添加如下prettier,放到最后哦：

```json
{
  "extends": ["some-other-config-you-use", "prettier"]
}
```

# husky 实现 git代码提交自动检测

1. npx husky-init
2. pnpm i -D lint-staged
3. 新建.lintstagedrc,写入

```JSON
{
  "src/**/*.{ts}": ["eslint"]
}

```

4. .husky/pre-commit修改

```shell
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
echo "即将进行代码检测"
npx lint-staged

```

5. .husky/pre-commit修改
6. pnpm install --save-dev @commitlint/config-conventional @commitlint/cli
7. .husky/commit-msg修改

```shell
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
echo "提交msg检查"
npm run commitlint

```
