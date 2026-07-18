// frontend/src/api/client.ts
// Axios instance with base URL configured.

import axios from 'axios'

const client = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s — AI calls can take time
})

export default client
