# 功能
create-code-template是一个脚手架，通过模版文件夹中的文件，在目标文件夹中生成对应的文件。

# 用法
在你想要生成的文件夹中打开，并且在前端项目根文件中，创建一个模版文件夹，文件夹中的文件是你想要的模版文件以及代码。（注意，模版文件夹的目录位置要与package.json在同一级目录）
```
npm i create-code-template -g
create-code-template --template template
```

```
npx create-code-template --template template
```

## 配置项
| 参数名 | 可选值 | 含义 | 默认值 |
| ----- | ----- | --- | --- |
| -template --template | any / 空 | 模版文件夹的文件夹名称 | template |

