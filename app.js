const express = require("express");
const { getConfig } = require("./server/config");
const path = require("path");

const app = express();
app.use(express.json({ extended: true }));
app.use("/api/area", require("./server/routes/area.routes"));

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "build")));
    app.get("*", (req, res) => {
        res.send(path.resolve(__dirname, "build", "index.html"));
    });
}

const { SERVER_PORT } = getConfig();
app.listen(SERVER_PORT, () => console.log(`App has been started on port ${SERVER_PORT}`));
