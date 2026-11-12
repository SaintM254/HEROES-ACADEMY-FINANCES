/* Fictional demonstration records. All monetary values are integer cents. */
window.AIC = (() => {
  const DAY = '2026-11-12';
  const names = [
    ['Grace Wanjiru','Grade 7','Bahari','Mary Wanjiru'],
    ['Daniel Otieno','Grade 5','Kijani','James Otieno'],
    ['Amina Hassan','Grade 9','Bahari','Fatuma Hassan'],
    ['Brian Mwangi','Grade 3','Kijani','Peter Mwangi'],
    ['Neema Kazungu','Grade 8','Bahari','Alice Kazungu'],
    ['Ethan Mutiso','Grade 6','Kijani','Joyce Mutiso'],
    ['Zawadi Charo','Grade 4','Bahari','Safari Charo'],
    ['Samuel Karisa','Grade 9','Kijani','Esther Karisa'],
    ['Favour Achieng','Grade 2','Bahari','Rose Achieng'],
    ['Ian Baya','Grade 1','Kijani','David Baya'],
    ['Malkia Nyale','Grade 7','Kijani','Janet Nyale'],
    ['Joshua Kenga','Grade 5','Bahari','Mercy Kenga'],
    ['Joy Nekesa','Grade 3','Bahari','Paul Nekesa'],
    ['Caleb Mwakio','Grade 8','Kijani','Lydia Mwakio'],
    ['Esther Wambui','PP2','Bahari','Simon Wambui'],
    ['Ali Omar','PP1','Kijani','Halima Omar'],
    ['Sharon Njeri','Grade 6','Bahari','John Njeri'],
    ['Victor Ochieng','Grade 4','Kijani','Beatrice Ochieng'],
    ['Tumaini Masha','Grade 2','Kijani','Anna Masha'],
    ['Eli Baraka','Grade 1','Bahari','Grace Baraka'],
    ['Linet Chai','PP2','Kijani','Joseph Chai'],
    ['Noel Katana','PP1','Bahari','Martha Katana'],
    ['Ruth Ndinda','Grade 7','Bahari','Stephen Ndinda'],
    ['Abel Mwadime','Grade 9','Kijani','Sarah Mwadime']
  ];
  const fractions = [1,.75,.5,1,0,.65,.8,1,.5,0,.75,1,.6,.5,1,.8,0,.7,1,.5,.6,1,.9,0];
  const routes = [
    {id:'RT-01',name:'Shanzu – Mtwapa',area:'Mtwapa, Kengeleni and Shanzu',capacity:14,fare:350000,driver:'Demo driver · contact not set'},
    {id:'RT-02',name:'Shanzu – Bamburi',area:'Bamburi, Utange and Kiembeni',capacity:14,fare:400000,driver:'Demo driver · contact not set'},
    {id:'RT-03',name:'Shanzu – Kisauni',area:'Kisauni, Mwandoni and Magogoni',capacity:12,fare:380000,driver:'Demo driver · contact not set'}
  ];
  const students = names.map((n,i) => ({id:`AIC-${String(i+1).padStart(4,'0')}`,name:n[0],grade:n[1],stream:n[2],guardian:n[3],phone:'',status:'Active',admission:'2026-01-05',route:i<15?routes[i%3].id:'',stop:i<15?['Shanzu junction','Mtwapa stage','Bamburi estate'][i%3]:'',notes:''}));
  const invoices = students.map((s,i) => ({id:`INV-2026-${String(i+1).padStart(3,'0')}`,studentId:s.id,term:'Term 3',year:2026,description:'Tuition'+(s.route?' + school transport':'')+(i%2===0?' + lunch plan':''),amount:1850000+(s.route?350000:0)+(i%2===0?240000:0),issued:'2026-09-01',due:'2026-11-30'}));
  let serial = 0;
  const payments = [];
  invoices.forEach((inv,i) => {
    if (!fractions[i]) return;
    const amount = Math.round(inv.amount * fractions[i]);
    serial++;
    payments.push({id:`PAY-${String(serial).padStart(4,'0')}`,invoiceId:inv.id,studentId:inv.studentId,amount,date:`2026-11-${String(12-(i%11)).padStart(2,'0')}`,method:['M-Pesa','Bank','Cash','M-Pesa'][i%4],reference:`DEMO-${String(serial).padStart(5,'0')}`,account:['M-Pesa','Bank','Cash','M-Pesa'][i%4],note:'Fictional opening record'});
  });
  const awards = [
    {id:'BUR-001',studentId:students[4].id,amount:600000,source:'NG-CDF',status:'Requested',date:'2026-11-08',reference:'',paymentId:''},
    {id:'BUR-002',studentId:students[9].id,amount:450000,source:'County bursary',status:'Approved',date:'2026-11-10',reference:'DEMO-COUNTY-02',paymentId:''},
    {id:'BUR-003',studentId:students[16].id,amount:300000,source:'School bursary',status:'Disbursed',date:'2026-11-09',reference:'DEMO-SCHOOL-03',paymentId:'PAY-BUR-003'}
  ];
  payments.push({id:'PAY-BUR-003',invoiceId:invoices[16].id,studentId:students[16].id,amount:300000,date:'2026-11-09',method:'Bursary',reference:'DEMO-SCHOOL-03',account:'Bank',note:'School bursary disbursement'});
  const staff = [
    {id:'STF-001',name:'Amani Mwangi',role:'School administrator',gross:8500000,paye:1450000,nssf:216000,shif:23375,housing:127500,status:'Pending',paidDate:'',phone:''},
    {id:'STF-002',name:'Joseph Karisa',role:'Deputy head teacher',gross:7200000,paye:1120000,nssf:216000,shif:19800,housing:108000,status:'Pending',paidDate:'',phone:''},
    {id:'STF-003',name:'Lydia Achieng',role:'Teacher · Grade 7',gross:4800000,paye:480000,nssf:216000,shif:13200,housing:72000,status:'Pending',paidDate:'',phone:''},
    {id:'STF-004',name:'Peter Mutiso',role:'Teacher · Mathematics',gross:5200000,paye:590000,nssf:216000,shif:14300,housing:78000,status:'Pending',paidDate:'',phone:''},
    {id:'STF-005',name:'Fatuma Ali',role:'Teacher · Kiswahili',gross:4600000,paye:430000,nssf:216000,shif:12650,housing:69000,status:'Pending',paidDate:'',phone:''},
    {id:'STF-006',name:'Grace Nyale',role:'Early years teacher',gross:4200000,paye:340000,nssf:216000,shif:11550,housing:63000,status:'Pending',paidDate:'',phone:''},
    {id:'STF-007',name:'David Baya',role:'School accountant',gross:5800000,paye:760000,nssf:216000,shif:15950,housing:87000,status:'Pending',paidDate:'',phone:''},
    {id:'STF-008',name:'Mercy Wambui',role:'Operations assistant',gross:3200000,paye:120000,nssf:160000,shif:8800,housing:48000,status:'Pending',paidDate:'',phone:''}
  ];
  const expenses = [
    ['EXP-001','Learning materials','Exercise books and CBC resources',6250000,'2026-11-10','Mombasa stationers'],
    ['EXP-002','Meals','School kitchen supplies',4800000,'2026-11-09','Shanzu fresh foods'],
    ['EXP-003','Utilities','Electricity and water',2850000,'2026-11-07','Utility providers'],
    ['EXP-004','Transport','School van service and fuel',3200000,'2026-11-05','Fleet services'],
    ['EXP-005','Maintenance','Classroom repair materials',1850000,'2026-11-03','Coast hardware'],
    ['EXP-006','Administration','Printing and office supplies',1200000,'2026-11-02','Office supplies'],
    ['EXP-007','Meals','Kitchen firewood and supplies',2100000,'2026-10-28','Shanzu suppliers'],
    ['EXP-008','Learning materials','Library reading materials',1650000,'2026-10-22','Education bookshop']
  ].map(e=>({id:e[0],category:e[1],description:e[2],amount:e[3],date:e[4],vendor:e[5],account:'Bank'}));
  const attendance = {};
  ['2026-11-09','2026-11-10','2026-11-11','2026-11-12'].forEach((date,d) => {
    attendance[date] = {};
    students.forEach((s,i)=>{attendance[date][s.id] = i===(4+d)?'Absent':i===(8+d)?'Late':'Present';});
  });
  const areas = ['Mathematics','English','Kiswahili','Integrated Science','Social Studies','Creative Arts'];
  const assessments = students.slice(0,12).flatMap((s,i)=>[0,1].map(j=>({id:`CBC-${i}-${j}`,studentId:s.id,area:areas[(i+j)%areas.length],strand:['Number operations','Reading comprehension','Mawasiliano','Living things','Our community','Creative expression'][(i+j)%areas.length],level:['ME','EE','ME','AE','ME','EE'][(i+j)%6],comment:['Demonstrates understanding with minimal support.','Confidently applies the skill to new tasks.','Progressing well; continue guided practice.','Needs additional support with foundational skills.'][['ME','EE','ME','AE','ME','EE'].indexOf(['ME','EE','ME','AE','ME','EE'][(i+j)%6])],date:'2026-11-11',term:'Term 3',year:2026})));
  const stock = [
    {id:'ITM-001',name:'Exercise books · 96 pages',category:'Learning materials',unit:'pieces',quantity:240,reorder:100},
    {id:'ITM-002',name:'Grade 7 mathematics books',category:'Textbooks',unit:'books',quantity:28,reorder:30},
    {id:'ITM-003',name:'Whiteboard markers',category:'Classroom supplies',unit:'pieces',quantity:42,reorder:20},
    {id:'ITM-004',name:'Maize flour',category:'Kitchen stores',unit:'kg',quantity:85,reorder:40},
    {id:'ITM-005',name:'Learner desks',category:'Furniture',unit:'desks',quantity:160,reorder:140},
    {id:'ITM-006',name:'First aid dressings',category:'Health & safety',unit:'packs',quantity:8,reorder:10}
  ];
  const messages = [
    {id:'MSG-001',title:'Term 3 fee reminder',audience:'Fees outstanding',body:'Dear parent or guardian,\n\nThis is a friendly reminder to settle the outstanding school fees for Term 3. Please contact the school office if you would like to discuss a payment arrangement or a bursary application.\n\nThank you for partnering with AIC Academy Shanzu.',date:'2026-11-12',status:'Draft'},
    {id:'MSG-002',title:'Parent and teacher meeting',audience:'All guardians',body:'Dear parent or guardian,\n\nYou are invited to visit the school to discuss your learner’s progress. Please contact the class teacher to arrange a convenient appointment.\n\nWe look forward to seeing you.\nAIC Academy Shanzu',date:'2026-11-11',status:'Prepared'},
    {id:'MSG-003',title:'Reading together at home',audience:'Grade 7',body:'Dear parent or guardian,\n\nPlease encourage your learner to read aloud for ten minutes each day. Ask them to describe the story and explain any new words. Thank you for supporting learning at home.',date:'2026-11-10',status:'Prepared'}
  ];
  const seed = () => ({
    version:1,
    settings:{school:'AIC Academy Shanzu',admin:'Ms. Amani Mwangi',address:'Shanzu, Mombasa County',email:'office@example.com',phone:'',term:'Term 3',year:2026,defaultFee:1850000,payday:'2026-11-28',receiptFooter:'Thank you for supporting your learner’s education.',compact:false,reduceMotion:false,sidebarCollapsed:false,groups:{},readNotifications:[]},
    accounts:[{id:'Bank',name:'School bank account',opening:65000000,icon:'bank'},{id:'M-Pesa',name:'M-Pesa collections',opening:16000000,icon:'phone'},{id:'Cash',name:'School cash office',opening:4000000,icon:'wallet'}],
    students,invoices,payments,staff,expenses,attendance,assessments,awards,routes,stock,stockMoves:[],messages,transfers:[],audit:[],
    historical:{terms:{labels:["T1 ’25","T2 ’25","T3 ’25","T1 ’26","T2 ’26"],values:[28500000,36200000,31800000,40700000,38900000]},months:{labels:['Jun','Jul','Aug','Sep','Oct'],values:[4800000,7300000,6100000,8700000,6900000]},expenses:[3200000,4700000,4100000,5200000,3750000]},
    demoDate:DAY
  });
  return {seed,day:DAY,grades:['PP1','PP2',...Array.from({length:9},(_,i)=>`Grade ${i+1}`)],areas,levels:{EE:'Exceeding expectation',ME:'Meeting expectation',AE:'Approaching expectation',BE:'Below expectation'},categories:['Learning materials','Meals','Utilities','Transport','Maintenance','Administration','Salaries','Other']};
})();
