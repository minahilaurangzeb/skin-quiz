/* ---------- Questions ----------
   s = points added to a skin type (dry, oily, combination, normal)
   f = flag set on the result (sensitive)
   x = exclusive option (clears the other choices) */
const ABOUT = "About you", SKIN = "Skin type", LIFE = "Concerns and lifestyle";
const Q = [
 {id:"gender", part:ABOUT, type:"single", text:"What's your gender?", opts:[
   {t:"Male"}, {t:"Female"}, {t:"Prefer not to say"}]},
 {id:"age", part:ABOUT, type:"single", text:"What's your age bracket?", opts:[
   {t:"13 to 19"}, {t:"20 to 26"}, {t:"27 to 33"}, {t:"34 to 40"}, {t:"Above 40"}]},
 {id:"wash", part:SKIN, type:"single", text:"About 30 minutes after washing your face, with nothing applied, how does your skin feel?", opts:[
   {t:"Tight, dry or flaky", s:{dry:3}},
   {t:"Comfortable, neither oily nor dry", s:{normal:3}},
   {t:"Shiny in the T-zone only, cheeks tight or normal", s:{combination:3}},
   {t:"Shiny or greasy all over", s:{oily:3}}]},
 {id:"tzone", part:SKIN, type:"single", text:"By midday, how does your T-zone (forehead, nose, chin) look or feel?", opts:[
   {t:"Tight or dry, no shine", s:{dry:2}},
   {t:"Slightly shiny", s:{combination:1, normal:1}},
   {t:"Very oily or shiny", s:{oily:2}},
   {t:"Balanced", s:{normal:2}}]},
 {id:"cheeks", part:SKIN, type:"single", text:"How do your cheeks usually feel during the day?", opts:[
   {t:"Dry, tight or flaky", s:{dry:2}},
   {t:"Normal and comfortable", s:{normal:1, combination:1}},
   {t:"Slightly oily", s:{oily:1}},
   {t:"Very oily", s:{oily:2}}]},
 {id:"pores", part:SKIN, type:"single", text:"How would you describe your pores?", opts:[
   {t:"Large and visible across most of my face", s:{oily:2}},
   {t:"Visible mainly on my nose and forehead", s:{combination:2}},
   {t:"Small and hardly visible", s:{dry:1, normal:1}},
   {t:"I can't tell"}]},
 {id:"breakouts", part:SKIN, type:"single", text:"How often do you get breakouts?", opts:[
   {t:"Rarely or never", s:{dry:1, normal:1}},
   {t:"Occasionally, mostly in the T-zone", s:{combination:2}},
   {t:"Often, across most of my face", s:{oily:2}},
   {t:"Mostly on the cheeks, jawline or chin", s:{combination:1}}]},
 {id:"react", part:SKIN, type:"multi", text:"How does your skin react to new products?", hint:"Select all that apply.", opts:[
   {t:"It adapts well, little or no reaction", s:{normal:1}, x:true},
   {t:"It breaks out or gets extra shiny", s:{oily:1}},
   {t:"It turns red, stings or burns", f:"sensitive"},
   {t:"It gets flaky or dry", s:{dry:1}}]},
 {id:"allergy", part:SKIN, type:"multi", text:"Do you react to any of these?", hint:"Select all that apply.", opts:[
   {t:"Fragrance", f:"sensitive"},
   {t:"Alcohol", f:"sensitive"},
   {t:"Sulfates", f:"sensitive"},
   {t:"Essential oils", f:"sensitive"},
   {t:"Not sure", x:true},
   {t:"None", x:true}]},
 {id:"pigment", part:LIFE, type:"single", text:"Do you have dark spots or patches on your face?", hint:"Pick the closest match.", opts:[
   {t:"No, my skin tone is even"},
   {t:"A few small spots, for example marks left by pimples", f:"pigment"},
   {t:"Patches on my cheeks, forehead or upper lip", f:"pigment"},
   {t:"Dark areas across most of my face", f:"pigment"}]},
 {id:"concerns", part:LIFE, type:"multi", max:3, text:"What are your main skin concerns?", hint:"Select up to 3.", opts:[
   {t:"Acne or pimples", k:"acne"},
   {t:"Dark spots or uneven tone", k:"spots"},
   {t:"Dullness", k:"dull"},
   {t:"Dryness or flaking", k:"dry"},
   {t:"Redness", k:"red"},
   {t:"Fine lines or early aging", k:"aging"},
   {t:"Large pores", k:"pores"},
   {t:"None", x:true}]},
 {id:"outdoor", part:LIFE, type:"single", text:"How much time do you spend outdoors each day?", opts:[
   {t:"Mostly indoors", k:"indoors"},
   {t:"A few hours", k:"some"},
   {t:"Most of the day", k:"most"}]},
 {id:"spf", part:LIFE, type:"single", text:"Do you wear sunscreen?", opts:[
   {t:"Yes, daily", k:"yes"},
   {t:"Sometimes", k:"sometimes"},
   {t:"No", k:"no"}]},
 {id:"sleep", part:LIFE, type:"single", text:"How many hours do you usually sleep?", opts:[
   {t:"Less than 6", k:"low"},
   {t:"6 to 7", k:"mid"},
   {t:"7 to 9", k:"good"},
   {t:"More than 9", k:"high"}]},
 {id:"preg", part:LIFE, type:"single", text:"Are you pregnant or breastfeeding?", hint:"This helps us avoid ingredients that may not be suitable.", opts:[
   {t:"Yes", k:"yes"},
   {t:"No", k:"no"},
   {t:"Prefer not to say", k:"no"}]}
];

/* ---------- Result content ---------- */
const TYPES = {
  dry:{name:"Dry skin", lead:"Your skin makes less oil than it needs, so it tends to feel tight and flaky."},
  oily:{name:"Oily skin", lead:"Your skin produces extra oil, which causes shine and makes breakouts more likely."},
  combination:{name:"Combination skin", lead:"Your T-zone is oilier than your cheeks, so different areas need different care."},
  normal:{name:"Normal skin", lead:"Your skin is well balanced, neither too oily nor too dry."}
};
/* ---------- App ---------- */
const card = document.getElementById("card");
const answers = {};            // question id -> array of chosen option indexes
let step = 0;

function render(){
  const q = Q[step];
  const chosen = answers[q.id] || [];
  const bars = Q.map((_, i) => `<span class="${i <= step ? "done" : ""}"></span>`).join("");
  card.innerHTML = `
    <div class="progress" aria-hidden="true">${bars}</div>
    <div class="meta"><span>${q.part}</span><span>Question ${step + 1} of ${Q.length}</span></div>
    <fieldset style="border:0;padding:0;margin:0">
      <legend class="question">${q.text}</legend>
      ${q.hint ? `<p class="hint">${q.hint}</p>` : ""}
      <div class="opts">
        ${q.opts.map((o, i) => `
          <label class="opt">
            <input type="${q.type === "multi" ? "checkbox" : "radio"}" name="${q.id}" value="${i}" ${chosen.includes(i) ? "checked" : ""}>
            <span>${o.t}</span>
          </label>`).join("")}
      </div>
    </fieldset>
    <div class="nav">
      <button class="ghost" id="back" ${step === 0 ? "disabled" : ""}>Back</button>
      <button class="primary" id="next" ${chosen.length ? "" : "disabled"}>${step === Q.length - 1 ? "See my result" : "Next"}</button>
    </div>`;
  card.querySelectorAll("input").forEach(inp => inp.addEventListener("change", onPick));
  document.getElementById("back").onclick = () => { step--; render(); };
  document.getElementById("next").onclick = () => { step === Q.length - 1 ? showResult() : (step++, render()); };
  limitMax(q, chosen);
}

function onPick(e){
  const q = Q[step], i = Number(e.target.value);
  let chosen = answers[q.id] || [];
  if(q.type === "single"){
    chosen = [i];
  } else if(e.target.checked){
    chosen = q.opts[i].x ? [i] : [...chosen.filter(j => !q.opts[j].x), i];
  } else {
    chosen = chosen.filter(j => j !== i);
  }
  answers[q.id] = chosen;
  document.getElementById("next").disabled = chosen.length === 0;
  card.querySelectorAll("input").forEach(inp => inp.checked = chosen.includes(Number(inp.value)));
  limitMax(q, chosen);
}

function limitMax(q, chosen){
  if(!q.max) return;
  card.querySelectorAll("input").forEach(inp => {
    inp.disabled = chosen.length >= q.max && !chosen.includes(Number(inp.value));
  });
}

/* ---------- Scoring ---------- */
function score(){
  const total = {dry:0, oily:0, combination:0, normal:0};
  let sensitive = false;
  Q.filter(q => q.part === SKIN).forEach(q => {
    (answers[q.id] || []).forEach(i => {
      const o = q.opts[i];
      if(o.s) for(const k in o.s) total[k] += o.s[k];
      if(o.f === "sensitive") sensitive = true;
    });
  });
  // Hyperpigmentation is a concern, not a skin type, so it is tracked separately.
  const pigment = (answers.pigment || []).some(i => Q.find(q => q.id === "pigment").opts[i].f === "pigment");
  // Highest score wins. Ties are broken in this order.
  const order = ["combination", "oily", "dry", "normal"];
  const type = order.slice().sort((a, b) => total[b] - total[a] || order.indexOf(a) - order.indexOf(b))[0];
  return {total, type, sensitive, pigment};
}

function showResult(){
  const {total, type, sensitive, pigment} = score();
  const sum = Object.values(total).reduce((a, b) => a + b, 0) || 1;
  const info = TYPES[type];
  const bars = Object.entries(total).sort((a, b) => b[1] - a[1]).map(([k, v]) => {
    const pct = Math.round(v / sum * 100);
    return `<div class="bar ${k === type ? "top" : ""}">
      <span>${TYPES[k].name.replace(" skin", "")}</span>
      <div class="track"><div class="fill" style="width:${pct}%"></div></div>
      <span>${pct}%</span></div>`;
  }).join("");

  card.innerHTML = `
    <div class="result">
      <div class="badges">${sensitive ? `<span class="badge">Sensitive</span>` : ""}${pigment ? `<span class="badge alt">Hyperpigmentation</span>` : ""}</div>
      <h2>${info.name}${sensitive ? " + sensitive" : ""}</h2>
      <p class="lead">${info.lead}</p>
      <div class="bars" aria-label="Score breakdown">${bars}</div>
      <p class="note">This quiz gives general guidance and isn't medical advice. See a dermatologist for persistent or severe skin problems.</p>
      <div class="nav"><button class="ghost" id="restart">Start over</button></div>
    </div>`;
  document.getElementById("restart").onclick = () => {
    for(const k in answers) delete answers[k];
    step = 0; render();
  };
  // For your backend later: { type, sensitive, pigment, total, answers }
  console.log({type, sensitive, pigment, total, answers});
}

render();