export default {
  server: {
    proxy: {
      "/api": "http://localhost:5000", // Backend server URL
    },
  },
};