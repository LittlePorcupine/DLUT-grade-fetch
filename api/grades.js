export default async function handler(req, res) {
  const { idToken, serverName } = req.method === 'POST' ? req.body : req.query;

  if (!idToken || !serverName) {
    return res.status(400).json({ error: 'Missing idToken or serverName' });
  }

  const targetUrl = 'http://jxgl.dlut.edu.cn/eams-micro-server/api/v1/grade/student/grades';

  const headers = {
    'Accept': 'application/json',
    'X-Id-Token': idToken,
    'Referer': `http://jxgl.dlut.edu.cn/eams-student-grade-app/index.html?idToken=${idToken}`,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
    'Cookie': `SERVERNAME=${serverName}; userToken=${idToken}`
  };

  try {
    const response = await fetch(targetUrl, { headers });
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch grades', detail: err.message });
  }
}
