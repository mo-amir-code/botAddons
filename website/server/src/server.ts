import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import process from "node:process";
import { app } from "./app.js";
import { APP_PORT, ENVIRONMENT } from "./config/constants.js";

const numCPUs = availableParallelism();

if (cluster.isPrimary && ENVIRONMENT !== "VERCEL_PRODUCTION") {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    app.listen(APP_PORT, () => {
        console.log(
            `Server started running at PORT ${APP_PORT} with PID ${process.pid}`
        );
    });
}