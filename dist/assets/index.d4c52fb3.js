import{o as d,c as p,a as i,b as A,t as h,p as _,d as S,e as u,v as D,r as B,f as M,F as C,g as w,w as E,h as v,i as H,j as k}from"./vendor.1d36ac63.js";const Y=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(n){if(n.ep)return;n.ep=!0;const o=t(n);fetch(n.href,o)}};Y();const g="urn:oid:2.16.756.5.30.1.127.3.10.3",y="urn:oid:2.16.756.5.30.1.178.1.1",Z=[{local:"PAT.7056.0189",spid:"761337615370560189"},{local:"PAT.7053.6004",spid:"761337615370536004"},{local:"PATIENT1",spid:"DEMO"}];function f(e,s){const t=s.identifier.find(r=>r.system==e);return t?t.value:"-"}function L(e){return new Promise((s,t)=>{if(e){const r=new FileReader;r.onload=n=>{const o=n.target.result;return o.indexOf(";base64,")>-1?s(o.split(";base64,")[1]):s(btoa(n.target.result))},r.readAsDataURL(e)}else return t("No file.")})}function N(){return new Promise((e,s)=>{const t=new XMLHttpRequest;t.withCredentials=!0,t.addEventListener("readystatechange",function(){this.readyState===4&&e(JSON.parse(this.response))}),t.open("GET","http://patient-generator.i4mi.bfh.ch/patient/get"),t.setRequestHeader("Accept","application/json"),t.send()})}function x(e,s){return new Promise((t,r)=>{try{if(!new URL(e).protocol.includes("http"))return r('"'+e+'" is not a valid URL.')}catch(o){return console.log(o),r('"'+e+'" is not a valid URL.')}let n=new Image;n.onload=()=>t(!0),n.onerror=()=>t(!0),n.src=e,setTimeout(()=>t(!1),s)})}function F(e){if(e.length!==9)throw new Error("ID must be exactly 9 digits. (is: "+e+")");const s="76",t="13376",r="1";let n=s+t+r+e,o=0;for(var l=n.length-1;l>=0;l--)o+=l%2==0?parseInt(n[l])*3:parseInt(n[l]);return n+=10-o%10,n}var J="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAuCAIAAADcLmxdAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaGVYSWZNTQAqAAAACAAEAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAASgAAwAAAAEAAgAAh2kABAAAAAEAAAA+AAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAAsoAMABAAAAAEAAAAuAAAAAARRMfgAAALiaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjE8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+NDQ8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjE8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjQ2PC9leGlmOlBpeGVsWURpbWVuc2lv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",V="/epd-playground-demo/assets/portrait.4b3d9f15.png";var R=(e,s)=>{for(const[t,r]of s)e[t]=r;return e};const W={name:"patient-card",components:{},props:{patient:{},onRefresh:Function},data:()=>({epdSpidOid:g,hoehewegOid:y}),methods:{findId(e){return f(e,this.patient)}},mounted(){}},m=e=>(_("data-v-9e0a757e"),e=e(),S(),e),U={class:"patient-card"},z=m(()=>i("img",{src:J,class:"pc-flag"},null,-1)),j=m(()=>i("img",{src:V,class:"pc-portrait"},null,-1)),Q={class:"pc-title"},q=u("EPD Playground Beispiel-Patient"),K={key:0},X={key:0,class:"pc-patient-data"},$=m(()=>i("b",null,"Name: ",-1)),ee=m(()=>i("b",null,"Geschlecht: ",-1)),te=m(()=>i("b",null,"Geburtsdatum: ",-1)),ne=m(()=>i("b",null,"PID H\xF6heweg: ",-1)),ie=m(()=>i("b",null,"EPR-SPID: ",-1));function se(e,s,t,r,n,o){return d(),p("div",U,[z,j,i("span",{class:"pc-refresh",onClick:s[0]||(s[0]=(...l)=>t.onRefresh&&t.onRefresh(...l))},"\u27F3"),i("span",Q,[q,t.patient.gender==="female"?(d(),p("span",K,"in")):A("",!0)]),t.patient.name?(d(),p("ul",X,[i("li",null,[$,i("span",null,h(t.patient.name[0].given?t.patient.name[0].given[0]:"")+" "+h(t.patient.name[0].family),1)]),i("li",null,[ee,i("span",null,h(t.patient.gender==="female"?"W":t.patient.gender==="male"?"M":"A"),1)]),i("li",null,[te,i("span",null,h(new Date(t.patient.birthDate).toLocaleString().split(",")[0]),1)]),i("li",null,[ne,i("small",null,h(o.findId(e.hoehewegOid)),1)]),i("li",null,[ie,i("small",null,h(o.findId(e.epdSpidOid)),1)])])):A("",!0)])}var oe=R(W,[["render",se],["__scopeId","data-v-9e0a757e"]]);const re="Bundle",ae="message",le=[{fullUrl:"http://example.com/fhir/MessageHeader/1",resource:{resourceType:"MessageHeader",id:"1",eventUri:"urn:ihe:iti:pmir:2019:patient-feed",source:{endpoint:"http://example.com/patientSource"},focus:[{reference:"Patient/123"}],destination:[{endpoint:"http://example.com/patientEndpoint"}]}}];var I={resourceType:re,type:ae,entry:le};const ce="Organization",de="1",ue=[{system:"urn:oid:2.16.756.5.30.1.178.1.1",value:"Klinik H\xF6heweg"}],pe="Klinik H\xF6heweg",he=[{name:{family:"Loser",given:["Marianne"]}}];var G={resourceType:ce,id:de,identifier:ue,name:pe,contact:he};const Ae="2-7-BundleProvideDocument",me="Bundle",ge={profile:["http://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Comprehensive.ProvideBundle"]},fe="transaction",ye=[];var b={id:Ae,resourceType:me,meta:ge,type:fe,entry:ye};const Ie={name:"app",components:{"patient-card":oe},data(){return{patient:{},isRefreshingPatient:!1,localId:"PAT.7056.0189",patientIsNew:!1,eprSpid:"",mpiId:"",patientGeneratorAvailable:void 0,documents:void 0,knownIds:Z}},methods:{createPatient(){this.patient.contained=[G],this.patient.managingOrganization={reference:"#"+G.id},this.patient.id=Math.ceil(Math.random()*1e4).toString(),I.entry.push({fullUrl:"http://example.com/fhir/Patient/"+this.patient.id,request:{method:"POST"},resource:this.patient}),I.entry[0].focus=[{reference:"Patient/"+this.patient.id}],console.log(I),this.$fhir.performOperation("process-message",I).then(e=>{console.log("Create Patient server response:",e),this.patientIsNew=!1,this.localId=f(y,this.patient),this.eprSpid=f(g,this.patient)}).catch(e=>{this.display="Oops. Something went wrong.",console.log(e)})},searchSpid(e){const s={sourceIdentifier:y+"|"+e,targetSystem:g};this.$fhir.performOperation("ihe-pix",{},"GET",s,"Patient").then(t=>{console.log("Server answer",t),t.body&&t.body.parameter&&t.body.parameter[0].valueIdentifier?this.eprSpid=t.body.parameter[0].valueIdentifier.value:this.eprSpid="nicht gefunden"}).catch(t=>{this.eprSpid="nicht gefunden",console.log(t)})},loadPatientBySPID(e){const s={identifier:g+"|"+e};this.$fhir.search("Patient",s).then(t=>{t.entry&&t.entry[0]&&t.entry[0].resource&&(this.patient=t.entry[0].resource,this.localId=f(y,this.patient),this.patientIsNew=!1),console.log("Search result",t)}).catch(t=>{this.display="Oops. Something went wrong.",console.log(t)})},uploadDocument(){const e=this.$refs.documentInput.files[0];L(e).then(s=>{this.patient.id="pat1";const t="urn:uuid:"+D(),r="urn:uuid:"+D(),n="urn:uuid:"+D(),o="urn:oid:1.1.1.99.1",l={resourceType:"Binary",contentType:e.type,data:s},c={resourceType:"List",id:r,meta:{profile:["http://profiles.ihe.net/ITI/MHD/StructureDefinition/IHE.MHD.Comprehensive.SubmissionSet"]},extension:[{url:"http://profiles.ihe.net/ITI/MHD/StructureDefinition/ihe-designationType",valueCodeableConcept:{coding:[{system:"http://snomed.info/sct",code:"71388002",display:"Procedure (procedure)"}]}},{url:"http://profiles.ihe.net/ITI/MHD/StructureDefinition/ihe-sourceId",valueIdentifier:{value:"urn:oid:1.3.6.1.4.1.12559.11.13.2.5"}}],identifier:[{use:"official",system:"urn:ietf:rfc:3986",value:r}],status:"current",mode:"working",title:"EPD Playground Testdokument ("+new Date().toLocaleDateString()+")",code:{coding:[{system:"http://profiles.ihe.net/ITI/MHD/CodeSystem/MHDlistTypes",code:"submissionset",display:"Submission Set"}]},subject:{reference:"https://test.ahdis.ch/mag-bfh/fhir/Patient/"+o+"-"+f(o,this.patient)},entry:[{item:{reference:n}}],date:new Date().toISOString().substring(0,10)},O={resourceType:"DocumentReference",contained:[JSON.parse(JSON.stringify(this.patient))],masterIdentifier:{value:"urn:oid:2.16.756.5.30.1.178.1.1.1."+Math.floor(Math.random()*1e9)},identifier:[{use:"official",system:"urn:ietf:rfc:3986",value:n}],status:"current",type:{coding:[{system:"http://snomed.info/sct",code:"721912009",display:"Medication summary document (record artifact)"}]},category:[{coding:[{system:"http://snomed.info/sct",code:"422735006",display:"Summary clinical document (record artifact)"}]}],subject:{reference:"https://test.ahdis.ch/mag-bfh/fhir/Patient/"+o+"-"+f(o,this.patient)},source:"urn:oid:1.3.6.1.4.1.12559.11.13.2.5",date:new Date().toISOString().substring(0,10),description:"EPD Playground Testdokument ("+new Date().toLocaleDateString()+")",securityLabel:[{coding:[{system:"http://snomed.info/sct",code:"17621005",display:"Normal (qualifier value)"}]}],content:[{attachment:{contentType:e.type,language:"de-CH",url:t},format:{system:"urn:oid:1.3.6.1.4.1.19376.1.2.3",code:"urn:ihe:pharm:pml:2013",display:"Community Medication List"}}],context:{facilityType:{coding:[{system:"http://snomed.info/sct",code:"264358009",display:"General practice premises (environment)"}]},practiceSetting:{coding:[{system:"http://snomed.info/sct",code:"394802001",display:"General medicine (qualifier value)"}]},sourcePatientInfo:{reference:"#"+this.patient.id}}};b.entry=[{fullUrl:t,resource:l,request:{method:"POST",url:t}},{fullUrl:r,resource:c,request:{method:"POST",url:r}},{fullUrl:n,resource:O,request:{method:"POST",url:n}}],console.log(b),this.$fhir.create(b).then(P=>{this.display="See console.",console.log("Create result",P)}).catch(P=>{this.display="Oops. Something went wrong.",console.log(P)})}).catch(s=>{console.log("Something went wrong encoding your file to base64",s)})},searchDocumentsByeprSpid(e){this.$fhir.search("DocumentReference",{status:"current","patient.identifier":g+"|"+e}).then(s=>{console.log("Search result",s),console.warn("set result to this.documents")}).catch(s=>{this.display="Oops. Something went wrong.",console.log(s)})},refreshPatient(){this.isRefreshingPatient=!0,N().then(e=>{const s=Date.now().toString();e.identifier=[{system:y,value:"PAT."+s.substring(3,7)+"."+s.substring(7,11),assigner:{display:"Klinik H\xF6heweg"}},{system:g,value:F(s.substring(3,12))}],this.patient=e,this.patientIsNew=!0,this.isRefreshingPatient=!1})}},mounted(){x("http://patient-generator.i4mi.bfh.ch",2e3).then(e=>{this.patientGeneratorAvailable=e,e&&this.refreshPatient()}).catch(e=>{console.log("Error pinging patient generator",e),this.patientGeneratorAvailable=!1})}},a=e=>(_("data-v-6a4641ec"),e=e(),S(),e),Pe={id:"app"},De=a(()=>i("h1",null,"EPD Playground Demo App",-1)),be=a(()=>i("p",null,"Das ist eine simple Demo, wie mithilfe von JsOnFhir \xFCber den Mobile Access Gateway auf den EPD Playground zugegriffen werden kann.",-1)),_e={key:0},Se={key:1,class:"patgen-not-available"},Ce=a(()=>i("b",null,"Der Patient Generator ist nicht erreichbar.",-1)),we=a(()=>i("br",null,null,-1)),Ee=u(" Um mit dem Patient Generator neue Beispiel-Patient*innen erstellen zu k\xF6nnen, musst du dich im Netz der BFH befinden (vor Ort oder per VPN)."),ve=a(()=>i("br",null,null,-1)),Re=u(" Ohne Patient Generator hast du unten die M\xF6glichkeit, unten \xFCber eine EPR-SPID einen vorhandenen Datensatz zu laden. "),Ge=[Ce,we,Ee,ve,Re],Te={key:3},Oe=u(" Im Gegensatz zum echten EPD vergibt der EPD Playground keine EPR-SPID, wenn ein*e neue*r Patient*in hinzugef\xFCgt wird. "),Be=a(()=>i("br",null,null,-1)),Me=u(" Deshalb geneneriert dieses Tool eine zuf\xE4llige EPR-SPID, wenn du mit dem Patient Generator ein*e neue*n Patient*in erstellst. Diese generierte EPR-SPID wird dann mit auf den EPD Playground geschrieben. "),He=[Oe,Be,Me],ke=a(()=>i("h2",null,"Folgende Aktionen sind verf\xFCgbar: ",-1)),Ye={key:0},Ze=a(()=>i("h3",null,"Beispielpatient*in schreiben",-1)),Le=a(()=>i("p",null,[u(" Schreibt die oben aufgef\xFChrten Patientendaten auf den EPD Playground. "),i("br"),u(" Merke dir die IDs, damit du den Patient sp\xE4ter wieder laden kannst! ")],-1)),Ne=["disabled"],xe={key:0,class:"isnotnew-tip"},Fe=a(()=>i("h3",null,"EPR-SPID laden",-1)),Je=a(()=>i("p",null," L\xE4dt die EPR-SPID vom EPD Playground, anhand einer bekannten lokalen PID (der Klinik H\xF6heweg). ",-1)),Ve=u("Dies kann die ID eines neu angelegten Patienten sein, oder eine der folgenden: "),We=["onClick"],Ue=u(" ... "),ze=a(()=>i("label",{for:"id-input"},"Lokale ID:",-1)),je={class:"result"},Qe=u("EPR-SPID: "),qe=a(()=>i("h3",null,"Patient*in laden",-1)),Ke=a(()=>i("p",null," L\xE4dt Patienten-Stammdaten zur angegebenen EPR-SPID aus dem EPD Playground und setzt die geladenen Daten als Demo-Patient*in. ",-1)),Xe=u("Beispiele f\xFCr EPR-SPID: "),$e=["onClick"],et=u(" ... "),tt=a(()=>i("label",{for:"spid-input"},"EPR-SPID:",-1)),nt=a(()=>i("p",null,[u("Tipp: Aktiviere die Browser-Konsole f\xFCr mehr Informationen."),i("br"),u("(auf Mac: [alt] [cmd] [I], auf Windows: [Ctrl] [Shift] [I])")],-1));function it(e,s,t,r,n,o){const l=B("patient-card");return d(),p("div",Pe,[De,be,n.patientGeneratorAvailable!==!1?(d(),p("p",_e," Mit dem Patient Generator k\xF6nnen Beispiel-Patient*innen erstellt werden. Dazu muss man sich im BFH-Netz befinden (oder per VPN eingew\xE4hlt sein). Kudos an Robin Glauser f\xFCr das Erstellen des Patient Generators. ")):A("",!0),n.patientGeneratorAvailable===!1?(d(),p("p",Se,Ge)):A("",!0),n.patient.name?(d(),M(l,{key:2,patient:n.patient,onRefresh:()=>this.refreshPatient()},null,8,["patient","onRefresh"])):A("",!0),n.patientGeneratorAvailable!==!1?(d(),p("p",Te,He)):A("",!0),ke,i("ul",null,[n.patient.name?(d(),p("li",Ye,[Ze,Le,i("button",{onClick:s[0]||(s[0]=(...c)=>o.createPatient&&o.createPatient(...c)),disabled:!n.patientIsNew},"ausf\xFChren",8,Ne),n.patientIsNew?A("",!0):(d(),p("span",xe,"Diese*r Patient*in ist bereits auf dem EPD Playground gespeichert."))])):A("",!0),i("li",null,[Fe,Je,i("p",null,[i("small",null,[Ve,(d(!0),p(C,null,w(n.knownIds,c=>(d(),p("span",{onClick:()=>this.localId=c.local},h(c.local)+", ",9,We))),256)),Ue])]),ze,E(i("input",{type:"text","onUpdate:modelValue":s[1]||(s[1]=c=>n.localId=c),id:"id-input"},null,512),[[v,n.localId]]),i("p",je,[Qe,i("small",null,h(n.eprSpid),1)]),i("button",{onClick:s[2]||(s[2]=c=>o.searchSpid(n.localId))},"ausf\xFChren")]),i("li",null,[qe,Ke,i("p",null,[i("small",null,[Xe,(d(!0),p(C,null,w(n.knownIds,c=>(d(),p("span",{onClick:()=>this.eprSpid=c.spid},h(c.spid)+", ",9,$e))),256)),et])]),tt,E(i("input",{type:"text","onUpdate:modelValue":s[3]||(s[3]=c=>n.eprSpid=c),id:"spid-input"},null,512),[[v,n.eprSpid]]),i("button",{onClick:s[4]||(s[4]=c=>o.loadPatientBySPID(n.eprSpid))},"ausf\xFChren")])]),nt])}var st=R(Ie,[["render",it],["__scopeId","data-v-6a4641ec"]]);const T=H(st);T.config.globalProperties={$fhir:new k.JSOnFhir("https://test.ahdis.ch/mag-bfh","irrelevant","irr\u{1F418}",!0)};T.mount("#app");