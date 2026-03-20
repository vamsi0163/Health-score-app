import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});

export const submitHealthData = (data) =>
  API.post('/health-score', data).then((res) => res.data);

export const fetchRecords = () =>
  API.get('/records').then((res) => res.data);

export const deleteRecord = (id) =>
  API.delete(`/records/${id}`).then((res) => res.data);
