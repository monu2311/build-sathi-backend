import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 BuildSathi Backend Started');
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/health`);
});