// ============================================================
// GOOGLE APPS SCRIPT - BACKEND
// ============================================================
// Ganti dengan ID Spreadsheet Anda
const CONFIG = {
    SPREADSHEET_ID: '1JqCQR3r1ctBm0O2pT_jnAkqRHp1N9KH0E2lQ2H9RTP0'
};

// ============================================================
// DO POST - Handler utama
// ============================================================
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const action = e.parameter.action || data.action;
        
        let result;
        switch(action) {
            case 'getSiswa':
                result = getSiswa();
                break;
            case 'addSiswa':
                result = addSiswa(data);
                break;
            case 'updateSiswa':
                result = updateSiswa(data);
                break;
            case 'deleteSiswa':
                result = deleteSiswa(data.nis);
                break;
            case 'getGuru':
                result = getGuru();
                break;
            case 'addGuru':
                result = addGuru(data);
                break;
            case 'updateGuru':
                result = updateGuru(data);
                break;
            case 'deleteGuru':
                result = deleteGuru(data.username);
                break;
            case 'getAbsensi':
                result = getAbsensi();
                break;
            case 'addAbsensi':
                result = addAbsensi(data);
                break;
            case 'getJadwal':
                result = getJadwal();
                break;
            case 'addJadwal':
                result = addJadwal(data);
                break;
            case 'deleteJadwal':
                result = deleteJadwal(data.id);
                break;
            case 'getLibur':
                result = getLibur();
                break;
            case 'addLibur':
                result = addLibur(data);
                break;
            case 'deleteLibur':
                result = deleteLibur(data.tanggal);
                break;
            case 'validateLogin':
                result = validateLogin(data);
                break;
            default:
                result = { error: 'Unknown action' };
        }
        
        return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch(error) {
        return ContentService
            .createTextOutput(JSON.stringify({ error: error.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// ============================================================
// FUNGSI CRUD SISWA
// ============================================================
function getSiswa() {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Siswa');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.toLowerCase().replace(/ /g, '_')] = row[i];
        });
        return obj;
    });
}

function addSiswa(data) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Siswa');
    sheet.appendRow([
        data.nis,
        data.nama,
        data.kelas,
        data.jk,
        data.tgl_lahir,
        data.agama,
        data.ayah,
        data.ibu,
        data.hp,
        data.alamat,
        data.keterangan,
        data.password,
        data.ekstra || ''
    ]);
    return { success: true, message: 'Siswa added' };
}

function updateSiswa(data) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Siswa');
    const values = sheet.getDataRange().getValues();
    
    for (let i = 1; i < values.length; i++) {
        if (values[i][0] === data.nis) {
            const row = [
                data.nis,
                data.nama || values[i][1],
                data.kelas || values[i][2],
                data.jk || values[i][3],
                data.tgl_lahir || values[i][4],
                data.agama || values[i][5],
                data.ayah || values[i][6],
                data.ibu || values[i][7],
                data.hp || values[i][8],
                data.alamat || values[i][9],
                data.keterangan || values[i][10],
                data.password || values[i][11],
                data.ekstra || values[i][12] || ''
            ];
            sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
            return { success: true, message: 'Siswa updated' };
        }
    }
    return { success: false, message: 'Siswa not found' };
}

function deleteSiswa(nis) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Siswa');
    const values = sheet.getDataRange().getValues();
    
    for (let i = 1; i < values.length; i++) {
        if (values[i][0] === nis) {
            sheet.deleteRow(i + 1);
            return { success: true, message: 'Siswa deleted' };
        }
    }
    return { success: false, message: 'Siswa not found' };
}

// ============================================================
// FUNGSI CRUD GURU
// ============================================================
function getGuru() {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Guru');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.toLowerCase().replace(/ /g, '_')] = row[i];
        });
        return obj;
    });
}

function addGuru(data) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Guru');
    sheet.appendRow([
        data.username,
        data.kelas || '',
        data.password,
        data.jabatan || 'Guru'
    ]);
    return { success: true, message: 'Guru added' };
}

function updateGuru(data) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Guru');
    const values = sheet.getDataRange().getValues();
    
    for (let i = 1; i < values.length; i++) {
        if (values[i][0] === data.username) {
            sheet.getRange(i + 1, 1, 1, 4).setValues([[
                data.username,
                data.kelas || values[i][1],
                data.password || values[i][2],
                data.jabatan || values[i][3] || 'Guru'
            ]]);
            return { success: true, message: 'Guru updated' };
        }
    }
    return { success: false, message: 'Guru not found' };
}

function deleteGuru(username) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Guru');
    const values = sheet.getDataRange().getValues();
    
    for (let i = 1; i < values.length; i++) {
        if (values[i][0] === username) {
            // Cek apakah Kepala Sekolah
            if (values[i][3] === 'Kepala Sekolah') {
                return { success: false, message: 'Cannot delete Kepala Sekolah' };
            }
            sheet.deleteRow(i + 1);
            return { success: true, message: 'Guru deleted' };
        }
    }
    return { success: false, message: 'Guru not found' };
}

// ============================================================
// FUNGSI CRUD ABSENSI
// ============================================================
function getAbsensi() {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Absensi');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.toLowerCase().replace(/ /g, '_')] = row[i];
        });
        return obj;
    });
}

function addAbsensi(data) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Absensi');
    sheet.appendRow([
        data.nis,
        data.nama,
        data.kelas,
        data.tanggal,
        data.waktu,
        data.status,
        data.keterangan || '',
        data.lokasi || ''
    ]);
    return { success: true, message: 'Absensi added' };
}

function updateAbsensi(data) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Absensi');
    const values = sheet.getDataRange().getValues();
    
    for (let i = 1; i < values.length; i++) {
        if (values[i][0] === data.nis && values[i][3] === data.tanggal) {
            sheet.getRange(i + 1, 6, 1, 1).setValue(data.status);
            sheet.getRange(i + 1, 7, 1, 1).setValue(data.keterangan || values[i][6]);
            return { success: true, message: 'Absensi updated' };
        }
    }
    return { success: false, message: 'Absensi not found' };
}

// ============================================================
// FUNGSI CRUD JADWAL
// ============================================================
function getJadwal() {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Jadwal');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.toLowerCase().replace(/ /g, '_')] = row[i];
        });
        return obj;
    });
}

function addJadwal(data) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Jadwal');
    sheet.appendRow([
        data.mapel,
        data.jam_datang,
        data.jam_selesai,
        data.kelas
    ]);
    return { success: true, message: 'Jadwal added' };
}

function deleteJadwal(id) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Jadwal');
    const values = sheet.getDataRange().getValues();
    
    for (let i = 1; i < values.length; i++) {
        if (values[i][0] === id) {
            sheet.deleteRow(i + 1);
            return { success: true, message: 'Jadwal deleted' };
        }
    }
    return { success: false, message: 'Jadwal not found' };
}

// ============================================================
// FUNGSI CRUD LIBUR
// ============================================================
function getLibur() {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Libur');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const rows = data.slice(1);
    
    return rows.map(row => {
        const obj = {};
        headers.forEach((h, i) => {
            obj[h.toLowerCase().replace(/ /g, '_')] = row[i];
        });
        return obj;
    });
}

function addLibur(data) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Libur');
    sheet.appendRow([data.tanggal, data.keterangan]);
    return { success: true, message: 'Libur added' };
}

function deleteLibur(tanggal) {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName('Libur');
    const values = sheet.getDataRange().getValues();
    
    for (let i = 1; i < values.length; i++) {
        if (values[i][0] === tanggal) {
            sheet.deleteRow(i + 1);
            return { success: true, message: 'Libur deleted' };
        }
    }
    return { success: false, message: 'Libur not found' };
}

// ============================================================
// VALIDASI LOGIN
// ============================================================
function validateLogin(data) {
    const { username, password, role } = data;
    const sheetName = role === 'siswa' ? 'Siswa' : 'Guru';
    
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);
    const values = sheet.getDataRange().getValues();
    
    for (let i = 1; i < values.length; i++) {
        if (values[i][0] === username && values[i][values[i].length - 1] === password) {
            return {
                success: true,
                user: {
                    username: values[i][0],
                    nama: values[i][1],
                    kelas: values[i][2] || '',
                    role: role
                }
            };
        }
    }
    return { success: false, message: 'Username atau password salah!' };
}

// ============================================================
// DO GET - Untuk test
// ============================================================
function doGet() {
    return ContentService.createTextOutput('Aplikasi Presensi Sekolah - Backend Active');
}
