const express = require("express");
const basicAuth = require("express-basic-auth");
const app = express();
const port = 3000;

app.use(express.json());

app.use(
  basicAuth({
    users: { username: "password" },
    challenge: true,
    realm: "mobile",
  })
);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/test", (req, res) => {
  console.log("Got a request");
  console.log(req.body);

  res.send(JSON.stringify({ success: 1 }));
});

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
