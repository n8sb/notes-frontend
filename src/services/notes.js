import axios from 'axios';
const baseUrl = '/api/notes';

const getAllNotes = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createNote = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const updateNote = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default { getAllNotes, createNote, updateNote };
