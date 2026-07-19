const html = JSON.stringify({
  name: 'engine-server',
  version: '1.0.0',
  status: 'running',
  message: 'AI Agent Engine Server'
});

const health = JSON.stringify({
  status: 'healthy',
  timestamp: new Date().toISOString()
});

const tools = JSON.stringify({
  tools: [
    { id: 'calculator', name: 'Calculator', description: 'Math expressions' },
    { id: 'datetime', name: 'DateTime', description: 'Date/time operations' }
  ],
  total: 2
});

const skills = JSON.stringify({
  skills: [],
  total: 0
});

const routes = {
  '/': html,
  '/api': html,
  '/api/health': health,
  '/api/tools': tools,
  '/api/skills': skills,
};

module.exports = (req, res) => {
  const url = req.url || '/';
  const path = url.split('?')[0];
  
  const body = routes[path] || JSON.stringify({ error: 'Not Found', path });
  const statusCode = routes[path] ? 200 : 404;
  
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(body);
};
