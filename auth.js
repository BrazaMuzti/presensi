// ============================================================
// AUTHENTICATION SYSTEM
// ============================================================

// ============================================================
// LOGIN HANDLER
// ============================================================
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
        const result = await callAPI(APP_CONFIG.API.LOGIN, {
            username,
            password,
            role
        });

        if (result && result.success) {
            const user = result.user;
            currentUser = user;
            currentRole = role;
            currentUsername = username;

            // Sembunyikan login
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('mainApp').classList.add('active');

            // Update user info
            document.getElementById('userName').textContent = user.nama || username;
            document.getElementById('userAvatar').textContent = (user.nama || username).charAt(0).toUpperCase();
            document.getElementById('userRole').textContent = role.charAt(0).toUpperCase() + role.slice(1);

            adjustMenuByRole(role);

            // Load data
            if (role === 'admin' || role === 'guru') {
                loadAllData();
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.style.display = 'flex';
                });
            } else if (role === 'siswa') {
                loadSiswaData();
                // Sembunyikan menu scan untuk siswa
                document.querySelectorAll('.nav-item').forEach(item => {
                    const page = item.dataset.page;
                    if (page === 'scan-absen') {
                        item.style.display = 'none';
                    } else {
                        item.style.display = 'flex';
                    }
                });
                // Sembunyikan tombol tambah siswa
                document.querySelector('#dataSiswaPage .btn-primary')?.remove();
                // Sembunyikan tombol hapus siswa
                document.querySelectorAll('#siswaTableBody .btn-danger').forEach(btn => btn.style.display = 'none');
            }

            showToast(`Selamat datang ${user.nama || username}!`, 'success');
        } else {
            showToast(result?.message || 'Username atau password salah!', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error(error);
    }
}

// ============================================================
// LOGOUT
// ============================================================
function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        // Reset semua state
        currentUser = null;
        currentRole = null;
        currentUsername = null;
        scanActive = false;
        if (scanStream) {
            scanStream.getTracks().forEach(track => track.stop());
            scanStream = null;
        }
        document.getElementById('video').srcObject = null;

        // Reset data
        allSiswa = [];
        allGuru = [];
        allAbsensi = [];
        allJadwal = [];
        allLibur = [];
        scanLogData = [];

        // Sembunyikan app, tampilkan login
        document.getElementById('mainApp').classList.remove('active');
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('loginForm').reset();

        showToast('Anda telah keluar', 'info');
    }
}

// ============================================================
// MENU ADJUST BY ROLE
// ============================================================
function adjustMenuByRole(role) {
    const items = document.querySelectorAll('.nav-item');
    items.forEach(item => {
        const page = item.dataset.page;
        if (role === 'siswa') {
            const allowed = ['dashboard', 'data-siswa'];
            item.style.display = allowed.includes(page) ? 'flex' : 'none';
        } else {
            item.style.display = 'flex';
        }
    });
}
