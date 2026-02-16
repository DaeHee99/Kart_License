const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url || "/", true);
    const { pathname } = parsedUrl;

    // API 요청만 로깅 (상태 코드 + 응답 시간)
    if (pathname?.startsWith("/api")) {
      const startTime = Date.now();
      const method = req.method || "GET";

      res.on("finish", () => {
        const duration = Date.now() - startTime;
        const status = res.statusCode;
        const now = new Date().toLocaleString("ko-KR", {
          timeZone: "Asia/Seoul",
        });
        console.log(
          ` \x1b[90m${now}\x1b[0m \x1b[36m[API]\x1b[0m \x1b[32m${method}\x1b[0m ${pathname} \x1b[${status >= 400 ? "31" : "90"}m${status}\x1b[0m in ${duration}ms`,
        );
      });
    }

    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
