// ============================================================
// GOOGLE APPS SCRIPT - BACKEND LENGKAP DENGAN CORS
// ============================================================

// Ganti dengan ID Spreadsheet Anda
const CONFIG = {
    SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE'
};

// ============================================================
// DO POST - Handler utama
// ============================================================
function doPost(e) {
    try {
        const data = JSON.parse(e.postData.contents);
        const action = data.action;
        const spreadsheetId = data.spreadsheetId || CONFIG.SPREADSHEET_ID;
        
        console.log('Action:', action);
        console.log('Data:', data);
        
        let result;
        switch(action) {
            // SISWA CRUD
            case 'getSiswa':
                result = getSiswa(spreadsheetId);
                break;
            case 'addSiswa':
                result = addSiswa(spreadsheetId, data);
                break;
            case 'updateSiswa':
                result = updateSiswa(spreadsheetId, data);
                break;
            case 'deleteSiswa':
                result = deleteSiswa(spreadsheetId, data.nis);
                break;
                
            // GURU CRUD
            case 'getGuru':
                result = getGuru(spreadsheetId);
                break;
            case 'addGuru':
                result = addGuru(spreadsheetId, data);
                break;
            case 'updateGuru':
                result = updateGuru(spreadsheetId, data);
                break;
            case 'deleteGuru':
                result = deleteGuru(spreadsheetId, data.username);
                break;
                
            // ABSENSI CRUD
            case 'getAbsensi':
                result = getAbsensi(spreadsheetId);
                break;
            case 'addAbsensi':
                result = addAbsensi(spreadsheetId, data);
                break;
            case 'updateAbsensi':
                result = updateAbsensi(spreadsheetId, data);
                break;
                
            // JADWAL CRUD
            case 'getJadwal':
                result = getJadwal(spreadsheetId);
                break;
            case 'addJadwal':
                result = addJadwal(spreadsheetId, data);
                break;
            case 'deleteJadwal':
                result = deleteJadwal(spreadsheetId, data.id);
                break;
                
            // LIBUR CRUD
            case 'getLibur':
                result = getLibur(spreadsheetId);
                break;
            case 'addLibur':
                result = addLibur(spreadsheetId, data);
                break;
            case 'deleteLibur':
                result = deleteLibur(spreadsheetId, data.tanggal);
                break;
                
            // LOGIN
            case 'validateLogin':
                result = validateLogin(spreadsheetId, data);
                break;
                
            default:
                result = { success: false, message: 'Unknown action: ' + action };
        }
        
        return ContentService
            .createTextOutput(JSON.stringify(result))
            .setMimeType(ContentService.MimeType.JSON);
            
    } catch(error) {
        console.error('Error:', error);
        return ContentService
            .createTextOutput(JSON.stringify({ 
                success: false, 
                message: error.message 
            }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// ============================================================
// DO GET - Untuk test
// ============================================================
function doGet() {
    return ContentService
        .createTextOutput(JSON.stringify({
            status: 'success',
            message: '✅ Aplikasi Presensi Sekolah - Backend Active',
            spreadsheetId: CONFIG.SPREADSHEET_ID,
            timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// SISWA CRUD
// ============================================================
function getSiswa(spreadsheetId) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Siswa');
        const data = sheet.getDataRange().getValues();
        
        if (data.length <= 1) {
            return { success: true, data: [] };
        }
        
        const headers = data[0];
        const rows = data.slice(1).filter(row => row[0] && row[0].toString().trim() !== '');
        
        const result = rows.map(row => {
            const obj = {};
            headers.forEach((h, i) => {
                const key = h.toLowerCase().replace(/ /g, '_');
                obj[key] = row[i] || '';
            });
            return obj;
        });
        
        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function addSiswa(spreadsheetId, data) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Siswa');
        
        // Cek duplikat NIS
        const existing = sheet.getDataRange().getValues();
        for (let i = 1; i < existing.length; i++) {
            if (existing[i][0] === data.nis) {
                return { success: false, message: 'NIS sudah terdaftar!' };
            }
        }
        
        sheet.appendRow([
            data.nis || '',
            data.nama || '',
            data.kelas || '',
            data.jk || '',
            data.tgl_lahir || '',
            data.agama || '',
            data.ayah || '',
            data.ibu || '',
            data.hp || '',
            data.alamat || '',
            data.keterangan || 'Aktif',
            data.password || '',
            data.ekstra || ''
        ]);
        
        return { success: true, message: 'Siswa berhasil ditambahkan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function updateSiswa(spreadsheetId, data) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Siswa');
        const values = sheet.getDataRange().getValues();
        
        for (let i = 1; i < values.length; i++) {
            if (values[i][0] === data.nis) {
                sheet.getRange(i + 1, 1, 1, 13).setValues([[
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
                ]]);
                return { success: true, message: 'Siswa berhasil diupdate' };
            }
        }
        return { success: false, message: 'Siswa tidak ditemukan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function deleteSiswa(spreadsheetId, nis) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Siswa');
        const values = sheet.getDataRange().getValues();
        
        for (let i = 1; i < values.length; i++) {
            if (values[i][0] === nis) {
                sheet.deleteRow(i + 1);
                return { success: true, message: 'Siswa berhasil dihapus' };
            }
        }
        return { success: false, message: 'Siswa tidak ditemukan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ============================================================
// GURU CRUD
// ============================================================
function getGuru(spreadsheetId) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Guru');
        const data = sheet.getDataRange().getValues();
        
        if (data.length <= 1) {
            return { success: true, data: [] };
        }
        
        const headers = data[0];
        const rows = data.slice(1).filter(row => row[0] && row[0].toString().trim() !== '');
        
        const result = rows.map(row => {
            const obj = {};
            headers.forEach((h, i) => {
                const key = h.toLowerCase().replace(/ /g, '_');
                obj[key] = row[i] || '';
            });
            return obj;
        });
        
        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function addGuru(spreadsheetId, data) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Guru');
        
        const existing = sheet.getDataRange().getValues();
        for (let i = 1; i < existing.length; i++) {
            if (existing[i][0] === data.username) {
                return { success: false, message: 'Username sudah terdaftar!' };
            }
        }
        
        sheet.appendRow([
            data.username || '',
            data.kelas || '',
            data.password || '',
            data.jabatan || 'Guru'
        ]);
        
        return { success: true, message: 'Guru berhasil ditambahkan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function updateGuru(spreadsheetId, data) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Guru');
        const values = sheet.getDataRange().getValues();
        
        for (let i = 1; i < values.length; i++) {
            if (values[i][0] === data.username) {
                if (values[i][3] === 'Kepala Sekolah' && data.jabatan !== 'Kepala Sekolah') {
                    return { success: false, message: 'Tidak dapat mengubah jabatan Kepala Sekolah!' };
                }
                sheet.getRange(i + 1, 1, 1, 4).setValues([[
                    data.username,
                    data.kelas || values[i][1],
                    data.password || values[i][2],
                    data.jabatan || values[i][3] || 'Guru'
                ]]);
                return { success: true, message: 'Guru berhasil diupdate' };
            }
        }
        return { success: false, message: 'Guru tidak ditemukan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function deleteGuru(spreadsheetId, username) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Guru');
        const values = sheet.getDataRange().getValues();
        
        for (let i = 1; i < values.length; i++) {
            if (values[i][0] === username) {
                if (values[i][3] === 'Kepala Sekolah') {
                    return { success: false, message: 'Tidak dapat menghapus Kepala Sekolah!' };
                }
                sheet.deleteRow(i + 1);
                return { success: true, message: 'Guru berhasil dihapus' };
            }
        }
        return { success: false, message: 'Guru tidak ditemukan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ============================================================
// ABSENSI CRUD
// ============================================================
function getAbsensi(spreadsheetId) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Absensi');
        const data = sheet.getDataRange().getValues();
        
        if (data.length <= 1) {
            return { success: true, data: [] };
        }
        
        const headers = data[0];
        const rows = data.slice(1).filter(row => row[0] && row[0].toString().trim() !== '');
        
        const result = rows.map(row => {
            const obj = {};
            headers.forEach((h, i) => {
                const key = h.toLowerCase().replace(/ /g, '_');
                obj[key] = row[i] || '';
            });
            return obj;
        });
        
        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function addAbsensi(spreadsheetId, data) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Absensi');
        
        sheet.appendRow([
            data.nis || '',
            data.nama || '',
            data.kelas || '',
            data.tanggal || '',
            data.waktu || '',
            data.status || '',
            data.keterangan || '',
            data.lokasi || ''
        ]);
        
        return { success: true, message: 'Absensi berhasil disimpan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function updateAbsensi(spreadsheetId, data) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Absensi');
        const values = sheet.getDataRange().getValues();
        
        for (let i = 1; i < values.length; i++) {
            if (values[i][0] === data.nis && values[i][3] === data.tanggal) {
                sheet.getRange(i + 1, 6, 1, 1).setValue(data.status);
                sheet.getRange(i + 1, 7, 1, 1).setValue(data.keterangan || values[i][6]);
                return { success: true, message: 'Status absensi berhasil diupdate' };
            }
        }
        return { success: false, message: 'Data absensi tidak ditemukan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ============================================================
// JADWAL CRUD
// ============================================================
function getJadwal(spreadsheetId) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Jadwal');
        const data = sheet.getDataRange().getValues();
        
        if (data.length <= 1) {
            return { success: true, data: [] };
        }
        
        const headers = data[0];
        const rows = data.slice(1).filter(row => row[0] && row[0].toString().trim() !== '');
        
        const result = rows.map(row => {
            const obj = {};
            headers.forEach((h, i) => {
                const key = h.toLowerCase().replace(/ /g, '_');
                obj[key] = row[i] || '';
            });
            return obj;
        });
        
        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function addJadwal(spreadsheetId, data) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Jadwal');
        
        const values = sheet.getDataRange().getValues();
        let maxId = 0;
        for (let i = 1; i < values.length; i++) {
            const id = parseInt(values[i][0]) || 0;
            if (id > maxId) maxId = id;
        }
        const newId = maxId + 1;
        
        sheet.appendRow([
            newId,
            data.mapel || '',
            data.jam_datang || '',
            data.jam_selesai || '',
            data.kelas || ''
        ]);
        
        return { success: true, message: 'Jadwal berhasil ditambahkan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function deleteJadwal(spreadsheetId, id) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Jadwal');
        const values = sheet.getDataRange().getValues();
        
        for (let i = 1; i < values.length; i++) {
            if (values[i][0].toString() === id.toString()) {
                sheet.deleteRow(i + 1);
                return { success: true, message: 'Jadwal berhasil dihapus' };
            }
        }
        return { success: false, message: 'Jadwal tidak ditemukan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ============================================================
// LIBUR CRUD
// ============================================================
function getLibur(spreadsheetId) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Libur');
        const data = sheet.getDataRange().getValues();
        
        if (data.length <= 1) {
            return { success: true, data: [] };
        }
        
        const headers = data[0];
        const rows = data.slice(1).filter(row => row[0] && row[0].toString().trim() !== '');
        
        const result = rows.map(row => {
            const obj = {};
            headers.forEach((h, i) => {
                const key = h.toLowerCase().replace(/ /g, '_');
                obj[key] = row[i] || '';
            });
            return obj;
        });
        
        return { success: true, data: result };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function addLibur(spreadsheetId, data) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Libur');
        
        const existing = sheet.getDataRange().getValues();
        for (let i = 1; i < existing.length; i++) {
            if (existing[i][0] === data.tanggal) {
                return { success: false, message: 'Tanggal sudah terdaftar sebagai hari libur!' };
            }
        }
        
        sheet.appendRow([data.tanggal || '', data.keterangan || '']);
        return { success: true, message: 'Hari libur berhasil ditambahkan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

function deleteLibur(spreadsheetId, tanggal) {
    try {
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName('Libur');
        const values = sheet.getDataRange().getValues();
        
        for (let i = 1; i < values.length; i++) {
            if (values[i][0] === tanggal) {
                sheet.deleteRow(i + 1);
                return { success: true, message: 'Hari libur berhasil dihapus' };
            }
        }
        return { success: false, message: 'Hari libur tidak ditemukan' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// ============================================================
// VALIDASI LOGIN
// ============================================================
function validateLogin(spreadsheetId, data) {
    try {
        const { username, password, role } = data;
        const sheetName = role === 'siswa' ? 'Siswa' : 'Guru';
        
        const ss = SpreadsheetApp.openById(spreadsheetId);
        const sheet = ss.getSheetByName(sheetName);
        const values = sheet.getDataRange().getValues();
        
        for (let i = 1; i < values.length; i++) {
            const user = values[i][0];
            const pass = values[i][values[i].length - 1];
            
            if (user === username && pass === password) {
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
    } catch (error) {
        return { success: false, message: error.message };
    }
}