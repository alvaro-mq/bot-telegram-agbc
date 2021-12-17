const axios = require('axios');
require('dotenv').config();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
const { URL_AGBC } = process.env;
const request = axios.create({
  baseUrl: URL_AGBC,
  timeout: 80000,
});

const getData = async (dep) => {
  try {
    const url = `${URL_AGBC}/${dep}`;
    const response = await request.get(encodeURI(url));
    const { data } = response;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const search = (response, text) => response.filter((row) => 
  row.destinatario.includes(text) || row.destinatario.trim() === text || row.nro_certificado === text);

module.exports = { getData, search };