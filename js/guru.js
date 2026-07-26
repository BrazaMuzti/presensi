// ============================================================
// GURU MODULE
// ============================================================

let guruData = [];
let guruCurrentPage = 1;
let guruPerPage = 10;

// ============================================================
// LOAD GURU DATA - DENGAN DATA DEMO
// ============================================================
function loadGuruData() {
    console.log('Loading guru data...');
    
    guruData = [
        { id: 'G001', username: 'guru01', kelas: 'XII RPL 1', jabatan: 'Guru', password: 'guru123' },
        { id: 'G002', username: 'guru02', kelas: 'XII RPL 2', jabatan: 'Guru', password: 'guru123' },
        { id: 'G003', username: 'guru03', kelas: 'XII MM 1', jabatan: 'Guru', password: 'guru123' },
        { id: 'G004', username: 'kepsek', kelas: '-', jabatan: 'Kepala Sekolah', password: 'kepsek123' },
    ];
    
    allGuru = guruData;
    console.log('Guru data loaded:', guruData.length, 'records');
    
    updateGuruTable();
}

// ============================================================
// REST OF GURU MODULE (sama seperti sebelumnya)
// ============================================================
// ... (fungsi updateGuruTable, filterGuru, refreshDataGuru,
//      tambahGuru, editGuru, hapusGuru, prevGuruPage, nextGuruPage,
//      getKepsekNama, getKepsekNip, getGuruNama, getGuruNip)
