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

    // Data dari absensi atau demo
    const today = new Date().toISOString().split('T')[0];
    const todayAbsen = allAbsensi.filter(a => a.tanggal === today);
    
    // Jika tidak ada data absensi, gunakan data demo
    const hadir = todayAbsen.filter(a => a.status === 'Hadir').length || 25;
    const sakit = todayAbsen.filter(a => a.status === 'Sakit').length || 5;
    const izin = todayAbsen.filter(a => a.status === 'Izin').length || 8;
    const alpha = todayAbsen.filter(a => a.status === 'Alpha').length || 3;

    const data = {
        labels: ['Hadir', 'Sakit', 'Izin', 'Alpha'],
        datasets: [{
            label: 'Kehadiran Hari Ini',
            data: [hadir, sakit, izin, alpha],
            backgroundColor: [
                'rgba(16, 185, 129, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(59, 130, 246, 0.7)',
                'rgba(239, 68, 68, 0.7)'
            ],
            borderColor: [
                '#10b981',
                '#f59e0b',
                '#3b82f6',
                '#ef4444'
            ],
            borderWidth: 2,
            borderRadius: 4
        }]
    };

    chartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 16,
                        font: { size: 12 }
                    }
                }
            },
            cutout: '65%'
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