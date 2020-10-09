一个用于在页面预览office文档的Demo，基于[gotenberg](https://github.com/thecodingmachine/gotenberg)和[pdfjs](https://github.com/mozilla/pdfjs-dist)进行开发。

实现流程为将获取的office文件传输到Gotenberg服务器转换成pdf文件，再将pdf文件显示在页面上。

# 运行环境

- Gotenberg的端口映射在 Docker 宿主机的3010上。

    如在本地环境中运行以下命令（不包括命令提示符`$`）：
    
    ```shell
    $ docker run -dp 3010:3000 --name gotenberg_6 thecodingmachine/gotenberg:6
    ```

# 使用方式

- `npm install`

    安装依赖。

- `npm start`

    启动测试服务。
