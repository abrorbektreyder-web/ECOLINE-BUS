const from = 'Toshkent';
const to = 'Buxoro';
const url = `http://localhost:3000/api/search?from=${from}&to=${to}&date=2026-04-06`;
fetch(url).then(res => res.json()).then(console.log).catch(console.error);
