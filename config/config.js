    // ============================================================
    // KONFIGURASI APLIKASI
    // ============================================================
    const APP_CONFIG = {
        // Ganti dengan ID Spreadsheet Anda
        SPREADSHEET_ID: '1JqCQR3r1ctBm0O2pT_jnAkqRHp1N9KH0E2lQ2H9RTP0',

        // Ganti dengan URL Web App setelah deploy
        WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbyDgnGYsszXZl5mjgttyNvAsjvndknfqh3JvRoZ_f8_ZEo3_SbeKa0KCVS3BcuvWyj4/exec',

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
    // API CALL FUNCTION
    // ============================================================
    async function callAPI(action, data = {}) {
        try {
            const url = APP_CONFIG.WEB_APP_URL;
            console.log(`Calling API: ${action}`, data);

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
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('API Response:', result);
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
