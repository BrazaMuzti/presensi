// ============================================================
// KONFIGURASI APLIKASI
// ============================================================
const APP_CONFIG = {
    // Ganti dengan ID Spreadsheet Anda
    SPREADSHEET_ID: '1JqCQR3r1ctBm0O2pT_jnAkqRHp1N9KH0E2lQ2H9RTP0',
    
    // Ganti dengan URL Web App setelah deploy
    // URL format: https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzwckbYo-K31FqzwbAl9fCXZCEKyqKfdwKLi0Vd553lmE_y-BdxdFSBXlMBfLT8-xHn/exec',
    
    // Nama Sheet
    SHEETS: {
        SISWA: 'Siswa',
        GURU: 'Guru',
        ABSENSI: 'Absensi',
        JADWAL: 'Jadwal',
        LIBUR: 'Libur'
    }
};

// ============================================================
// API CALL FUNCTION - DENGAN ERROR HANDLING LENGKAP
// ============================================================
async function callAPI(action, data = {}) {
    try {
        const url = APP_CONFIG.WEB_APP_URL;
        console.log(`[API] Calling: ${action}`, data);
        
        // Cek koneksi internet
        if (!navigator.onLine) {
            throw new Error('Tidak ada koneksi internet!');
        }
        
        // Cek URL
        if (!url || url === 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec') {
            console.warn('[API] URL belum diisi, menggunakan mode demo');
            return simulateAPICall(action, data);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 detik timeout
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    action: action,
                    ...data,
                    spreadsheetId: APP_CONFIG.SPREADSHEET_ID
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log(`[API] Response ${action}:`, result);
            return result;
            
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                throw new Error('Request timeout - Server tidak merespons');
            }
            throw fetchError;
        }
        
    } catch (error) {
        console.error(`[API] Error ${action}:`, error);
        
        // Jika error network, gunakan mode offline/demo
        if (error.message.includes('NetworkError') || 
            error.message.includes('Failed to fetch') ||
            error.message.includes('timeout')) {
            console.warn('[API] Switching to demo mode');
            return simulateAPICall(action, data);
        }
        
        throw error;
    }
}

// ============================================================
// SIMULASI API CALL (OFFLINE MODE)
// ============================================================
function simulateAPICall(action, data) {
    console.log(`[DEMO] Simulating ${action}`);
    
    // Data demo
    const demoSiswa = [
        { nis: '001', nama: 'Ahmad Fauzi', kelas: 'XII RPL 1', jk: 'L', tgl_lahir: '2005-01-15', agama: 'Islam',
            ayah: 'Budi', ibu: 'Siti', hp: '081234567890', alamat: 'Jl. Merdeka No.1', keterangan: 'Aktif',
            password: 'siswa123', ekstra: 'Pramuka' },
        { nis: '002', nama: 'Siti Aminah', kelas: 'XII RPL 1', jk: 'P', tgl_lahir: '2005-03-20', agama: 'Islam',
            ayah: 'Ahmad', ibu: 'Fatimah', hp: '081234567891', alamat: 'Jl. Sudirman No.2', keterangan: 'Aktif',
            password: 'siswa123', ekstra: 'Paskibra' }
    ];
    
    const demoGuru = [
        { id: 'G001', username: 'guru01', kelas: 'XII RPL 1', jabatan: 'Guru', password: 'guru123' },
        { id: 'G002', username: 'guru02', kelas: 'XII RPL 2', jabatan: 'Guru', password: 'guru123' },
        { id: 'G003', username: 'kepsek', kelas: '-', jabatan: 'Kepala Sekolah', password: 'kepsek123' }
    ];
    
    const demoJadwal = [
        { id: 1, mapel: 'Matematika', jam_datang: '07:00', jam_selesai: '08:30', kelas: 'XII RPL 1' },
        { id: 2, mapel: 'Bahasa Indonesia', jam_datang: '08:45', jam_selesai: '10:15', kelas: 'XII RPL 1' }
    ];
    
    const demoLibur = [
        { tanggal: '2024-12-25', keterangan: 'Hari Natal' },
        { tanggal: '2024-12-31', keterangan: 'Tahun Baru' }
    ];
    
    switch(action) {
        case 'getSiswa':
            return { success: true, data: demoSiswa, demo: true };
        case 'addSiswa':
            return { success: true, message: 'Siswa berhasil ditambahkan (demo mode)', demo: true };
        case 'updateSiswa':
            return { success: true, message: 'Siswa berhasil diupdate (demo mode)', demo: true };
        case 'deleteSiswa':
            return { success: true, message: 'Siswa berhasil dihapus (demo mode)', demo: true };
        case 'getGuru':
            return { success: true, data: demoGuru, demo: true };
        case 'addGuru':
            return { success: true, message: 'Guru berhasil ditambahkan (demo mode)', demo: true };
        case 'updateGuru':
            return { success: true, message: 'Guru berhasil diupdate (demo mode)', demo: true };
        case 'deleteGuru':
            return { success: true, message: 'Guru berhasil dihapus (demo mode)', demo: true };
        case 'getJadwal':
            return { success: true, data: demoJadwal, demo: true };
        case 'addJadwal':
            return { success: true, message: 'Jadwal berhasil ditambahkan (demo mode)', demo: true };
        case 'deleteJadwal':
            return { success: true, message: 'Jadwal berhasil dihapus (demo mode)', demo: true };
        case 'getLibur':
            return { success: true, data: demoLibur, demo: true };
        case 'addLibur':
            return { success: true, message: 'Hari libur berhasil ditambahkan (demo mode)', demo: true };
        case 'deleteLibur':
            return { success: true, message: 'Hari libur berhasil dihapus (demo mode)', demo: true };
        case 'getAbsensi':
            return { success: true, data: [], demo: true };
        case 'addAbsensi':
            return { success: true, message: 'Absensi berhasil disimpan (demo mode)', demo: true };
        case 'updateAbsensi':
            return { success: true, message: 'Status absensi berhasil diupdate (demo mode)', demo: true };
        case 'validateLogin':
            const { username, password, role } = data;
            if ((username === 'admin' && password === 'admin123') ||
                (username === 'guru' && password === 'guru123') ||
                (username === 'siswa' && password === 'siswa123') ||
                (username === '001' && password === 'siswa123')) {
                return {
                    success: true,
                    user: {
                        username: username,
                        nama: username === 'admin' ? 'Admin Sekolah' : 
                              username === 'guru' ? 'Guru Matematika' : 'Ahmad Fauzi',
                        kelas: username === 'siswa' || username === '001' ? 'XII RPL 1' : '',
                        role: role
                    },
                    demo: true
                };
            }
            return { success: false, message: 'Username atau password salah!', demo: true };
        default:
            return { success: false, message: 'Unknown action: ' + action, demo: true };
    }
}
