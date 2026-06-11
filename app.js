let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let total = 0;


function mostrarUsuarios() {
  let ul = document.getElementById('usuarios');
  ul.innerHTML = '';
  if (usuarios.length === 0) {
    ul.innerHTML = '<li class="text-muted small">No hay usuarios registrados.</li>';
    return;
  }
  usuarios.forEach((u, i) => {
    ul.innerHTML += `<li class="mb-1">${u.nombre} — ${u.rut}
      <button onclick="eliminarUsuario(${i})" class="btn btn-danger btn-sm ms-2 py-0">Eliminar</button>
    </li>`;
  });
}

function validarRut(rut) {
  if (!rut.includes('-')) return false;
  const [cuerpo, dv] = rut.split('-');
  const nums = cuerpo.replace(/\./g, '');
  if (!/^\d{7,8}$/.test(nums)) return false;

  let suma = 0, mult = 2;
  for (let i = nums.length - 1; i >= 0; i--) {
    suma += parseInt(nums[i]) * mult;
    mult = mult === 7 ? 2 : mult + 1;
  }
  const resto = suma % 11;
  const dvEsperado = resto === 1 ? 'k' : resto === 0 ? '0' : String(11 - resto);
  return dv.toLowerCase() === dvEsperado;
}

function agregarUsuario() {
  let nombre = document.getElementById('nombre').value.trim();
  let rut    = document.getElementById('rut').value.trim();
  let errRut = document.getElementById('errRut');

  if (nombre === '') { alert('Ingrese nombre'); return; }

  if (!validarRut(rut)) {
    errRut.style.display = 'block';
    return;
  }
  errRut.style.display = 'none';

  usuarios.push({ nombre, rut });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  document.getElementById('nombre').value = '';
  document.getElementById('rut').value    = '';
  mostrarUsuarios();
}

function eliminarUsuario(i) {
  usuarios.splice(i, 1);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  mostrarUsuarios();
}

function agregarCarrito(nombre, precio) {
  let li = document.createElement('li');
  li.innerText = nombre + ' - $' + precio;
  document.getElementById('carrito').appendChild(li);
  total += precio;
  document.getElementById('total').innerText = total;
}

function vaciarCarrito() {
  document.getElementById('carrito').innerHTML = '';
  total = 0;
  document.getElementById('total').innerText = 0;
}


function calcularEdad() {
  let fecha = new Date(document.getElementById('fecha').value + 'T00:00:00');
  let hoy   = new Date();
  if (!document.getElementById('fecha').value) { alert('Seleccione una fecha'); return; }

  let edad  = hoy.getFullYear() - fecha.getFullYear();
  let meses = hoy.getMonth() - fecha.getMonth();
  if (meses < 0 || (meses === 0 && hoy.getDate() < fecha.getDate())) edad--;

  document.getElementById('edad').innerText = 'Edad: ' + edad + ' años';
}


function encriptar() {
  let txt = document.getElementById('texto').value;
  if (!txt) { alert('Ingrese texto'); return; }
  let cifrado = btoa(unescape(encodeURIComponent(txt)));
  localStorage.setItem('textoCifrado', cifrado);
  document.getElementById('resultado').innerText = '🔒 ' + cifrado;
}

function desencriptar() {
  let cifrado = localStorage.getItem('textoCifrado') || document.getElementById('resultado').innerText.replace('🔒 ', '');
  if (!cifrado) { alert('No hay texto cifrado guardado'); return; }
  try {
    let original = decodeURIComponent(escape(atob(cifrado)));
    document.getElementById('resultado').innerText = '🔓 ' + original;
  } catch(e) {
    document.getElementById('resultado').innerText = 'Error al desencriptar';
  }
}

async function consultarAPI() {
  try {
    let pesos = document.getElementById('pesos').value;
    if (!pesos || pesos <= 0) { alert('Ingrese un monto válido'); return; }
    document.getElementById('api').innerText = 'Consultando...';
    let r = await fetch('https://mindicador.cl/api');
    let d = await r.json();
    document.getElementById('api').innerHTML =
      'UF: '   + (pesos / d.uf.valor).toFixed(2)   + '<br>' +
      'Euro: '  + (pesos / d.euro.valor).toFixed(2)  + '<br>' +
      'USD: '   + (pesos / d.dolar.valor).toFixed(2)  + '<br>' +
      'UTM: '   + (pesos / d.utm.valor).toFixed(4);
  } catch(e) {
    document.getElementById('api').innerText = 'Error al consultar la API';
  }
}

mostrarUsuarios();
