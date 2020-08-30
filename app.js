const express = require("express");
const path = require("path");
const { getConfig } = require("./server/config");
const errorHandler = require("./server/middlewares/error-handler");

const { SERVER_PORT } = getConfig();
const app = express();

app.use(express.json({ extended: true }));
app.use("/api/area", require("./server/routes/area.routes"));
app.use("/api/zone", require("./server/routes/zone.routes"));
app.use("/api/grid", require("./server/routes/grid.routes"));

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static(path.join(__dirname, "build")));
    app.get("*", (req, res) => {
        res.send(path.resolve(__dirname, "build", "index.html"));
    });
}

// app.use(errorHandler);

app.listen(SERVER_PORT, () => console.log(`App has been started on port ${SERVER_PORT}`));
