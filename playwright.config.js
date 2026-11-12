import { defineConfig } from '@playwright/test';
import chromium, { inflate } from '@sparticuz/chromium';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';
const bin=resolve(import.meta.dirname,'node_modules/@sparticuz/chromium/bin');
await inflate(resolve(bin,'al2023.tar.br'));
const executablePath=process.env.CHROMIUM_PATH||await chromium.executablePath(bin);
// The serverless build's --single-process flag crashes when Playwright opens a fresh context per test.
const args=chromium.args.filter(arg=>arg!=='--single-process');
export default defineConfig({
  testDir:'./tests',fullyParallel:false,workers:1,timeout:30000,retries:0,
  reporter:'list',outputDir:'test-results',
  use:{baseURL:'http://127.0.0.1:3000',viewport:{width:1440,height:1000},headless:true,
    launchOptions:{executablePath,args,env:{...process.env,LD_LIBRARY_PATH:[resolve(tmpdir(),'al2023/lib'),tmpdir(),process.env.LD_LIBRARY_PATH||''].join(':')}},
    screenshot:'only-on-failure',trace:'retain-on-failure'},
  webServer:{command:'npm run dev',url:'http://127.0.0.1:3000',reuseExistingServer:!process.env.CI,timeout:15000}
});
