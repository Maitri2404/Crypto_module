const crypto = require("crypto");
const fs = require("fs");
const http = require("http");


const server = http.createServer((req, res) => {
    let body = "";
    if (req.method === 'POST' && req.url === '/login') {
        req.on('error', (err) => {
            res.end(`Error: ${err.message}`);
        });
        req.on("data", (chunk) => {
            body += chunk;
        });
        req.on("end", () => {
            const parsed = JSON.parse(body);
            const { username, password } = parsed;
            if (username && password) {
                try {
                    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
                    const user = { username, password: hashedPassword };
                    const content = fs.readFileSync("cryptodata.json");
                    const users = JSON.parse(content)
                    users.data.push(user);
                    fs.writeFileSync("cryptodata.json", JSON.stringify(users));
                    res.end("Successfully logged in!!");
                }
                catch (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end("Internal server error");
                }
            } else {
                res.statusCode = 400;
                res.end('Bad request...Invalid username or password');
            }
        });
    }
    else {
        res.statusCode = 404;
        res.end("Error 404...Not Found");
    }
});

server.listen(3000, () => {
    console.log(`listening on port 3000...`)
});