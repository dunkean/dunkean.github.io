'use strict';
// Deliberately self-contained: no backend, microphone, storage or model imports.
const people = [
  {name:'Maëlys',character:'Narratrice · MJ fictive',initial:'M',color:'',gm:true,compute:false,player:false},
  {name:'Éloi',character:'Théren · rôdeur fictif',initial:'É',color:'violet',gm:false,compute:true,player:false},
  {name:'Nora',character:'Lys · magicienne fictive',initial:'N',color:'green',gm:false,compute:false,player:true},
];
const roleNames={gm:'MJ',compute:'Fournisseur de calcul',player:'Joueur'};
const container=document.querySelector('#participants');
for(const person of people){
  const article=document.createElement('article');article.className='person';
  const info=document.createElement('div');info.className='person-info';
  const avatar=document.createElement('span');avatar.className='avatar '+person.color;avatar.textContent=person.initial;avatar.setAttribute('aria-hidden','true');
  const identity=document.createElement('div');const name=document.createElement('strong');name.textContent=person.name;const character=document.createElement('p');character.textContent=person.character;identity.append(name,character);info.append(avatar,identity);
  const fieldset=document.createElement('fieldset');fieldset.className='roles';const legend=document.createElement('legend');legend.textContent='Rôles de '+person.name;const list=document.createElement('div');list.className='role-list';const summary=document.createElement('p');summary.className='role-summary';
  const update=()=>{summary.textContent=Object.keys(roleNames).filter(key=>person[key]).map(key=>roleNames[key]).join(' · ')||'Participant sans rôle';};
  for(const [key,title] of Object.entries(roleNames)){
    const label=document.createElement('label');const input=document.createElement('input');input.type='checkbox';input.checked=person[key];input.setAttribute('aria-label',title+' pour '+person.name);input.addEventListener('change',()=>{person[key]=input.checked;update();document.querySelector('#feedback').textContent='Rôles modifiés dans cet aperçu uniquement. Aucun fournisseur connecté, aucun droit réel modifié.';});label.append(input,document.createTextNode(title));list.append(label);
  }
  fieldset.append(legend,list);update();article.append(info,fieldset,summary);container.append(article);
}
const utterances=[
  {time:'00:12',speaker:'Maëlys · MJ',kind:'Narration MJ',text:'La porte de pierre s’entrouvre.'},
  {time:'00:18',speaker:'Nora · Lys',kind:'En jeu',text:'Je lève ma lanterne. Est-ce que les inscriptions sont lisibles ?'},
  {time:'00:25',speaker:'Éloi · Théren',kind:'Règles',text:'Comment fonctionne la concentration ?'},
  {time:'00:31',speaker:'Maëlys · MJ',kind:'Narration MJ',text:'Une lumière bleue glisse entre les runes. La cité vous attend.'},
];
function renderTranscript(){
 const target=document.querySelector('#utterances');target.replaceChildren();const search=document.querySelector('#search').value.toLocaleLowerCase('fr');
 for(const row of utterances.filter(row=>(row.text+' '+row.speaker).toLocaleLowerCase('fr').includes(search))){
  const article=document.createElement('article');article.className='utterance';const meta=document.createElement('div');meta.className='utterance-meta';const time=document.createElement('span');time.textContent=row.time;const speaker=document.createElement('strong');speaker.textContent=row.speaker;const kind=document.createElement('span');kind.className='badge';kind.textContent=row.kind;const text=document.createElement('p');text.textContent=row.text;meta.append(time,speaker,kind);article.append(meta,text);target.append(article);
 }
 if(!target.childElementCount){const empty=document.createElement('p');empty.className='muted';empty.textContent='Aucune réplique fictive ne correspond à cette recherche.';target.append(empty);}
}
document.querySelector('#search').addEventListener('input',renderTranscript);
document.querySelector('#add-line').addEventListener('click',event=>{utterances.push({time:'00:42',speaker:'Éloi · Théren',kind:'En jeu',text:'Je consulte la carte avant de poursuivre.'});renderTranscript();event.currentTarget.disabled=true;document.querySelector('#feedback').textContent='Une réplique préparée a été ajoutée localement. Aucun micro ni modèle utilisé.';});
document.querySelector('#host-info').addEventListener('click',()=>{document.querySelector('#feedback').textContent='Dans l’application complète, un fournisseur peut apporter le calcul sans être MJ ni joueur. Ici, aucune connexion ni installation n’est effectuée.';});
document.querySelector('#answer').addEventListener('click',()=>{document.querySelector('#example-question').textContent=document.querySelector('#question').value.trim()||'Comment fonctionne la concentration ?';document.querySelector('#answer-card').hidden=false;});
function route(){
 const requested=location.hash.slice(1);const view=['lobby','transcription','references'].includes(requested)?requested:'lobby';
 for(const section of document.querySelectorAll('.view'))section.hidden=section.id!==view;
 for(const link of document.querySelectorAll('nav a')){if(link.dataset.view===view)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
 document.querySelector('#feedback').textContent='';
}
window.addEventListener('hashchange',route);renderTranscript();route();
