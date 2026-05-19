// ============ NAVEGAÇÃO NÍVEL 1 ============
function nav(dest){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('scr-'+dest).classList.add('active');
  document.querySelectorAll('.nav1-item').forEach(b=>{
    b.classList.toggle('active', b.dataset.nav===dest);
  });
  window.scrollTo(0,0);
}
function goEncontro(){ nav('encontros'); }

// ============ NÍVEL 2 (sub-abas Encontros) ============
function subEnc(btn,id){
  if(btn.classList.contains('locked'))return;
  btn.parentElement.querySelectorAll('.subnav-item').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  // só ev50 existe por ora
}

// ============ NÍVEL 3 (telas do evento 50 anos) ============
function evScr(btn,id){
  document.querySelectorAll('#ev50 > .subnav .subnav-item').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#ev50 .enc-screen[id^=evs-]').forEach(s=>s.classList.remove('active'));
  document.getElementById('evs-'+id).classList.add('active');
  window.scrollTo(0,0);
  if(id==='inscricao' && !window._inscBuilt){ buildInscricao(); window._inscBuilt=true; }
  if(id==='conta' && !window._contaBuilt){ buildConta(); window._contaBuilt=true; }
  if(id==='admin' && !window._adminBuilt){ buildAdmin(); window._adminBuilt=true; }
  if(id==='dashboard' && !window._dashBuilt){ buildDash(); window._dashBuilt=true; }
}

// ============ LOGIN SIMULADO ============
var USERS = {"riva.cerqueira@gmail.com": {"nome": "Rivail Luiz Cerqueira", "tratamento": "Rivail"}, "andre.novaes63@gmail.com": {"nome": "André Luis Novaes Miranda", "tratamento": "André Novaes"}, "baggio@exemplo.com": {"nome": "Luiz Augusto Baggio", "tratamento": "Baggio"}, "newtonraulino@hotmail.com": {"nome": "Newton Raulino", "tratamento": "Raulino"}, "everton@exemplo.com": {"nome": "Everton Cesar Seraphim", "tratamento": "Everton"}, "guy@exemplo.com": {"nome": "Guy Hermínio Rocha", "tratamento": "Guy"}, "m.e.santos@uol.com.br": {"nome": "Marco Elias dos Santos", "tratamento": "Elias"}, "marcilio.pereira.oliveira@gmail.com": {"nome": "Marcílio Pereira de Oliveira", "tratamento": "Marcílio"}};
var currentUser = null;
function fillLogin(email){
  document.getElementById('loginUser').value = email;
  document.getElementById('loginPass').value = 'teste123';
  document.getElementById('loginError').classList.remove('show');
}
function doLogin(){
  var u = document.getElementById('loginUser').value.trim().toLowerCase();
  var info = USERS[u];
  if(!info){
    document.getElementById('loginError').classList.add('show');
    return;
  }
  currentUser = info;
  var btn = document.getElementById('loginNavBtn');
  btn.textContent = '★ ' + info.tratamento;
  btn.classList.add('logged');
  alert('Bem-vindo, ' + info.nome + '!\n\nVocê está logado como integrante. A comunicação do site agora é personalizada com seu nome. (No protótipo isto é simulado; na versão final o login é validado contra o cadastro real da turma.)');
  nav('encontros');
  if(!window._inscBuilt){ buildInscricao(); window._inscBuilt=true; }
  // reconstruir saudação se inscrição já montada
  refreshGreeting();
}
function refreshGreeting(){
  var g = document.getElementById('inscGreetName');
  if(g && currentUser){ g.textContent = currentUser.nome; }
  var gc = document.getElementById('contaGreetName');
  if(gc && currentUser){ gc.textContent = currentUser.tratamento; }
}

// ============ CONTADOR REGRESSIVO ============
function tick(){
  var target = new Date('2027-02-26T20:00:00');
  var now = new Date();
  var diff = target - now;
  if(diff<0)diff=0;
  var d=Math.floor(diff/864e5),h=Math.floor(diff%864e5/36e5),m=Math.floor(diff%36e5/6e4),s=Math.floor(diff%6e4/1e3);
  var E=function(id){return document.getElementById(id)};
  if(E('cd-d')){E('cd-d').textContent=d;E('cd-h').textContent=String(h).padStart(2,'0');E('cd-m').textContent=String(m).padStart(2,'0');E('cd-s').textContent=String(s).padStart(2,'0');}
}
setInterval(tick,1000);tick();

// ============ HELPERS QTY ============
function qty(btn,delta){
  var inp=btn.parentElement.querySelector('input');
  var v=Math.max(0,(parseInt(inp.value)||0)+delta);
  inp.value=v;
  if(typeof recalcInsc==='function')recalcInsc();
  if(inp.dataset.size!==undefined)sumSizes();
}
function sumSizes(){
  var t=0;document.querySelectorAll('#sizesGrid input').forEach(i=>t+=parseInt(i.value)||0);
  var el=document.getElementById('sizeSum');
  if(el)el.textContent='Total de camisetas: '+t+(t>0?' un.':'');
  var cq=document.getElementById('camisetaQtyMirror');if(cq)cq.textContent=t;
}
function toggleBrinde(cb){
  cb.closest('.brinde-card').classList.toggle('selected',cb.checked);
  if(typeof recalcInsc==='function')recalcInsc();
}
function confirmBlock(btn){
  btn.closest('.form-card').classList.add('confirmed');
}

// ============ BUILD: INSCRIÇÃO ============
function buildInscricao(){
  var nome = currentUser ? currentUser.nome : 'Aluno (faça login para personalizar)';
  document.getElementById('inscContent').innerHTML = `
   <div class="insc-greeting">
     <div><h2>Inscrição · Encontro 50 Anos</h2>
     <div class="gs">Bem-vindo, <span id="inscGreetName">${nome}</span> — confirme sua participação</div></div>
     <div class="gid"><div class="l">Status</div><div class="v">Não inscrito</div></div>
   </div>

   <div class="form-card">
     <div class="confirm-badge">Confirmado</div>
     <div class="fc-head"><div class="fc-num"><span>1</span></div>
       <div><h3>Seus dados</h3><div class="s">Confira e ajuste se necessário</div></div></div>
     <div class="edit-hint">Dados vindos do cadastro da turma — corrija se algo mudou</div>
     <div class="field-grid">
       <div class="field"><label>Nome completo</label><input value="${nome}"></div>
       <div class="field"><label>Como prefere ser chamado</label><input value="${currentUser?currentUser.tratamento:''}"></div>
       <div class="field"><label>E-mail</label><input value="${currentUser?'':''}" placeholder="seu@email.com"></div>
       <div class="field"><label>Celular / WhatsApp</label><input placeholder="(00) 00000-0000"></div>
       <div class="field"><label>Cidade</label><input placeholder="Cidade"></div>
       <div class="field"><label>UF</label><input placeholder="UF" maxlength="2"></div>
     </div>
     <div class="block-confirm"><button class="bc-btn" onclick="confirmBlock(this)">Confirmar dados</button></div>
   </div>

   <div class="form-card">
     <div class="confirm-badge">Confirmado</div>
     <div class="fc-head"><div class="fc-num"><span>2</span></div>
       <div><h3>Churrasco · Casa de Barcos</h3><div class="s">Sábado, 27/02 — informe quantas pessoas por faixa</div></div></div>
     <div class="qty-row"><div class="ql">Adultos <small>acima de 12 anos</small></div>
       <div class="qty-input"><button onclick="qty(this,-1)">−</button><input value="0" data-k="ad"><button onclick="qty(this,1)">+</button></div>
       <div class="qp">R$ 180,00</div></div>
     <div class="qty-row"><div class="ql">Jovens <small>5 a 12 anos</small></div>
       <div class="qty-input"><button onclick="qty(this,-1)">−</button><input value="0" data-k="jo"><button onclick="qty(this,1)">+</button></div>
       <div class="qp">R$ 90,00</div></div>
     <div class="qty-row"><div class="ql">Crianças <small>até 4 anos · cortesia</small></div>
       <div class="qty-input"><button onclick="qty(this,-1)">−</button><input value="0" data-k="cr"><button onclick="qty(this,1)">+</button></div>
       <div class="qp">Cortesia</div></div>
     <div class="block-confirm"><button class="bc-btn" onclick="confirmBlock(this)">Confirmar churrasco</button></div>
   </div>

   <div class="form-card">
     <div class="confirm-badge">Confirmado</div>
     <div class="fc-head"><div class="fc-num"><span>3</span></div>
       <div><h3>Brindes comemorativos</h3><div class="s">Opcionais — marque o que desejar e a quantidade</div></div></div>

     <div class="brinde-card">
       <div class="brinde-head" onclick="var c=this.querySelector('input');if(event.target!==c){c.checked=!c.checked;}toggleBrinde(this.querySelector('input'))">
         <input type="checkbox" onclick="event.stopPropagation();toggleBrinde(this)">
         <div class="bi"><div class="bn">Camiseta comemorativa</div><div class="bd">50 anos · com detalhamento de tamanhos</div></div>
         <div class="bp">R$ 80,00</div>
       </div>
       <div class="brinde-body">
         <div class="size-row" style="background:none;border:none;font-style:italic;color:var(--muted)">Informe a quantidade por tamanho:</div>
         <div class="sizes-grid" id="sizesGrid">
           ${['PP','P','M','G','GG','XGG','XXGG'].map(s=>`<div class="size-row"><div class="sl">${s}</div><div class="qty-input"><button onclick="qty(this,-1)">−</button><input value="0" data-size="${s}"><button onclick="qty(this,1)">+</button></div></div>`).join('')}
         </div>
         <div class="size-sum" id="sizeSum">Total de camisetas: 0</div>
       </div>
     </div>

     <div class="brinde-card">
       <div class="brinde-head" onclick="var c=this.querySelector('input');if(event.target!==c){c.checked=!c.checked;}toggleBrinde(this.querySelector('input'))">
         <input type="checkbox" onclick="event.stopPropagation();toggleBrinde(this)">
         <div class="bi"><div class="bn">Medalha 50 anos</div><div class="bd">Medalha comemorativa em metal</div></div>
         <div class="bp">R$ 120,00</div>
       </div>
       <div class="brinde-body"><div class="bb-grid"><span class="l">Quantidade</span>
         <div class="qty-input"><button onclick="qty(this,-1)">−</button><input value="1" data-k="med"><button onclick="qty(this,1)">+</button></div></div></div>
     </div>

     <div class="brinde-card">
       <div class="brinde-head" onclick="var c=this.querySelector('input');if(event.target!==c){c.checked=!c.checked;}toggleBrinde(this.querySelector('input'))">
         <input type="checkbox" onclick="event.stopPropagation();toggleBrinde(this)">
         <div class="bi"><div class="bn">Livro da Turma</div><div class="bd">Livro histórico comemorativo</div></div>
         <div class="bp">R$ 150,00</div>
       </div>
       <div class="brinde-body"><div class="bb-grid"><span class="l">Quantidade</span>
         <div class="qty-input"><button onclick="qty(this,-1)">−</button><input value="1" data-k="liv"><button onclick="qty(this,1)">+</button></div></div></div>
     </div>
     <div class="block-confirm"><button class="bc-btn" onclick="confirmBlock(this)">Confirmar brindes</button></div>
   </div>

   <div class="total-card">
     <div class="total-line sub"><span>Churrasco</span><span id="tChur">R$ 0,00</span></div>
     <div class="total-line sub"><span>Brindes</span><span id="tBri">R$ 0,00</span></div>
     <div class="total-line main"><span>Total da inscrição</span><span class="v" id="tTotal">R$ 0,00</span></div>
   </div>

   <div class="pay-card">
     <div class="fc-head"><div class="fc-num"><span>4</span></div>
       <div><h3>Pagamento</h3><div class="s">Via Pix — sem necessidade de comprovante</div></div></div>
     <div class="pay-notice">
       <div class="pay-notice-head"><div class="pay-notice-ico"></div><h4>O QR Code Pix será enviado depois</h4></div>
       <p>Sua inscrição será registrada agora. Em até <strong>48 horas</strong>, a comissão gerará um <strong>QR Code Pix individual</strong> com o valor exato da sua inscrição.</p>
       <p>Esse QR Code identifica automaticamente o seu pagamento — por isso <strong>não é necessário enviar comprovante</strong>.</p>
       <div class="channels">
         <span class="ch-tag">📱 WhatsApp</span><span class="ch-tag">✉️ E-mail</span><span class="ch-tag">🔐 Aqui em "Minha Conta"</span>
       </div>
     </div>
     <button class="submit-btn" onclick="alert('No protótipo a inscrição não é gravada. Na versão final, ela seria registrada e o QR Code Pix individual chegaria em até 48h pelos canais indicados.')">Registrar minha inscrição</button>
   </div>`;
  recalcInsc();
}
function recalcInsc(){
  var g=function(k){var e=document.querySelector('#inscContent input[data-k='+k+']');return e?parseInt(e.value)||0:0;};
  var ad=g('ad'),jo=g('jo'),med=0,liv=0;
  var chur=ad*180+jo*90;
  var camt=0;document.querySelectorAll('#sizesGrid input').forEach(i=>camt+=parseInt(i.value)||0);
  // brindes só contam se card selecionado
  var bri=0;
  document.querySelectorAll('#inscContent .brinde-card').forEach(function(c){
    if(!c.classList.contains('selected'))return;
    if(c.querySelector('#sizesGrid'))bri+=camt*80;
    var mk=c.querySelector('input[data-k=med]');if(mk)bri+=(parseInt(mk.value)||0)*120;
    var lk=c.querySelector('input[data-k=liv]');if(lk)bri+=(parseInt(lk.value)||0)*150;
  });
  var f=function(n){return 'R$ '+n.toLocaleString('pt-BR',{minimumFractionDigits:2});};
  var E=function(id){return document.getElementById(id)};
  if(E('tChur')){E('tChur').textContent=f(chur);E('tBri').textContent=f(bri);E('tTotal').textContent=f(chur+bri);}
}

// ============ BUILD: MINHA CONTA ============
function buildConta(){
  var trat = currentUser ? currentUser.tratamento : 'companheiro';
  document.getElementById('contaContent').innerHTML = `
   <div class="acct-hero">
     <div class="acct-badge">Minha Conta</div>
     <h2>Olá, <span id="contaGreetName">${trat}</span></h2>
     <p>Acompanhe e gerencie sua inscrição no Encontro de 50 Anos</p>
   </div>
   <div class="acct-card">
     <h3>Dados cadastrais <span class="edit-link" onclick="alert('Na versão final, ao editar aqui, o cadastro da turma é atualizado automaticamente — e a comissão consegue gerar uma nova planilha Matriz já com a correção.')">✎ editar meus dados</span></h3>
     <div class="summary-row"><span>Nome</span><span>${currentUser?currentUser.nome:'—'}</span></div>
     <div class="summary-row"><span>E-mail</span><span>—</span></div>
     <div class="summary-row"><span>Celular / WhatsApp</span><span>—</span></div>
     <div class="summary-row"><span>Cidade / UF</span><span>—</span></div>
     <div class="sync-note">Quando você corrige um dado aqui, ele atualiza o <strong>cadastro central da turma</strong> automaticamente. Assim, a Matriz se mantém sempre correta — sem retrabalho.</div>
   </div>
   <div class="acct-card">
     <h3>Minha inscrição</h3>
     <div class="summary-row"><span>Churrasco · adultos</span><span>2</span></div>
     <div class="summary-row"><span>Churrasco · jovens</span><span>1</span></div>
     <div class="summary-row"><span>Camiseta comemorativa</span><span>2 (G, M)</span></div>
     <div class="summary-row"><span>Medalha 50 anos</span><span>1</span></div>
     <div class="summary-row" style="border-top:2px solid var(--gold);margin-top:8px;padding-top:12px;font-weight:700"><span style="font-family:'Cinzel',serif;letter-spacing:1px">TOTAL</span><span style="font-family:'Cinzel',serif;color:var(--wine);font-size:18px">R$ 650,00</span></div>
   </div>
   <div class="acct-card">
     <h3>Pagamento via Pix</h3>
     <div class="pay-grid">
       <div class="pay-qr"><div class="qr-frame"></div><div class="qr-label">QR Code individual</div></div>
       <div class="pay-info">
         <div class="pl">Valor a pagar</div><div class="pv">R$ 650,00</div>
         <div class="pay-key"><span>chave-pix-comissao@turma1977.org.br</span><span class="cp" onclick="alert('Chave copiada (simulado)')">copiar</span></div>
         <span class="pill pending">Aguardando pagamento</span>
       </div>
     </div>
     <div class="sync-note" style="margin-top:18px">O QR Code acima é <strong>individual</strong> e identifica seu pagamento automaticamente. Não é necessário enviar comprovante. <em>(No protótipo, o código é ilustrativo.)</em></div>
   </div>
   <div class="actions-card">
     <h3>Alterar minha inscrição</h3>
     <div class="hs">Precisa mudar algo? Use uma das opções abaixo.</div>
     <div class="actions-grid">
       <div class="action-btn add" onclick="alert('Aumentar adesão: gera um novo QR Code com a diferença a pagar. (Simulado)')">
         <span class="ico">＋</span><span class="lab">Aumentar</span><span class="sub">incluir mais itens ou pessoas</span></div>
       <div class="action-btn reduce" onclick="alert('Reduzir adesão: a comissão é avisada para acertar a devolução. (Simulado)')">
         <span class="ico">－</span><span class="lab">Reduzir</span><span class="sub">remover itens da inscrição</span></div>
       <div class="action-btn cancel" onclick="alert('Cancelar inscrição: registra o cancelamento e avisa a comissão. (Simulado)')">
         <span class="ico">✕</span><span class="lab">Cancelar</span><span class="sub">cancelar toda a inscrição</span></div>
     </div>
   </div>`;
}

// ============ BUILD: ADMIN ============
function buildAdmin(){
  document.getElementById('adminContent').innerHTML = `
   <div class="admin-head">
     <div><h1>Administração · 50 Anos</h1><div class="s">Configurações do evento e cadastro da turma</div></div>
     <button class="sv" onclick="alert('No protótipo as alterações não são salvas. Na versão final, tudo seria gravado e refletido no site e no cadastro.')">Salvar alterações</button>
   </div>
   <div class="admin-tabs">
     <button class="admin-tab active" onclick="adminTab(this,'precos')">Preços & Custos</button>
     <button class="admin-tab" onclick="adminTab(this,'banner')">Banner do site</button>
     <button class="admin-tab" onclick="adminTab(this,'cadastro')">Cadastro da turma</button>
     <button class="admin-tab" onclick="adminTab(this,'param')">Parâmetros</button>
   </div>

   <div class="admin-pane active" id="ap-precos">
     <div class="admin-grid">
       <div class="admin-card"><h3>Bloco 1 · Churrasco</h3><div class="hs">Preço por pessoa (= custo)</div>
         <div class="item-row"><input value="Adulto (acima de 12)"><input class="price" value="180,00"><button class="del">×</button></div>
         <div class="item-row"><input value="Jovem (5 a 12)"><input class="price" value="90,00"><button class="del">×</button></div>
         <div class="item-row"><input value="Criança (até 4)"><input class="price" value="0,00"><button class="del">×</button></div>
         <button class="add-row">+ adicionar faixa</button></div>
       <div class="admin-card"><h3>Bloco 2 · Brindes</h3><div class="hs">Itens opcionais (= custo)</div>
         <div class="item-row"><input value="Camiseta"><input class="price" value="80,00"><button class="del">×</button></div>
         <div class="item-row"><input value="Medalha 50 anos"><input class="price" value="120,00"><button class="del">×</button></div>
         <div class="item-row"><input value="Livro da Turma"><input class="price" value="150,00"><button class="del">×</button></div>
         <button class="add-row">+ adicionar brinde</button></div>
       <div class="admin-card"><h3>Bloco 3 · Despesas comuns</h3><div class="hs">Custos fixos rateados</div>
         <div class="item-row"><input value="Placa alusiva"><input class="price" value="1.800,00"><button class="del">×</button></div>
         <div class="item-row"><input value="Crachás"><input class="price" value="600,00"><button class="del">×</button></div>
         <div class="item-row"><input value="Fotógrafo/vídeo"><input class="price" value="2.500,00"><button class="del">×</button></div>
         <div class="item-row"><input value="Músicos"><input class="price" value="1.500,00"><button class="del">×</button></div>
         <button class="add-row">+ adicionar despesa</button></div>
     </div>
     <div class="info-card"><h3>Patrocínio · cascata de aplicação</h3>
       <div class="info-row"><label>1º Patrocínio (Poupex)</label><input value="R$ 5.000,00"></div>
       <div class="info-row"><label>Aplicação 1</label><input value="Cobrir despesas comuns"></div>
       <div class="info-row"><label>2º Patrocínio</label><input value="(a definir)"></div>
       <div class="info-row"><label>Aplicação 2</label><input value="Subsidiar brinde mais barato"></div>
       <div class="info-row"><label>Sobra mínima p/ subsídio</label><input value="(a definir pela comissão)"></div>
     </div>
   </div>

   <div class="admin-pane" id="ap-banner">
     <div class="banner-config">
       <h3>Banner de evento na página inicial</h3>
       <div class="hs" style="font-family:'Cormorant Garamond',serif;color:var(--muted);font-style:italic;margin:6px 0 0">Controle o destaque que aparece no topo da página inicial do site.</div>
       <div class="toggle-row">
         <div class="toggle on" id="bannerToggle" onclick="this.classList.toggle('on');document.getElementById('eventBanner').style.display=this.classList.contains('on')?'block':'none'"></div>
         <div class="toggle-label">Exibir banner do evento<small>Quando ligado, aparece a chamada do evento ativo na página inicial, com link direto</small></div>
       </div>
       <div class="info-row"><label>Evento destacado</label><input value="Encontro 50 Anos da Entrada · 1977–2027"></div>
       <div class="info-row"><label>Texto da chamada</label><input value="Inscrições abertas — celebre meio século de história"></div>
       <div class="info-row"><label>Botão leva para</label><input value="Encontros › 50 Anos › Apresentação"></div>
       <div class="sync-note" style="margin-top:16px">Só deve haver banner quando há um evento ativo. Hoje é o caso (50 Anos). Quando o evento terminar, desligue aqui — a página inicial volta a ficar sem o destaque.</div>
     </div>
   </div>

   <div class="admin-pane" id="ap-cadastro">
     <div class="info-card" style="margin-bottom:20px;background:white;border-top:3px solid var(--gold)">
       <h3>Cadastro da turma (derivado da Matriz)</h3>
       <div style="font-family:'Cormorant Garamond',serif;color:var(--muted);font-style:italic;margin-bottom:16px">Este é o cadastro protegido que autoriza o login dos integrantes. Visível apenas para administradores. A amostra abaixo mostra a comissão (perfis de teste).</div>
       <div class="cadastro-toolbar">
         <input class="cad-search" placeholder="🔍 Buscar integrante por nome...">
         <button class="cad-btn" onclick="alert('Na versão final: adicionar/editar integrante diretamente, refletindo no login e no site.')">+ Novo integrante</button>
         <button class="cad-btn export" onclick="alert('Na versão final, este botão gera uma nova planilha Matriz (.xlsx) já com todas as atualizações feitas pelos integrantes e pela comissão — pronta para download.')">⬇ Exportar Matriz atualizada</button>
       </div>
       <table><thead><tr><th>#</th><th>Nome completo</th><th>E-mail</th><th>Telefone</th><th>Papel</th><th></th></tr></thead>
       <tbody><tr><td class="al">001</td><td class="nm">Rivail Luiz Cerqueira</td><td>riva.cerqueira@gmail.com</td><td>(13) 99149-3334</td><td>Coordenador / Suporte</td><td><button class="cad-edit">Editar</button></td></tr><tr><td class="al">002</td><td class="nm">André Luis Novaes Miranda</td><td>andre.novaes63@gmail.com</td><td>(24) 99883-0314</td><td>Presidente</td><td><button class="cad-edit">Editar</button></td></tr><tr><td class="al">003</td><td class="nm">Luiz Augusto Baggio</td><td>baggio@exemplo.com</td><td>(19) 00787-2000</td><td>Vice-Presidente</td><td><button class="cad-edit">Editar</button></td></tr><tr><td class="al">004</td><td class="nm">Newton Raulino</td><td>newtonraulino@hotmail.com</td><td>(61) 98337-6000</td><td>Coordenador</td><td><button class="cad-edit">Editar</button></td></tr><tr><td class="al">005</td><td class="nm">Everton Cesar Seraphim</td><td>everton@exemplo.com</td><td>(19) 99918-6110</td><td>O Lig EsPCEx</td><td><button class="cad-edit">Editar</button></td></tr><tr><td class="al">006</td><td class="nm">Guy Hermínio Rocha</td><td>guy@exemplo.com</td><td>(19) 98969-6157</td><td>Cerimonial</td><td><button class="cad-edit">Editar</button></td></tr><tr><td class="al">007</td><td class="nm">Marco Elias dos Santos</td><td>m.e.santos@uol.com.br</td><td>(12) 99782-1346</td><td>Brindes</td><td><button class="cad-edit">Editar</button></td></tr><tr><td class="al">008</td><td class="nm">Marcílio Pereira de Oliveira</td><td>marcilio.pereira.oliveira@gmail.com</td><td>(21) 7980-2873</td><td>Mídias</td><td><button class="cad-edit">Editar</button></td></tr></tbody></table>
       <div class="sync-note" style="margin-top:16px">Quando um integrante corrige os próprios dados em "Minha Conta", a alteração aparece aqui automaticamente. A comissão pode então exportar uma Matriz sempre atualizada — fechando o ciclo entre site e planilha.</div>
     </div>
   </div>

   <div class="admin-pane" id="ap-param">
     <div class="info-card"><h3>Parâmetros do evento</h3>
       <div class="info-row"><label>Data início</label><input value="26/02/2027"></div>
       <div class="info-row"><label>Data término</label><input value="27/02/2027"></div>
       <div class="info-row"><label>Hora pré-encontro</label><input value="20:00"></div>
       <div class="info-row"><label>Local</label><input value="EsPCEx · Campinas/SP"></div>
       <div class="info-row"><label>Limite de inscrições</label><input value="05/01/2027"></div>
       <div class="info-row"><label>Limite retardatários</label><input value="05/02/2027"></div>
       <div class="info-row"><label>Total de integrantes</label><input value="256"></div>
     </div>
   </div>`;
}
function adminTab(btn,id){
  document.querySelectorAll('.admin-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.admin-pane').forEach(p=>p.classList.remove('active'));
  document.getElementById('ap-'+id).classList.add('active');
}

// ============ BUILD: DASHBOARD ============
function buildDash(){
  document.getElementById('dashContent').innerHTML = `
   <div class="dash-head"><h1>Dashboard · 50 Anos</h1><div class="lu">Atualizado agora · dados ilustrativos</div></div>
   <div class="kpis">
     <div class="kpi"><div class="l">Inscritos</div><div class="v">87<small>/256</small></div><div class="t">34% da turma</div></div>
     <div class="kpi ok"><div class="l">Pagos</div><div class="v">65</div><div class="t">R$ 42.250 recebidos</div></div>
     <div class="kpi warn"><div class="l">Aguardando QR/Pgto</div><div class="v">18</div><div class="t">R$ 11.700 pendentes</div></div>
     <div class="kpi alert"><div class="l">Vencidos</div><div class="v">4</div><div class="t">reenviar QR Code</div></div>
   </div>
   <div class="dash-grid">
     <div class="panel"><div class="panel-head"><h3>Adesões por status</h3><span class="pt">87 inscritos</span></div>
       <div class="status-grid">
         <div class="st-block cf"><div class="n">65</div><div class="l">Pagos</div></div>
         <div class="st-block qs"><div class="n">12</div><div class="l">QR enviado</div></div>
         <div class="st-block wq"><div class="n">6</div><div class="l">Aguarda QR</div></div>
         <div class="st-block ov"><div class="n">4</div><div class="l">Vencido</div></div>
         <div class="st-block gu"><div class="n">3</div><div class="l">Desistência</div></div>
       </div>
       <div class="bars" style="border-top:1px solid var(--gold-line)">
         <div class="bar-row"><div class="bar-head"><span class="l">1ª Companhia</span><span class="v">31 / 94</span></div><div class="bar-track"><div class="bar-fill" style="width:33%"></div></div></div>
         <div class="bar-row"><div class="bar-head"><span class="l">2ª Companhia</span><span class="v">22 / 60</span></div><div class="bar-track"><div class="bar-fill" style="width:37%"></div></div></div>
         <div class="bar-row"><div class="bar-head"><span class="l">3ª Companhia</span><span class="v">34 / 102</span></div><div class="bar-track"><div class="bar-fill" style="width:33%"></div></div></div>
       </div>
     </div>
     <div class="panel"><div class="panel-head"><h3>Efetivo do churrasco</h3><span class="pt">Casa de Barcos</span></div>
       <div class="efetivo-grid">
         <div class="ef-block"><div class="n">142</div><div class="l">Adultos</div><div class="sub">R$ 180</div></div>
         <div class="ef-block"><div class="n">23</div><div class="l">Jovens</div><div class="sub">R$ 90</div></div>
         <div class="ef-block"><div class="n">8</div><div class="l">Crianças</div><div class="sub">cortesia</div></div>
       </div>
       <div style="padding:0 22px 22px"><div class="finance-row total"><span class="l">Total de pessoas</span><span class="v">173</span></div></div>
     </div>
   </div>
   <div class="dash-grid" style="grid-template-columns:1fr 1fr">
     <div class="panel"><div class="panel-head"><h3>Grade de camisetas</h3><span class="pt">61 unidades</span></div>
       <div class="sizes-dash">
         <div class="sz-block"><div class="sz">PP</div><div class="qt">3</div></div>
         <div class="sz-block"><div class="sz">P</div><div class="qt">7</div></div>
         <div class="sz-block"><div class="sz">M</div><div class="qt">14</div></div>
         <div class="sz-block"><div class="sz">G</div><div class="qt">18</div></div>
         <div class="sz-block"><div class="sz">GG</div><div class="qt">12</div></div>
         <div class="sz-block"><div class="sz">XGG</div><div class="qt">5</div></div>
         <div class="sz-block"><div class="sz">XXGG</div><div class="qt">2</div></div>
       </div>
     </div>
     <div class="panel"><div class="panel-head"><h3>Balanço financeiro</h3><span class="pt">projeção</span></div>
       <div style="padding:20px">
         <div class="finance-row"><span class="l">Receita inscrições</span><span class="v">R$ 53.950</span></div>
         <div class="finance-row"><span class="l">Patrocínio</span><span class="v">R$ 5.000</span></div>
         <div class="finance-row"><span class="l">Despesas comuns</span><span class="v">− R$ 6.400</span></div>
         <div class="finance-row"><span class="l">Custo churrasco/brindes</span><span class="v">− R$ 53.950</span></div>
         <div class="finance-row total"><span class="l">Saldo projetado</span><span class="v">− R$ 1.400</span></div>
       </div>
     </div>
   </div>
   <div class="sync-note" style="max-width:none;margin-top:6px">Como os preços cobrados são iguais aos custos, o saldo reflete essencialmente <strong>Patrocínio − Despesas Comuns</strong>. Com mais patrocínio, o saldo fecha positivo. <em>(Números ilustrativos no protótipo.)</em></div>`;
}
