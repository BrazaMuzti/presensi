// Konfigurasi Aplikasi
const APP_CONFIG = {
    SPREADSHEET_ID: '1JqCQR3r1ctBm0O2pT_jnAkqRHp1N9KH0E2lQ2H9RTP0',
    SHEET_NAMES: {
        SISWA: 'Siswa',
        GURU: 'Guru',
        ABSEN: 'Absensi',
        JADWAL: 'Jadwal',
        LIBUR: 'Libur'
    }
};

// State Global
let currentUser = null;
let currentRole = null;
let allSiswa = [];
let allGuru = [];
let allAbsensi = [];
let allJadwal = [];
let allLibur = [];

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    // Set default date pada filter bulan
    const now = new Date();
    document.getElementById('filterBulan').value = now.getMonth();
    document.getElementById('laporanBulan').value = now.getMonth();

    // Event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('toggleSidebar').addEventListener('click', toggleSidebar);

    // Menu navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            navigateTo(page);
        });
    });

    // Update jam
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Fungsi Global
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));

    // Show selected page
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
        document.querySelector(`[data-page="${page}"]`).classList.add('active');
        document.getElementById('pageTitle').textContent = document.querySelector(`[data-page="${page}"]`).textContent.trim();
    }
}

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
    document.getElementById('currentDateTime').textContent = now.toLocaleDateString('id-ID', options);
}

function refreshData() {
    showToast('Memuat data...', 'warning');
    // Panggil fungsi refresh dari masing-masing module
    if (currentRole === 'admin' || currentRole === 'guru') {
        loadAllData();
    } else if (currentRole === 'siswa') {
        loadSiswaData();
    }
}

// Login Handler
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.querySelector('input[name="role"]:checked').value;

    if (!username || !password) {
        showToast('Username dan password harus diisi!', 'error');
        return;
    }

    try {
        // Simulasi validasi (nanti terhubung dengan spreadsheet)
        const user = await validateUser(username, password, role);
        if (user) {
            currentUser = user;
            currentRole = role;
            document.getElementById('userName').textContent = user.nama || username;
            document.getElementById('loginPage').classList.remove('active');
            document.getElementById('mainApp').classList.add('active');

            // Sesuaikan menu berdasarkan role
            adjustMenuByRole(role);

            // Load data
            if (role === 'admin' || role === 'guru') {
                loadAllData();
            } else {
                loadSiswaData();
            }

            showToast(`Selamat datang ${user.nama || username}!`, 'success');
        } else {
            showToast('Username atau password salah!', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        currentUser = null;
        currentRole = null;
        document.getElementById('mainApp').classList.remove('active');
        document.getElementById('loginPage').classList.add('active');
        document.getElementById('loginForm').reset();
        showToast('Anda telah logout', 'success');
    }
}

// Validasi User (Simulasi - nanti integrasi spreadsheet)
function validateUser(username, password, role) {
    return new Promise((resolve) => {
        // Simulasi delay
        setTimeout(() => {
            // Untuk demo, hardcode beberapa user
            const users = {
                'admin': { nama: 'Admin Sekolah', password: 'admin123' },
                'guru': { nama: 'Guru Matematika', password: 'guru123' },
                'siswa': { nama: 'Ahmad Fauzi', password: 'siswa123' }
            };

            if (users[username] && users[username].password === password) {
                resolve({ nama: users[username].nama, username });
            } else {
                resolve(null);
            }
        }, 500);
    });
}

// Adjust Menu by Role
function adjustMenuByRole(role) {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const page = item.dataset.page;
        if (role === 'siswa') {
            // Siswa hanya bisa melihat dashboard, scan absen, dan profile
            const allowed = ['dashboard', 'scan-absen'];
            if (!allowed.includes(page)) {
                item.style.display = 'none';
            } else {
                item.style.display = 'flex';
            }
        } else {
            item.style.display = 'flex';
        }
    });
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Load All Data (Admin & Guru)
function loadAllData() {
    // Panggil fungsi dari module masing-masing
    if (typeof loadDashboard === 'function') loadDashboard();
    if (typeof loadSiswaData === 'function') loadSiswaData();
    if (typeof loadGuruData === 'function') loadGuruData();
    if (typeof loadJadwalData === 'function') loadJadwalData();
    if (typeof loadLiburData === 'function') loadLiburData();
}

// Fungsi untuk generate QR Code
function generateQRCode(data) {
    const qrContainer = document.getElementById('qrResult');
    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: data,
        width: 128,
        height: 128,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Fungsi untuk mendapatkan lokasi GPS
function getLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve('Geolokasi tidak didukung');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve(`Lat: ${latitude}, Lng: ${longitude}`);
            },
            () => {
                resolve('Gagal mendapatkan lokasi');
            }
        );
    });
}
