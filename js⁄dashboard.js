// Dashboard Module
let chartInstance = null;

function loadDashboard() {
  updateStats();
  updateChart();
  updateFilters();
}

function updateStats() {
  // Ambil data dari spreadsheet atau state
  const total = allSiswa.length || 0;
  const hadir = allAbsensi.filter(a => a.status === 'Hadir').length || 0;
  const sakit = allAbsensi.filter(a => a.status === 'Sakit').length || 0;
  const izin = allAbsensi.filter(a => a.status === 'Izin').length || 0;
  const alpha = allAbsensi.filter(a => a.status === 'Alpha').length || 0;

  document.getElementById('totalSiswa').textContent = total;
  document.getElementById('totalHadir').textContent = hadir;
  document.getElementById('totalSakit').textContent = sakit;
  document.getElementById('totalIzin').textContent = izin;
  document.getElementById('totalAlpha').textContent = alpha;
}

function updateChart() {
  const ctx = document.getElementById('kehadiranChart').getContext('2d');

  if (chartInstance) {
    chartInstance.destroy();
  }

  // Data contoh (nanti dari spreadsheet)
  const data = {
    labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
    datasets: [
      {
        label: 'Hadir',
        data: [45, 48, 42, 50],
        backgroundColor: 'rgba(46, 204, 113, 0.6)',
        borderColor: '#2ecc71',
        borderWidth: 2
      },
      {
        label: 'Sakit',
        data: [5, 3, 8, 4],
        backgroundColor: 'rgba(241, 196, 15, 0.6)',
        borderColor: '#f1c40f',
        borderWidth: 2
      },
      {
        label: 'Izin',
        data: [8, 10, 6, 7],
        backgroundColor: 'rgba(52, 152, 219, 0.6)',
        borderColor: '#3498db',
        borderWidth: 2
      },
      {
        label: 'Alpha',
        data: [2, 4, 3, 1],
        backgroundColor: 'rgba(231, 76, 60, 0.6)',
        borderColor: '#e74c3c',
        borderWidth: 2
      }
    ]
  };

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function updateFilters() {
  // Update filter kelas dari data siswa
  const kelasSet = new Set(allSiswa.map(s => s.kelas).filter(k => k));
  const selects = ['filterKelas', 'filterSiswaKelas', 'filterGuruKelas', 'laporanKelas', 'jadwalKelas'];

  selects.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = '<option value="all">Semua Kelas</option>';
    kelasSet.forEach(kelas => {
      const option = document.createElement('option');
      option.value = kelas;
      option.textContent = kelas;
      select.appendChild(option);
    });
    if (currentValue) select.value = currentValue;
  });
}

function updateDashboard() {
  loadDashboard();
}
