// ============================================================
// DASHBOARD MODULE
// ============================================================

let chartInstance = null;

// ============================================================
// LOAD DASHBOARD
// ============================================================
function loadDashboard() {
    updateStats();
    updateChart();
    updateFilters();
}

// ============================================================
// UPDATE STATS
// ============================================================
function updateStats() {
    const total = allSiswa.length || 0;
    const today = new Date().toISOString().split('T')[0];
    const todayAbsen = allAbsensi.filter(a => a.tanggal === today);
    const hadir = todayAbsen.filter(a => a.status === 'Hadir').length || 0;
    const sakit = todayAbsen.filter(a => a.status === 'Sakit').length || 0;
    const izin = todayAbsen.filter(a => a.status === 'Izin').length || 0;
    const alpha = todayAbsen.filter(a => a.status === 'Alpha').length || 0;

    document.getElementById('totalSiswa').textContent = total;
    document.getElementById('totalHadir').textContent = hadir;
    document.getElementById('totalSakit').textContent = sakit;
    document.getElementById('totalIzin').textContent = izin;
    document.getElementById('totalAlpha').textContent = alpha;
    document.getElementById('siswaCount').textContent = total;
}

// ============================================================
// UPDATE CHART
// ============================================================
function updateChart() {
    const ctx = document.getElementById('kehadiranChart').getContext('2d');

    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    // Data statis untuk stabilitas
    const data = {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        datasets: [{
            label: 'Hadir',
            data: [45, 48, 42, 50],
            backgroundColor: 'rgba(16, 185, 129, 0.7)',
            borderColor: '#10b981',
            borderWidth: 2,
            borderRadius: 4
        }, {
            label: 'Sakit',
            data: [5, 3, 8, 4],
            backgroundColor: 'rgba(245, 158, 11, 0.7)',
            borderColor: '#f59e0b',
            borderWidth: 2,
            borderRadius: 4
        }, {
            label: 'Izin',
            data: [8, 10, 6, 7],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: '#3b82f6',
            borderWidth: 2,
            borderRadius: 4
        }, {
            label: 'Alpha',
            data: [2, 4, 3, 1],
            backgroundColor: 'rgba(239, 68, 68, 0.7)',
            borderColor: '#ef4444',
            borderWidth: 2,
            borderRadius: 4
        }]
    };

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 11 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// ============================================================
// UPDATE FILTERS
// ============================================================
function updateFilters() {
    const kelasSet = new Set(allSiswa.map(s => s.kelas).filter(k => k));
    const selects = ['filterKelas', 'filterSiswaKelas', 'filterGuruKelas', 'laporanKelas', 'jadwalKelas',
    'kelolaKelas', 'manualKelas'
    ];

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

        updateManualSiswa();
}

// ============================================================
// UPDATE DASHBOARD
// ============================================================
function updateDashboard() {
    loadDashboard();
}
