// Loopback-only UI harness. Cloudinary is stubbed; paid generation stays OFF.
// Run: node --experimental-strip-types scripts/preview-visualizer.mjs
import { createServer } from 'vite';
import { v2 as cloudinary } from 'cloudinary';
import { issueSessionCookie } from '../lib/session.ts';
import publicHandler from '../api/visualizer.ts';
import adminHandler from '../api/admin/visualizer.ts';
if (process.env.NODE_ENV === 'production') throw new Error('Local preview only');
for (const key of ['OPENAI_API_KEY','VISUALIZER_REDIS_REST_URL','VISUALIZER_REDIS_REST_TOKEN','VISUALIZER_DAILY_LIMIT']) delete process.env[key];
process.env.ADMIN_SESSION_SECRET = 'local-preview-only-not-a-production-secret';
cloudinary.api.resource = async () => ({context:{custom:{enabled:'false'}}});
const server = await createServer({
  server: { host: '127.0.0.1', port: 3021, strictPort: true },
  plugins: [{name:'local-visualizer-preview',configureServer(server){
    server.middlewares.use(async (req,res,next)=>{
      const url=new URL(req.url,'http://localhost:3021');
      if(url.pathname==='/__visualizer-preview'){
        res.setHeader('Set-Cookie',issueSessionCookie(process.env.ADMIN_SESSION_SECRET).replace('; Secure',''));
        res.statusCode=302;res.setHeader('Location','/visualizer?preview=1');res.end();return;
      }
      const routes={'/api/visualizer':publicHandler,'/api/admin/visualizer':adminHandler};
      if(url.pathname==='/api/admin/session'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({authenticated:true}));return;}
      if(url.pathname==='/api/admin/list'){res.setHeader('Content-Type','application/json');res.end('{"items":[]}');return;}
      if(url.pathname==='/api/media'){res.setHeader('Content-Type','application/json');res.end('{"items":[]}');return;}
      if(!routes[url.pathname])return next();
      req.query=Object.fromEntries(url.searchParams);
      if(req.method==='POST'){let body='';for await(const chunk of req)body+=chunk;try{req.body=JSON.parse(body);}catch{req.body={};}}
      res.status=code=>{res.statusCode=code;return res;};res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));return res;};res.send=data=>{res.end(data);return res;};
      await routes[url.pathname](req,res);
    });
  }}],
});
await server.listen(); console.log('Local owner preview (generation OFF): http://localhost:3021/__visualizer-preview');
