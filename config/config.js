// ============================================================
// KONFIGURASI APLIKASI
// ============================================================
const APP_CONFIG = {
    // Ganti dengan ID Spreadsheet Anda
    SPREADSHEET_ID: '1JqCQR3r1ctBm0O2pT_jnAkqRHp1N9KH0E2lQ2H9RTP0',

    // URL Web App (setelah deploy)
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbyDgnGYsszXZl5mjgttyNvAsjvndknfqh3JvRoZ_f8_ZEo3_SbeKa0KCVS3BcuvWyj4/exec',

        // Nama Sheet
        SHEETS: {
            SISWA: 'Siswa',
            GURU: 'Guru',
            ABSENSI: 'Absensi',
            JADWAL: 'Jadwal',
            LIBUR: 'Libur'
        },

        // Endpoints API
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
            UPDATE_ABSENSI: '/updateAbsensi',
            GET_JADWAL: '/getJadwal',
            ADD_JADWAL: '/addJadwal',
            DELETE_JADWAL: '/deleteJadwal',
            GET_LIBUR: '/getLibur',
            ADD_LIBUR: '/addLibur',
            DELETE_LIBUR: '/deleteLibur',
            LOGIN: '/validateLogin'
        }
    };

    // ============================================================
    // API CALL FUNCTION
    // ============================================================
    async function callAPI(endpoint, data = {}) {
        try {
            const url = `${APP_CONFIG.WEB_APP_URL}${endpoint}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    spreadsheetId: APP_CONFIG.SPREADSHEET_ID
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
