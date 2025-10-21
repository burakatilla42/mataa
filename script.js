
document.getElementById('year').textContent = new Date().getFullYear();

let menu = [];
const cart = [];

function fetchMenu(){
  fetch('menu.json').then(r=>r.json()).then(data=>{
    menu = data.items || [];
    renderMenu();
  }).catch(err=>{
    console.error('menu.json yüklenemedi', err);
    document.getElementById('menuGrid').innerHTML = '<p>Menü yüklenemedi.</p>';
  });
}

function renderMenu(){
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = '';
  menu.forEach((it, idx)=>{
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.innerHTML = `
      <img src="images/${it.img}" alt="${it.name}">
      <div class="meta">
        <h4>${it.name}</h4>
        <p>${it.desc || ''}</p>
      </div>
      <div class="card-foot">
        <strong>${it.price} TL</strong>
        <button class="add" data-idx="${idx}">Sepete Ekle</button>
      </div>
    `;
    grid.appendChild(card);
  });
  // attach listeners
  document.querySelectorAll('.add').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const idx = parseInt(e.target.dataset.idx,10);
      addToCart(menu[idx]);
    });
  });
  renderCart();
}

function addToCart(item){
  const existing = cart.find(c=>c.name===item.name);
  if(existing) existing.qty += 1;
  else cart.push({name:item.name, price:item.price, qty:1});
  renderCart();
}

function renderCart(){
  const list = document.getElementById('cartList');
  const totalEl = document.getElementById('cartTotal');
  list.innerHTML = '';
  let total = 0;
  cart.forEach((it, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${it.name} x${it.qty}</span><strong>${it.price*it.qty} TL</strong>`;
    list.appendChild(li);
    total += it.price*it.qty;
  });
  totalEl.textContent = cart.length ? 'Toplam: ' + total + ' TL' : 'Sepet boş.';
}

function handleOrder(e){
  e.preventDefault();
  if(cart.length === 0){
    alert('Lütfen önce sepete ürün ekleyin.');
    return false;
  }
  const form = e.target;
  const name = form.name.value.trim();
  const address = form.address.value.trim();
  const phone = form.phone.value.trim();
  const note = form.note.value.trim();

  let msg = 'Yeni sipariş%0A';
  msg += 'İsim: ' + encodeURIComponent(name) + '%0A';
  msg += 'Telefon: ' + encodeURIComponent(phone) + '%0A';
  msg += 'Adres: ' + encodeURIComponent(address) + '%0A%0A';
  msg += 'Sipariş:%0A';

  let total = 0;
  cart.forEach(it => {
    msg += '- ' + encodeURIComponent(it.name) + ' x' + it.qty + ' = ' + (it.price*it.qty) + ' TL%0A';
    total += it.price*it.qty;
  });

  msg += '%0AToplam: ' + total + ' TL%0A';
  if(note) msg += '%0ANot: ' + encodeURIComponent(note) + '%0A';

  const waNumber = '905380223442';
  const waUrl = 'https://wa.me/' + waNumber + '?text=' + msg;
  window.open(waUrl, '_blank');
  return false;
}

fetchMenu();
