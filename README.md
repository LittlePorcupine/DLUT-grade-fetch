# DLUT Grade Checker

这是一个可部署到 Vercel 的成绩查询工具。用户输入 `idToken` 和 `SERVERNAME` 后，页面会通过 Vercel Serverless Function 代理请求教务系统接口并展示课程成绩。

## 部署

1. 将代码推送到 GitHub 并在 Vercel 上新建项目。
2. 默认配置即可完成部署，静态文件位于 `public/`，函数位于 `api/`。

## 使用

打开部署后的页面，输入从教务系统获得的 `idToken` 以及 `SERVERNAME`（如 `c4`），点击“获取成绩”即可在页面查看成绩并可下载完整 JSON 数据。

请注意保护好个人 `idToken`，本工具不保存任何输入信息。
