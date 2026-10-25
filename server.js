import express from 'express';
import { createServer } from 'node:http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'node:path';

const app = express();
const server = createServer(app);
const __dirname = path.resolve();

// Serve your custom purple UI homepage out of the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Intercept routing requests and stream data raw
app.use('/stream', createProxyMiddleware({
    router: (req) => {
        let target = req.query.url;
        if (!/^https?:\/\//i.test(target)) target = 'https://' + target;
        return target;
    },
    changeOrigin: true,
    pathRewrite: (path, req) => {
        return ''; 
    },
    onProxyRes: (proxyRes, req, res) => {
        // Strip out frame protections to stop connection loops
        delete proxyRes.headers['x-frame-options'];
        delete proxyRes.headers['content-security-policy'];
        proxyRes.headers['access-control-allow-origin'] = '*';
    },
    onError: (err, req, res) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy Route Error: ' + err.message);
    }
}));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`proxe-backend engine is running on port ${PORT}`);
});
