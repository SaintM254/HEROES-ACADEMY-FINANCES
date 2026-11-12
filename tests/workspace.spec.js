import { test, expect } from '@playwright/test';

const routes=['overview','analytics','students','fees','payroll','expenses','accounts','cbc','attendance','bursaries','transport','inventory','communications','reports','settings'];
const readState=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('aic-shanzu.workspace.v1')));
const closeDialog=async page=>{await page.getByRole('button',{name:'Close dialog'}).click();};
const goto=async(page,route)=>{await page.goto('/#'+route);await expect(page.locator('#main h1')).toBeVisible();};

test.beforeEach(async({page})=>{
  await page.addInitScript(()=>{window.print=()=>{window.__printed=document.querySelector('#print-area')?.innerText||'';};});
  await page.goto('/');
});

test('brand, crest, KSh currency, primary colour and single navigation',async({page})=>{
  await expect(page).toHaveTitle(/AIC Academy Shanzu/);
  await expect(page.locator('.brand')).toContainText('AIC Academy Shanzu');
  await expect(page.locator('.brand img')).toHaveAttribute('src','assets/crest-mark.svg');
  await expect(page.locator('.fee-card')).toContainText('KSh');
  await expect(page.locator('body')).not.toContainText('USD');
  expect(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--primary').trim())).toBe('#022269');
  await expect(page.locator('.topbar nav')).toHaveCount(0);
  await expect(page.locator('.header-tools [aria-label="Search"]')).toHaveCount(0);
  await expect(page.locator('.header-tools [aria-label="Open settings"]')).toBeVisible();
  await expect(page.locator('.nav-item').filter({hasText:'Students'})).toBeVisible();
});

test('every page renders without browser errors or horizontal overflow at three sizes',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [1440,768,390]){
    await page.setViewportSize({width,height:900});
    for(const route of routes){await goto(page,route);await expect(page.locator('#main h1')).not.toBeEmpty();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' at '+width).toBe(true);}
  }
  expect(errors).toEqual([]);
});

test('all runtime assets are local and the original crest loads',async({page})=>{
  const external=[];page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:3000'))external.push(r.url());});
  await page.reload();await expect(page.locator('.brand img')).toBeVisible();
  expect(await page.locator('.brand img').evaluate(i=>i.complete&&i.naturalWidth>0)).toBe(true);
  expect(await page.evaluate(()=>document.fonts.check('14px Outfit'))).toBe(true);
  expect(external).toEqual([]);
});

test('sidebar collapses, groups close, and preferences survive reload',async({page})=>{
  await page.getByRole('button',{name:'Collapse navigation'}).click();
  await expect(page.locator('body')).toHaveClass(/sidebar-collapsed/);
  await page.reload();await expect(page.locator('body')).toHaveClass(/sidebar-collapsed/);
  await page.getByRole('button',{name:'Expand navigation'}).click();
  await page.getByRole('button',{name:'Finance',exact:true}).click();
  await expect(page.locator('.nav-item').filter({hasText:'Fees & invoices'})).toBeHidden();
  await page.reload();await expect(page.locator('.nav-item').filter({hasText:'Fees & invoices'})).toBeHidden();
});

test('mobile navigation opens, navigates and closes',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Open navigation'}).click();
  await expect(page.locator('body')).toHaveClass(/mobile-open/);
  await page.locator('.nav-item').filter({hasText:'CBC assessments'}).click();
  await expect(page.locator('h1')).toHaveText('CBC assessments');
  await expect(page.locator('body')).not.toHaveClass(/mobile-open/);
});

test('universal search supports keyboard and opens learner and payment records',async({page})=>{
  await page.keyboard.press('Control+k');await page.getByRole('combobox').fill('Grace Wanjiru');
  await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();await expect(page.locator('#modal-content')).toContainText('Grace Wanjiru');await closeDialog(page);
  await page.locator('#global-search').fill('DEMO-00001');await page.keyboard.press('Enter');
  await expect(page.locator('#modal-title')).toHaveText('Payment record');await expect(page.locator('#modal-content')).toContainText('DEMO-00001');
  await page.getByRole('button',{name:'Print receipt',exact:true}).click();expect(await page.evaluate(()=>window.__printed)).toContain('Fee payment receipt');
});

test('chart period controls and change colours are driven by comparisons',async({page})=>{
  const bars=page.locator('[data-chart="collection"]');await expect(bars).toHaveCount(6);
  await expect(bars.nth(0)).toHaveClass(/flat/);await expect(bars.nth(1)).toHaveClass(/up/);await expect(bars.nth(2)).toHaveClass(/down/);
  await bars.nth(2).click();await expect(page.locator('#chart-detail-collection')).toContainText('Decrease');
  await page.getByRole('button',{name:'Monthly',exact:true}).click();await expect(page.locator('[data-chart="collection"]').first()).toHaveAttribute('aria-label',/^Jun/);
});

test('a payment updates the invoice, dashboard and account exactly once',async({page})=>{
  const before=await page.evaluate(()=>({collected:totals().collected,bank:accountBalance('M-Pesa'),balance:balance(invoice('INV-2026-003')),count:state.payments.length}));
  await page.getByRole('button',{name:'Record payment',exact:true}).click();
  await page.locator('#f-invoiceId').selectOption('INV-2026-003');await page.locator('#f-amount').fill('999999');await page.getByRole('button',{name:'Save payment',exact:true}).click();
  expect(await page.locator('#f-amount').evaluate(e=>e.validity.rangeOverflow)).toBe(true);await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('#f-amount').fill('1000');await page.locator('#f-reference').fill('TEST-MPESA-001');await page.getByRole('button',{name:'Save payment',exact:true}).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  const after=await page.evaluate(()=>({collected:totals().collected,bank:accountBalance('M-Pesa'),balance:balance(invoice('INV-2026-003')),count:state.payments.length}));
  expect(after.collected-before.collected).toBe(100000);expect(after.bank-before.bank).toBe(100000);expect(before.balance-after.balance).toBe(100000);expect(after.count).toBe(before.count+1);
  await page.reload();expect(await page.evaluate(()=>totals().collected)).toBe(after.collected);
});

test('admission, invoicing and full settlement work together',async({page})=>{
  await page.locator('.quick-action[data-action="add-student"]').click();await page.locator('#f-name').fill('Test Learner');await page.locator('#f-guardian').fill('Test Guardian');await page.locator('#f-grade').selectOption('PP1');await page.getByRole('button',{name:'Admit learner',exact:true}).click();
  const s=(await readState(page)).students.find(s=>s.name==='Test Learner');expect(s).toBeTruthy();
  await goto(page,'fees');await page.getByRole('button',{name:'New invoice',exact:true}).click();await page.locator('#f-studentId').selectOption(s.id);await page.locator('#f-amount').fill('5000');await page.getByRole('button',{name:'Issue invoice',exact:true}).click();
  const inv=(await readState(page)).invoices.find(i=>i.studentId===s.id);expect(inv.amount).toBe(500000);
  await page.getByRole('button',{name:'Record payment',exact:true}).click();await page.locator('#f-invoiceId').selectOption(inv.id);await page.locator('#f-reference').fill('TEST-FULL');await page.getByRole('button',{name:'Save payment',exact:true}).click();
  expect(await page.evaluate(id=>invoiceStatus(invoice(id)),inv.id)).toBe('Paid');
});

test('expenses validate funds and update the ledger',async({page})=>{
  await goto(page,'expenses');const before=await page.evaluate(()=>accountBalance('Cash'));
  await page.getByRole('button',{name:'Record expense',exact:true}).click();await page.locator('#f-description').fill('Test supplies');await page.locator('#f-amount').fill('10000000');await page.locator('#f-account').selectOption('Cash');await page.getByRole('button',{name:'Save expense',exact:true}).click();await expect(page.locator('.form-error')).toContainText('exceeds');
  await page.locator('#f-amount').fill('1250.50');await page.getByRole('button',{name:'Save expense',exact:true}).click();await expect(page.getByRole('dialog')).toBeHidden();expect(await page.evaluate(()=>accountBalance('Cash'))).toBe(before-125050);
});

test('payroll records one net salary expense and prints a payslip',async({page})=>{
  await goto(page,'payroll');const before=await page.evaluate(()=>({net:netPay(state.staff[0]),balance:accountBalance('Bank'),expenses:state.expenses.length}));
  await page.getByRole('button',{name:'Mark paid',exact:true}).first().click();await page.locator('#f-reference').fill('TEST-SALARY');await page.getByRole('button',{name:'Mark salary paid',exact:true}).click();
  const after=await readState(page);expect(after.expenses.length).toBe(before.expenses+1);expect(after.expenses.at(-1).amount).toBe(before.net);expect(await page.evaluate(()=>accountBalance('Bank'))).toBe(before.balance-before.net);
  await page.getByRole('button',{name:'Payslip',exact:true}).first().click();expect(await page.evaluate(()=>window.__printed)).toContain('Net pay:');
});

test('attendance saves and preserves unsaved marks when changing dates',async({page})=>{
  await goto(page,'attendance');const row=page.locator('tbody tr').first();await row.getByRole('button',{name:'Absent',exact:true}).click();await page.getByRole('button',{name:'Save register',exact:true}).click();
  expect((await readState(page)).attendance['2026-11-12']['AIC-0001']).toBe('Absent');
  await row.getByRole('button',{name:'Late',exact:true}).click();await page.locator('#attendance-date').fill('2026-11-10');await page.locator('#attendance-date').fill('2026-11-12');await expect(page.locator('tbody tr').first().getByRole('button',{name:'Late',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.reload();await expect(page.locator('tbody tr').first().getByRole('button',{name:'Absent',exact:true})).toHaveAttribute('aria-pressed','true');
});

test('CBC observations are saved and included in learner reports',async({page})=>{
  await goto(page,'cbc');await page.getByRole('button',{name:'Record assessment',exact:true}).click();await page.locator('#f-strand').fill('Test number recognition');await page.locator('#f-level').selectOption('EE');await page.locator('#f-comment').fill('Counts objects independently and explains the strategy.');await page.getByRole('button',{name:'Save observation',exact:true}).click();
  expect((await readState(page)).assessments.at(-1).level).toBe('EE');await page.getByRole('button',{name:'Report',exact:true}).first().click();expect(await page.evaluate(()=>window.__printed)).toContain('Test number recognition');
});

test('bursary approval is separate from a single disbursement',async({page})=>{
  await goto(page,'bursaries');const before=await page.evaluate(()=>balance(invoice('INV-2026-005')));
  await page.locator('[data-action="bursary-detail"][data-id="BUR-001"]').click();await page.getByRole('button',{name:'Record approval',exact:true}).click();await page.locator('#f-reference').fill('TEST-CDF-AWARD');await page.getByRole('button',{name:'Record approval',exact:true}).click();
  expect((await readState(page)).awards.find(a=>a.id==='BUR-001').status).toBe('Approved');expect(await page.evaluate(()=>balance(invoice('INV-2026-005')))).toBe(before);
  await page.locator('#f-reference').fill('TEST-CDF-PAID');await page.getByRole('button',{name:'Record disbursement',exact:true}).click();const after=await readState(page);expect(after.awards.find(a=>a.id==='BUR-001').status).toBe('Disbursed');expect(after.payments.filter(p=>p.reference==='TEST-CDF-PAID')).toHaveLength(1);expect(await page.evaluate(()=>balance(invoice('INV-2026-005')))).toBe(before-600000);
});

test('transport assignments and stock movements enforce limits',async({page})=>{
  await goto(page,'transport');await page.getByRole('button',{name:'Assign learner',exact:true}).click();await page.locator('#f-studentId').selectOption('AIC-0020');await page.locator('#f-route').selectOption('RT-01');await page.locator('#f-stop').fill('Test school gate');await page.getByRole('button',{name:'Save assignment',exact:true}).click();expect((await readState(page)).students.find(s=>s.id==='AIC-0020').route).toBe('RT-01');
  await goto(page,'inventory');await page.locator('[data-action="stock-move"][data-id="ITM-006"][data-direction="-1"]').click();await page.locator('#f-quantity').fill('8');await page.locator('#f-reason').fill('First aid station');await page.getByRole('button',{name:'Issue stock',exact:true}).click();expect((await readState(page)).stock.find(s=>s.id==='ITM-006').quantity).toBe(0);
  await page.locator('[data-action="stock-move"][data-id="ITM-006"][data-direction="1"]').click();await page.locator('#f-quantity').fill('5');await page.locator('#f-reason').fill('Replenishment');await page.getByRole('button',{name:'Receive stock',exact:true}).click();expect((await readState(page)).stock.find(s=>s.id==='ITM-006').quantity).toBe(5);
});

test('notices can be composed, prepared, copied and printed without sending',async({page})=>{
  await goto(page,'communications');await page.getByRole('button',{name:'Compose notice',exact:true}).click();await page.locator('#f-title').fill('Test parent notice');await page.locator('#f-template').selectOption('meeting');await expect(page.locator('#f-body')).toContainText('');expect(await page.locator('#f-body').inputValue()).toContain('parent and teacher meeting');await page.getByRole('button',{name:'Save notice',exact:true}).click();
  const m=(await readState(page)).messages.find(m=>m.title==='Test parent notice');await page.locator(`[data-action="message-detail"][data-id="${m.id}"]`).click();await page.getByRole('button',{name:'Mark prepared',exact:true}).click();expect((await readState(page)).messages.find(x=>x.id===m.id).status).toBe('Prepared');await page.getByRole('button',{name:'Print notice',exact:true}).click();expect(await page.evaluate(()=>window.__printed)).toContain('Test parent notice');
});

test('internal transfers conserve total balance',async({page})=>{
  await goto(page,'accounts');const before=await page.evaluate(()=>({total:totalBalance(),cash:accountBalance('Cash')}));await page.getByRole('button',{name:'Transfer funds',exact:true}).click();await page.locator('#f-to').selectOption('Cash');await page.locator('#f-amount').fill('1000');await page.locator('#f-reference').fill('Bank to cash test');await page.getByRole('button',{name:'Record transfer',exact:true}).click();expect(await page.evaluate(()=>totalBalance())).toBe(before.total);expect(await page.evaluate(()=>accountBalance('Cash'))).toBe(before.cash+100000);
});

test('settings persist, CSV exports, and backup import requires confirmation',async({page})=>{
  await goto(page,'settings');await page.locator('#admin-name').fill('Ms. Test Administrator');await page.getByRole('button',{name:'Save school profile',exact:true}).click();await page.reload();await expect(page.locator('#admin-name')).toHaveValue('Ms. Test Administrator');await goto(page,'overview');await expect(page.locator('h1')).toContainText('Ms. Test Administrator');await goto(page,'settings');
  const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export workspace backup',exact:true}).click();const dl=await downloadPromise;expect(dl.suggestedFilename()).toMatch(/backup.*json/);const stream=await dl.createReadStream();let text='';for await(const chunk of stream)text+=chunk;const backup=JSON.parse(text);expect(backup.students).toHaveLength(24);
  await page.locator('#import-file').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(text)});await expect(page.locator('#modal-title')).toHaveText('Replace this workspace?');await page.getByRole('button',{name:'Replace & import',exact:true}).click();await expect(page.getByRole('dialog')).toBeHidden();expect((await readState(page)).settings.admin).toBe('Ms. Test Administrator');
});

test('CSV is Excel-safe and every report prints',async({page})=>{
  expect(await page.evaluate(()=>csvCell('=HYPERLINK("bad")'))).toBe('"\'=HYPERLINK(""bad"")"');
  await goto(page,'reports');for(const type of ['overview','fees','payments','expenses','payroll','attendance','cbc','bursaries']){await page.locator(`[data-action="print-report"][data-type="${type}"]`).click();expect(await page.evaluate(()=>window.__printed)).not.toBe('');}
  const dlPromise=page.waitForEvent('download');await page.locator('[data-action="export"][data-type="fees"]').click();expect((await dlPromise).suggestedFilename()).toMatch(/fees.*csv/);
});

test('notifications, reset confirmation and unknown routes are handled',async({page})=>{
  await page.getByRole('button',{name:'Notifications',exact:true}).click();await expect(page.locator('#notifications')).toContainText('outstanding fees');await page.getByRole('button',{name:'Mark all read',exact:true}).click();await expect(page.locator('#notification-dot')).toBeHidden();
  await goto(page,'settings');await page.getByRole('button',{name:'Restore sample workspace',exact:true}).click();await page.locator('#f-confirm').fill('RESET');await page.getByRole('button',{name:'Restore sample data',exact:true}).click();expect((await readState(page)).settings.admin).toBe('Ms. Amani Mwangi');
  await page.goto('/#missing-page');await expect(page.locator('h1')).toHaveText('Page not found');
});
