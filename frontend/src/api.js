// import axios from 'axios';

// export const API_BASE = import.meta.env.VITE_API_URL ?? (import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '');

// export const api = axios.create({
//   baseURL: API_BASE || '/',
// });

// export const getImageUrl = (imageUrl) => {
//   if (!imageUrl) return '';
//   return imageUrl.startsWith('http') ? imageUrl : `${API_BASE}${imageUrl}`;
// };
import axios from 'axios';

export const API_BASE =
  import.meta.env.VITE_API_URL ||
  'https://shopforge-1-0g0t.onrender.com';

export const api = axios.create({
  baseURL: API_BASE,
});

export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  return imageUrl.startsWith('http')
    ? imageUrl
    : `${API_BASE}${imageUrl}`;
};