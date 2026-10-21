const $=i=>document.getElementById(i),K="paidup_log";
let log=JSON.parse(localStorage.getItem(K)||"[]");
["me","co","coEmail","status"].forEach(i=>{const v=localStorage.getItem("pu_"+i);if(v)$(i).value=v;$(i).onchange=()=>localStorage.setItem("pu_"+i,$(i).value)});
const money=n=>"$"+n.toFixed(2),late=d=>d?Math.max(0,Math.floor((Date.now()-new Date(d))/864e5)):0;
function render(){localStorage.setItem(K,JSON.stringify(log));
 $("log").querySelector("tbody").innerHTML=log.map((g,i)=>`<tr><td>${g.ev}</td><td>${g.dt}</td><td>${money(g.owed)}</td><td>${g.due||"-"}</td><td>${late(g.due)}</td><td><a href="#" onclick="log.splice(${i},1);render();return false">remove</a></td></tr>`).join("");
 const t=log.reduce((s,g)=>s+g.owed,0);$("total").textContent=log.length?`Total owed: ${money(t)}`:""}
$("add").onclick=()=>{const h=+$("hr").value,r=+$("rt").value,rb=+$("rb").value||0;
 if(!$("ev").value||!$("dt").value||!h||!r){alert("Fill in gig, date, hours and rate.");return}
 log.push({ev:$("ev").value,dt:$("dt").value,hr:h,rt:r,rb,owed:h*r+rb,due:$("due").value});render()};
const lines=()=>log.map(g=>`- ${g.ev} on ${g.dt}: ${g.hr} hrs x ${money(g.rt)}${g.rb?` + ${money(g.rb)} reimbursement`:""} = ${money(g.owed)}`).join("\n");
const total=()=>money(log.reduce((s,g)=>s+g.owed,0));
$("genRem").onclick=()=>{if(!log.length){alert("Add a gig first.");return}
 $("rem").textContent=`To: ${$("coEmail").value||"[agency email]"}
Subject: Payment follow-up: ${log.map(g=>g.ev).join(", ")}

Hi ${$("co").value||"[agency]"} team,

I'm following up on payment for the work below, which I completed as scheduled:

${lines()}

Total due: ${total()}

Could you confirm the date this will be paid and the payment method? If anything is missing on my end (timesheet, recap, W-9 or receipts), let me know and I'll send it today.

Thank you,
${$("me").value||"[your name]"}`};
$("cpRem").onclick=()=>navigator.clipboard.writeText($("rem").textContent);
render();
