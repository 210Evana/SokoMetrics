import axios from 'axios';

const API = axios.create({
  baseURL: 'https://sokometrics.onrender.com/api',
});

export const getCompanies = () => API.get('/companies');
export const getCompany = (ticker) => API.get(`/companies/${ticker}`);
export const getPrices = (ticker, from, to) =>
  API.get(`/prices/${ticker}`, { params: { from, to } });
export const getFinancials = (ticker) => API.get(`/financials/${ticker}`);
export const getRatios = (ticker) => API.get(`/financials/${ticker}/ratios`);
export const getGlossary = () => API.get('/education/glossary');

export default API;