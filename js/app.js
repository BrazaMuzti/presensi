// ============================================================
// APP MAIN - STATE & GLOBAL FUNCTIONS
// ============================================================

// ============================================================
// STATE
// ============================================================
let currentUser = null;
let currentRole = null;
let currentUsername = null;
let isAppReady = false;

// Data arrays
let allSiswa = [];
let allGuru = [];
let allAbsensi = [];
let allJadwal = [];
let allLibur = [];
let scanLogData = [];

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 App initializing...');
    console.log('📊 Config:', APP_CONFIG);
    
    // Set default bulan
    const now = new Date();
    const bulanSelect = document.getElementById('filterBulan');
    if (bulanSelect) bulanSelect.value = now.getMonth();
    
    const laporanBulan = document.getElementById('laporanBulan');
    if (laporanBulan) laporanBulan.value = now.getMonth();

    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateTo(page);
        });
    });

    // Update time
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Load data awal
    loadAllData();
    
    // Cek koneksi ke server
    checkServerConnection();
    
    isAppReady = true;
    console.log('✅ App ready');
});

// ============================================================
// CEK KONEKSI SERVER
// ============================================================
async function checkServerConnection() {
    try {
        const url = APP_CONFIG.WEB_APP_URL;
        if (!url || url.includes('YOUR_DEPLOYMENT_ID')) {
            console.warn('⚠️ Web App URL belum dikonfigurasi, menggunakan mode demo');
            return;
        }
        
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Server connected:', data);
            showToast('Terhubung ke server', 'success');
        } else {
            console.warn('⚠️ Server responded with status:', response.status);
            showToast('Mode Demo - Tidak terhubung ke server', 'warning');
        }
    } catch (error) {
        console.warn('⚠️ Cannot connect to server, using demo mode:', error.message);
        showToast('Mode Demo - Menggunakan data lokal', 'warning');
    }
}

// ============================================================
// NAVIGATION
// ============================================================
function navigateTo(page) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(m => m.classList.remove('active'));

    const pageMap = {
        'dashboard': 'dashboardPage',
        'data-siswa': 'dataSiswaPage',
        'data-guru': 'dataGuruPage',
        'laporan': 'laporanPage',
        'kelola-absen': 'kelolaAbsenPage',
        'scan-absen': 'scanAbsenPage'
    };

    if (pageMap[page]) {
        document.getElementById(pageMap[page]).classList.add('active');
        const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
        if (navItem) navItem.classList.add('active');
        document.getElementById('pageTitle').textContent = navItem ? navItem.textContent.trim().replace(/[0-9]/g, '') : page;
    }
}

// ============================================================
// DATE TIME
// ============================================================
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const el = document.getElementById('currentDateTime');
    if (el) el.textContent = now.toLocaleDateString('id-ID', options);
}

// ============================================================
// REFRESH DATA
// ============================================================
function refreshData() {
    showToast('Memuat data...', 'info');
    if (currentRole === 'admin' || currentRole === 'guru') {
        loadAllData();
    } else if (currentRole === 'siswa') {
        loadSiswaData();
    }
}

// ============================================================
// LOAD ALL DATA
// ============================================================
async function loadAllData() {
    console.log('Loading all data...');
    await loadSiswaData();
    await loadGuruData();
    await loadJadwalData();
    await loadLiburData();
    loadDashboard();

    // Update manual siswa
    updateManualSiswa();

    // Setup tanggal options
    const today = new Date().toISOString().split('T')[0];
    const tanggalSelect = document.getElementById('kelolaTanggal');
    if (tanggalSelect) {
        tanggalSelect.innerHTML = `<option value="">Pilih Tanggal</option><option value="${today}">Hari Ini</option>`;
        for (let i = 1; i <= 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const d = date.toISOString().split('T')[0];
            tanggalSelect.innerHTML += `<option value="${d}">${d}</option>`;
        }
    }

    // Update jadwal kelas options
    const kelasSet = new Set(allSiswa.map(s => s.kelas).filter(k => k));
    const jadwalSelect = document.getElementById('jadwalKelas');
    if (jadwalSelect) {
        jadwalSelect.innerHTML = '<option value="">Pilih Kelas</option>';
        kelasSet.forEach(kelas => {
            const option = document.createElement('option');
            option.value = kelas;
            option.textContent = kelas;
            jadwalSelect.appendChild(option);
        });
    }
}

// ============================================================
// MODAL SYSTEM
// ============================================================
function showModal(title, content) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'customModal';
    overlay.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
}

function closeModal() {
    const modal = document.getElementById('customModal');
    if (modal) modal.remove();
}

// ============================================================
// TOAST
// ============================================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) {
        console.warn('Toast container not found');
        return;
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}