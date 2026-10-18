import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import { configuration, parseInput, preparePhoto, buildMasks, compositeResult, reservationKeys, reserve, generateImage, readSwitch, sameOrigin, verifyChallenge } from '../lib/visualizerServer.ts';
import { validRegions, fitPhoto, renderSize } from '../lib/visualizer.ts';
import { issueSessionCookie } from '../lib/session.ts';
import handler from '../api/visualizer.ts';
import adminHandler from '../api/admin/visualizer.ts';

const initialEnv = { ...process.env };
const resource = cloudinary.api.resource;
const upload = cloudinary.uploader.upload;
afterEach(() => { process.env = { ...initialEnv }; cloudinary.api.resource = resource; cloudinary.uploader.upload = upload; });
const regions = [{exclude:false, points:[{x:.2,y:.4},{x:.8,y:.4},{x:.8,y:.8},{x:.2,y:.8}]}];
const photo = await sharp({create:{width:512,height:512,channels:3,background:'#204060'}}).jpeg().toBuffer();
const body = () => ({ requestId: randomUUID(), slabId: 'stone-01-x235', photo: `data:image/jpeg;base64,${photo.toString('base64')}`, regions, consent:true });
const configured = () => {
  for (const name of ['OPENAI_API_KEY','VISUALIZER_REDIS_REST_TOKEN','ADMIN_SESSION_SECRET','CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET','TURNSTILE_SECRET_KEY','TURNSTILE_SITE_KEY']) process.env[name] = 'test-only';
  process.env.VISUALIZER_REDIS_REST_URL = 'https://test-only.upstash.io'; process.env.VISUALIZER_DAILY_LIMIT = '10'; process.env.VISUALIZER_MONTHLY_LIMIT = '100';
};
const response = () => ({ code:0, headers:{}, body:null, setHeader(k,v){this.headers[k]=v;}, status(n){this.code=n;return this;}, json(b){this.body=b;return this;}, send(b){this.body=b;return this;} });
const request = (method='POST', overrides={}) => ({ method, query:{}, headers:{host:'site.example',origin:'https://site.example','content-type':'application/json','x-forwarded-for':'203.0.113.1'}, body:body(), ...overrides });

test('configuration is closed until credentials, durable quotas and safe daily/monthly caps exist', () => {
  process.env = {};
  assert.equal(configuration().configured, false);
  configured(); assert.equal(configuration().configured, true);
  for(const bad of ['0','-1','501','NaN','1.5']) {process.env.VISUALIZER_DAILY_LIMIT=bad;assert.equal(configuration().configured,false);}
  process.env.VISUALIZER_DAILY_LIMIT='20';process.env.VISUALIZER_REDIS_REST_URL='http://localhost:9000';assert.equal(configuration().configured,false);
});
test('validates selection geometry, slab allowlist, consent and input formats', () => {
  assert.ok(validRegions(regions));
  assert.equal(validRegions([{...regions[0],exclude:true}]),false);
  assert.equal(validRegions([{...regions[0],points:[{x:Infinity,y:0},{x:1,y:0},{x:1,y:1}]}]),false);
  assert.equal(validRegions([{...regions[0],points:[{x:0,y:0},{x:.5,y:.5},{x:1,y:1}]}]),false);
  for (const change of [{slabId:'../../secret'},{photo:'https://attacker.example/image.jpg'},{photo:'data:image/svg+xml;base64,AAA='},{consent:false},{requestId:'hello'}]) assert.throws(()=>parseInput({...body(),...change}));
  assert.equal(parseInput(body()).slab.id,'stone-01-x235');
  assert.deepEqual(fitPhoto(3000,2000),{width:1536,height:1024});
  for(const [w,h] of [[256,256],[512,512],[1536,512],[400,800],[1536,1024]]) {const size=renderSize(w,h);assert.ok(size.width*size.height>=655360);assert.equal(size.width%16,0);assert.equal(size.height%16,0);}
});
test('same-origin mutations reject cross-origin or missing origins', () => {
  assert.equal(sameOrigin(request()),true);
  assert.equal(sameOrigin({headers:{host:'site.example',origin:'https://other.example'}}),false);
  assert.equal(sameOrigin({headers:{host:'site.example'}}),false);
});
test('server decodes uploads instead of trusting declared mime; metadata is stripped', async () => {
  await assert.rejects(preparePhoto(Buffer.from('not an image')));
  const input = await sharp(photo).withMetadata({exif:{IFD0:{Artist:'private-name'}}}).jpeg().toBuffer();
  const prepared=await preparePhoto(input); const meta=await sharp(prepared.photo).metadata();
  assert.equal(meta.exif,undefined); assert.equal(prepared.width,512);
  await assert.rejects(preparePhoto(await sharp({create:{width:100,height:100,channels:3,background:'red'}}).png().toBuffer()));
});
test('mask excludes fixtures, rejects empty/oversized edits and composites only selected surfaces', async () => {
  const hole={exclude:true,points:[{x:.45,y:.5},{x:.55,y:.5},{x:.55,y:.7},{x:.45,y:.7}]};
  const {mask,coverage}=await buildMasks(512,512,[...regions,hole]);
  const at=(x,y)=>coverage[y*512+x];
  assert.equal(at(20,20),0); assert.equal(at(150,250),255); assert.equal(at(256,300),0);
  const alpha=await sharp(mask).ensureAlpha().raw().toBuffer();
  assert.equal(alpha[(250*512+150)*4+3],0); assert.equal(alpha[(20*512+20)*4+3],255);
  await assert.rejects(buildMasks(512,512,[{exclude:false,points:[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}]}]));
  await assert.rejects(buildMasks(512,512,[regions[0],{...regions[0],exclude:true}]));
  const edited=await sharp({create:{width:512,height:512,channels:3,background:'#d04020'}}).png().toBuffer();
  const output=await compositeResult(photo,edited,coverage,512,512);
  const pixels=await sharp(output).raw().toBuffer();
  const pixel=(x,y)=>[...pixels.subarray((y*512+x)*3,(y*512+x)*3+3)];
  assert.ok(pixel(20,20)[2]>80); assert.ok(pixel(256,300)[2]>80); assert.ok(pixel(150,250)[0]>180);
});
test('duplicate identifiers are stable and never contain source data or IP', async () => {
  configured();const input=parseInput(body());
  const a=reservationKeys('203.0.113.1',input,new Date('2026-10-18T12:00:00Z'));
  const b=reservationKeys('203.0.113.1',{...input,requestId:randomUUID()},new Date('2026-10-18T13:00:00Z'));
  assert.equal(a[1],b[1]);assert.notEqual(a[0],b[0]);assert.ok(!a.join().includes('203.0.113.1'));
  await reserve('203.0.113.1',input,async(url,opts)=>{const payload=JSON.parse(opts.body);assert.equal(payload[0],'EVAL');assert.equal(payload[2],5);assert.equal(payload.at(-2),10);assert.equal(payload.at(-1),100);return new Response(JSON.stringify({result:'ok'}));});
  for(const code of ['quota','quota_month','duplicate']) await assert.rejects(reserve('ip',input,async()=>new Response(JSON.stringify({result:code}))),error=>error.message===code);
  await assert.rejects(reserve('ip',input,async()=>{throw new Error('offline');}),error=>error.status===503);
});
test('provider receives kitchen first, actual selected slab second, mask and fixed parameters', async () => {
  configured(); const input=parseInput(body());const prepared=await preparePhoto(input.photo);const {mask}=await buildMasks(512,512,regions);
  const result=await generateImage(input,prepared,mask,'ip',async(url,opts)=>{
    assert.equal(url,'https://api.openai.com/v1/images/edits');const payload=JSON.parse(opts.body);
    assert.equal(payload.images.length,2);assert.ok(payload.images[0].image_url.startsWith('data:image/jpeg;base64,'));assert.ok(payload.images[1].image_url.length>100000);
    assert.ok(payload.mask.image_url.startsWith('data:image/png;base64,'));assert.equal(payload.n,1);assert.equal(payload.quality,'high');assert.equal(payload.size,'816x816');assert.equal(payload.safety_identifier.length,64);
    return new Response(JSON.stringify({data:[{b64_json:photo.toString('base64')}]}));
  }); assert.ok(result.equals(photo));
  await assert.rejects(generateImage(input,prepared,mask,'ip',async()=>new Response('secret upstream error',{status:429})),error=>error.message==='generation_failed');
});
test('missing switch defaults OFF; unavailable settings do not enable the feature', async () => {
  cloudinary.api.resource=async()=>{throw {http_code:404};};assert.equal(await readSwitch(),false);
  cloudinary.api.resource=async()=>{throw new Error('offline');};await assert.rejects(readSwitch());
});
test('bot verification rejects expired, replayed, wrong-host and wrong-action tokens before generation', async () => {
  configured();
  await assert.rejects(verifyChallenge('', 'site.example', 'ip'));
  for (const data of [{success:false},{success:true,hostname:'attacker.example',action:'kitchen-visualizer'},{success:true,hostname:'site.example',action:'login'}]) {
    await assert.rejects(verifyChallenge('token', 'site.example', 'ip', async()=>new Response(JSON.stringify(data))),error=>error.message==='verification_required');
  }
  await verifyChallenge('token','site.example','ip',async(url,opts)=>{assert.equal(url,'https://challenges.cloudflare.com/turnstile/v0/siteverify');assert.equal(JSON.parse(opts.body).response,'token');return new Response(JSON.stringify({success:true,hostname:'site.example',action:'kitchen-visualizer'}));});
});
test('public status and generation are off without configuration; preview requires signed owner cookie', async () => {
  process.env={ADMIN_SESSION_SECRET:'test-only'};
  let res=response();await handler(request('GET'),res);assert.deepEqual(res.body,{enabled:false,preview:false});assert.match(res.headers['Cache-Control'],/no-store/);
  res=response();await handler(request('GET',{query:{preview:'1'}}),res);assert.equal(res.body.preview,false);
  const headers={...request().headers,cookie:issueSessionCookie('test-only')};res=response();await handler(request('GET',{headers,query:{preview:'1'}}),res);assert.equal(res.body.preview,true);
  res=response();await handler(request(),res);assert.equal(res.code,503);
});
test('disabled switch rejects direct paid requests even when all services are configured', async () => {
  configured();cloudinary.api.resource=async()=>({context:{custom:{enabled:'false'}}});
  const res=response();await handler(request(),res);assert.equal(res.code,403);assert.equal(res.body.error,'disabled');
});
test('admin switch requires authentication and same-origin; OFF works without AI credentials', async () => {
  process.env={ADMIN_SESSION_SECRET:'test-only'};let enabled=true;
  cloudinary.api.resource=async()=>({context:{custom:{enabled:String(enabled)}}});
  cloudinary.uploader.upload=async(data,options)=>{enabled=options.context.enabled==='true';assert.equal(options.public_id,'shayish/settings/kitchen-visualizer.json');assert.ok(!options.public_id.includes('/gallery/'));return {};};
  let res=response();await adminHandler(request('POST',{body:{enabled:false}}),res);assert.equal(res.code,401);
  const headers={...request().headers,cookie:issueSessionCookie('test-only')};
  res=response();await adminHandler(request('POST',{headers:{...headers,origin:'https://attacker.example'},body:{enabled:false}}),res);assert.equal(res.code,403);
  res=response();await adminHandler(request('POST',{headers,body:{enabled:false}}),res);assert.equal(res.code,200);assert.equal(enabled,false);
  res=response();await adminHandler(request('POST',{headers,body:{enabled:true}}),res);assert.equal(res.code,409);assert.equal(enabled,false);
  configured();res=response();await adminHandler(request('POST',{headers,body:{enabled:true}}),res);assert.equal(res.code,200);assert.equal(enabled,true);
});
