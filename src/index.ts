import app from './app';
import {db} from './models/index'
import dotenv from 'dotenv';
import {awtingChangesAndGetAllPosts} from "./routes/api_V1_route";
import {Server} from 'ws';
import {Post} from "./models/modelsDb";

const port: number = process.env.NODE_LOCAL_PORT ? parseInt(process.env.NODE_LOCAL_PORT) : 3001;
const portWs: number = process.env.WS_LOCAL_PORT ? parseInt(process.env.WS_LOCAL_PORT) : 3000;
dotenv.config();


const table = 'posts';

async function read(needPage: string | any, revert: string | any): Promise<{ items: Post[] } | undefined> {
    try {
        return {items: await awtingChangesAndGetAllPosts(needPage, revert)};
    } catch (e) {
        console.log(e);
    }
}
const routing = {
    posts: {
        getPosts(args: string []): Promise<{ items: Post[] } | undefined> {
            return read(args[0], args[1]);
        },
    },
};

db.sequelize.sync({force: false}).then((): void => {
    const ws = new Server({port: portWs});
    ws.on('connection', (connection, req): void => {
        connection.on('message', async (message) => {
            const {name, method, args = []} = JSON.parse(message);
            if (typeof name !== "string") throw new Error('We work with table posts')
            const entity = routing[name];
            if (!entity) return connection.send('"Not found"', {binary: false});
            const handler = entity[method];
            if (!handler) return connection.send('"Not found"', {binary: false});

             /*const json = JSON.stringify(args);
             const parameters = json.substring(1, json.length - 1);
             console.log('ip name.method (parameters)-', `${req.socket.remoteAddress} ${name}.${method}(${parameters})`);*/
            try {
                const result = await handler(...args);
                connection.send(JSON.stringify(result), {binary: false});
            } catch (err) {
                console.dir({err});
                connection.send('"Server error"', {binary: false});
            }
        });
    });

    app.listen(port, () => {
        console.log(`Server is running on port: ${port}*-*websocket on port ${portWs}`);
    });
});

