const form = document.getElementById('grade-form');
const statusEl = document.getElementById('status');
const table = document.getElementById('grades-table');
const tbody = table.querySelector('tbody');
const downloadBtn = document.getElementById('download-btn');
let lastData = null;

function extractScore(subGrades, type) {
  const item = (subGrades || []).find(s => s.subGradeType && s.subGradeType.nameZh === type);
  return item ? item.result : null;
}

function parseFromDetail(detail, key) {
  if (!detail) return null;
  const regex = new RegExp(`${key}[:：]\\s*(\\d+(?:\\.\\d+)?)`);
  const match = detail.match(regex);
  return match ? match[1] : null;
}

function renderTable(data) {
  tbody.innerHTML = '';
  data.forEach(course => {
    const row = document.createElement('tr');
    const pingshi = extractScore(course.subGrades, '平时成绩') || parseFromDetail(course.gradeDetail, '平时成绩') || 'N/A';
    const qimo = extractScore(course.subGrades, '期末成绩') || parseFromDetail(course.gradeDetail, '期末成绩') || 'N/A';
    const final = course.finalGrade ?? 'N/A';

    row.innerHTML = `
      <td>${course.courseNameZh || '未知课程'}</td>
      <td>${pingshi}</td>
      <td>${qimo}</td>
      <td>${final}</td>
    `;
    tbody.appendChild(row);
  });
  table.hidden = false;
  downloadBtn.hidden = false;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const idToken = document.getElementById('idToken').value.trim();
  const serverName = 'c4';

  statusEl.textContent = '正在获取成绩...';
  table.hidden = true;
  downloadBtn.hidden = true;

  try {
    const res = await fetch(`/api/grades?idToken=${encodeURIComponent(idToken)}&serverName=${encodeURIComponent(serverName)}`);
    const data = await res.json();
    if (!res.ok || data.result !== 0) {
      const msg = data.message || '请求失败';
      statusEl.textContent = `获取失败：${msg}`;
      return;
    }
    statusEl.textContent = '获取成功';
    lastData = data;
    renderTable(data.data || []);
  } catch (err) {
    statusEl.textContent = `发生错误：${err.message}`;
  }
});

downloadBtn.addEventListener('click', () => {
  if (!lastData) return;
  const blob = new Blob([JSON.stringify(lastData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'grades_data.json';
  a.click();
  URL.revokeObjectURL(url);
});
