// ============================================================
// KONFIGURASI APLIKASI
// ============================================================
const APP_CONFIG = {
    // Ganti dengan ID Spreadsheet Anda
    SPREADSHEET_ID: '1JqCQR3r1ctBm0O2pT_jnAkqRHp1N9KH0E2lQ2H9RTP0',

    // URL Web App (setelah deploy)
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzwom_Z9ksLPNdJsPCY7Cm6NUnw93auMUmXIV2PU8hcno0BgeQ2w4CiFgm4L0FsQvMz/exec',

    // Nama Sheet
    SHEETS: {
        SISWA: 'Siswa',
        GURU: 'Guru',
        ABSENSI: 'Absensi',
        JADWAL: 'Jadwal',
        LIBUR: 'Libur'
    },

    // API Endpoints
    API: {
        GET_SISWA: '/getSiswa',
        ADD_SISWA: '/addSiswa',
        UPDATE_SISWA: '/updateSiswa',
        DELETE_SISWA: '/deleteSiswa',
        GET_GURU: '/getGuru',
        ADD_GURU: '/addGuru',
        UPDATE_GURU: '/updateGuru',
        DELETE_GURU: '/deleteGuru',
        GET_ABSENSI: '/getAbsensi',
        ADD_ABSENSI: '/addAbsensi',
        GET_JADWAL: '/getJadwal',
        ADD_JADWAL: '/addJadwal',
        DELETE_JADWAL: '/deleteJadwal',
        GET_LIBUR: '/getLibur',
        ADD_LIBUR: '/addLibur',
        DELETE_LIBUR: '/deleteLibur',
        LOGIN: '/validateLogin'
    }
};

// Fungsi untuk memanggil API
async function callAPI(endpoint, data = {}) {
    try {
        const response = await fetch(`${APP_CONFIG.WEB_APP_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                spreadsheetId: APP_CONFIG.SPREADSHEET_ID
            })
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
