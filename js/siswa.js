// ============================================================
// SISWA MODULE
// ============================================================

let siswaData = [];
let siswaCurrentPage = 1;
let siswaPerPage = 10;

// ============================================================
// LOAD SISWA DATA - DENGAN DATA DEMO
// ============================================================
function loadSiswaData() {
    console.log('Loading siswa data...');
    
    // Data demo untuk testing
    siswaData = [
        { 
            nis: '001', 
            nama: 'Ahmad Fauzi', 
            kelas: 'XII RPL 1', 
            jk: 'L', 
            tglLahir: '2005-01-15', 
            agama: 'Islam',
            ayah: 'Budi', 
            ibu: 'Siti', 
            hp: '081234567890', 
            alamat: 'Jl. Merdeka No.1', 
            keterangan: 'Aktif',
            password: 'siswa123', 
            ekstra: 'Pramuka' 
        },
        { 
            nis: '002', 
            nama: 'Siti Aminah', 
            kelas: 'XII RPL 1', 
            jk: 'P', 
            tglLahir: '2005-03-20', 
            agama: 'Islam',
            ayah: 'Ahmad', 
            ibu: 'Fatimah', 
            hp: '081234567891', 
            alamat: 'Jl. Sudirman No.2', 
            keterangan: 'Aktif',
            password: 'siswa123', 
            ekstra: 'Paskibra' 
        },
        { 
            nis: '003', 
            nama: 'Budi Santoso', 
            kelas: 'XII RPL 2', 
            jk: 'L', 
            tglLahir: '2004-12-10', 
            agama: 'Kristen',
            ayah: 'Johanes', 
            ibu: 'Maria', 
            hp: '081234567892', 
            alamat: 'Jl. Diponegoro No.3', 
            keterangan: 'Aktif',
            password: 'siswa123', 
            ekstra: 'PMR' 
        },
        { 
            nis: '004', 
            nama: 'Dewi Lestari', 
            kelas: 'XII RPL 2', 
            jk: 'P', 
            tglLahir: '2005-07-08', 
            agama: 'Islam',
            ayah: 'Slamet', 
            ibu: 'Rina', 
            hp: '081234567893', 
            alamat: 'Jl. Pahlawan No.4', 
            keterangan: 'Aktif',
            password: 'siswa123', 
            ekstra: 'Pramuka' 
        },
        { 
            nis: '005', 
            nama: 'Eko Prasetyo', 
            kelas: 'XII MM 1', 
            jk: 'L', 
            tglLahir: '2005-09-12', 
            agama: 'Islam',
            ayah: 'Heru', 
            ibu: 'Ani', 
            hp: '081234567894', 
            alamat: 'Jl. Pendidikan No.5', 
            keterangan: 'Aktif',
            password: 'siswa123', 
            ekstra: 'Paskibra' 
        },
    ];
    
    allSiswa = siswaData;
    console.log('Siswa data loaded:', siswaData.length, 'records');
    
    updateSiswaTable();
    updateFilters();
}

// ============================================================
// REST OF SISWA MODULE (sama seperti sebelumnya)
// ============================================================
// ... (fungsi updateSiswaTable, filterSiswa, refreshDataSiswa, 
//      tambahSiswa, editSiswa, hapusSiswa, prevSiswaPage, nextSiswaPage)
