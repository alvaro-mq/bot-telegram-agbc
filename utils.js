const getText = (ctx) => {
  let text = ctx.update.message.text.split(' ');
  if (text.length > 1) {
    text = text.slice(1).join(' ');
  } else {
    text = null;
  }
  return text;
};

const makeHtml = (row) => {
  console.log('row', row);
  const html = `
    <i>✅ Resultado encontrado:</i>
    <b>Destinatario:</b> ${row.destinatario}
    <b>Nro. Seguimiento:</b> ${row.nro_certificado}
    <b>Recojo:</b> ${row.categoria}
    <b>Fecha de registro:</b> ${row.fecha_registro}
  `;
  console.log(html);
  return html;
};

const getMenuConfig = () => [
  {
    id: 1,
    text: 'LA PAZ',
    callback_data: 'laPaz',
  },
  {
    id: 1,
    text: 'COCHABAMBA',
    callback_data: 'cochabamba',
  }
];

module.exports = { getText, makeHtml, getMenuConfig };