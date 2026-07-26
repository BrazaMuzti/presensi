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
// UPDATE SISWA TABLE
// ============================================================
function updateSiswaTable() {
    const search = document.getElementById('searchSiswa').value.toLowerCase();
    const kelasFilter = document.getElementById('filterSiswaKelas').value;
    siswaPerPage = parseInt(document.getElementById('showEntries').value);

    let filtered = siswaData.filter(s => {
        const matchSearch = s.nama.toLowerCase().includes(search) || s.nis.includes(search);
        const matchKelas = kelasFilter === 'all' || s.kelas === kelasFilter;
        return matchSearch && matchKelas;
    });

    const start = (siswaCurrentPage - 1) * siswaPerPage;
    const end = start + siswaPerPage;
    const pageData = filtered.slice(start, end);

    const tbody = document.getElementById('siswaTableBody');
    tbody.innerHTML = '';

    if (pageData.length === 0) {
        tbody.innerHTML =
        '<tr><td colspan="12" style="text-align:center;padding:30px;color:var(--gray-400);font-size:13px;"><i class="fas fa-inbox" style="font-size:28px;display:block;margin-bottom:6px;"></i>Tidak ada data siswa</td></tr>';
    return;
    }

    pageData.forEach((s, i) => {
        const tr = document.createElement('tr');
        const isOwnData = currentRole === 'siswa' && (s.nis === currentUsername || s.nama === currentUser?.nama);
        tr.innerHTML = `
        <td>${start + i + 1}</td>
        <td><strong>${s.nis}</strong></td>
        <td>${s.nama}${isOwnData ? ' 👤' : ''}</td>
        <td><span style="background:var(--gray-100);padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;">${s.kelas}</span></td>
        <td>${s.jk}</td>
        <td>${s.tglLahir}</td>
        <td>${s.agama}</td>
        <td>${s.ayah}<br><small>${s.ibu}</small></td>
        <td>${s.hp}</td>
        <td style="max-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.alamat}</td>
        <td><span class="status-badge hadir">${s.keterangan}</span><br><small>${s.ekstra || ''}</small></td>
        <td>
        <button onclick="editSiswa('${s.nis}')" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
        ${currentRole !== 'siswa' ? `<button onclick="hapusSiswa('${s.nis}')" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>` : ''}
        </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('siswaInfo').textContent =
    `Menampilkan ${start + 1} - ${Math.min(end, filtered.length)} dari ${filtered.length} data`;
    document.getElementById('siswaPageInfo').textContent =
    `${siswaCurrentPage} dari ${Math.ceil(filtered.length / siswaPerPage) || 1}`;
}

// ============================================================
// SISWA CRUD OPERATIONS
// ============================================================
function filterSiswa() {
    siswaCurrentPage = 1;
    updateSiswaTable();
}

function refreshDataSiswa() {
    loadSiswaData();
    showToast('Data siswa berhasil diperbarui', 'success');
}

function tambahSiswa() {
    if (currentRole === 'siswa') {
        showToast('Anda tidak memiliki akses untuk menambah siswa!', 'error');
        return;
    }

    const kelasOptions = [...new Set(allSiswa.map(s => s.kelas))].map(k =>
    `<option value="${k}">${k}</option>`).join('');
    const ekstraOptions = ['Pramuka', 'Paskibra', 'PMR', 'Futsal', 'Basket', 'Voli', 'Musik', 'Dance'].map(e =>
    `<option value="${e}">${e}</option>`).join('');

    showModal('Tambah Siswa', `
    <form id="formTambahSiswa">
    <div class="form-row">
    <div class="form-group">
    <label>NIS/NISN</label>
    <input type="text" id="tNis" required>
    </div>
    <div class="form-group">
    <label>Nama Lengkap</label>
    <input type="text" id="tNama" required>
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label>Kelas</label>
    <select id="tKelas" required>
    <option value="">Pilih Kelas</option>
    ${kelasOptions}
    <option value="Lainnya">Lainnya</option>
    </select>
    </div>
    <div class="form-group">
    <label>Ekstrakurikuler</label>
    <select id="tEkstra">
    <option value="">Pilih Ekstra</option>
    ${ekstraOptions}
    <option value="Lainnya">Lainnya</option>
    </select>
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label>Jenis Kelamin</label>
    <select id="tJk">
    <option value="L">Laki-laki</option>
    <option value="P">Perempuan</option>
    </select>
    </div>
    <div class="form-group">
    <label>Tanggal Lahir</label>
    <input type="date" id="tTglLahir">
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label>Agama</label>
    <input type="text" id="tAgama">
    </div>
    <div class="form-group">
    <label>Password</label>
    <input type="password" id="tPassword" required>
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label>Nama Ayah</label>
    <input type="text" id="tAyah">
    </div>
    <div class="form-group">
    <label>Nama Ibu</label>
    <input type="text" id="tIbu">
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label>No.HP</label>
    <input type="text" id="tHp">
    </div>
    <div class="form-group">
    <label>Status</label>
    <select id="tKeterangan">
    <option value="Aktif">Aktif</option>
    <option value="Pindah">Pindah</option>
    <option value="Lulus">Lulus</option>
    <option value="Keluar">Keluar</option>
    </select>
    </div>
    </div>
    <div class="form-group">
    <label>Alamat</label>
    <textarea id="tAlamat"></textarea>
    </div>
    <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">Simpan Siswa</button>
    </form>
    `);

    document.getElementById('formTambahSiswa').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            nis: document.getElementById('tNis').value,
                                                                nama: document.getElementById('tNama').value,
                                                                kelas: document.getElementById('tKelas').value,
                                                                ekstra: document.getElementById('tEkstra').value,
                                                                jk: document.getElementById('tJk').value,
                                                                tglLahir: document.getElementById('tTglLahir').value,
                                                                agama: document.getElementById('tAgama').value,
                                                                ayah: document.getElementById('tAyah').value,
                                                                ibu: document.getElementById('tIbu').value,
                                                                hp: document.getElementById('tHp').value,
                                                                alamat: document.getElementById('tAlamat').value,
                                                                keterangan: document.getElementById('tKeterangan').value,
                                                                password: document.getElementById('tPassword').value
        };

        siswaData.push(data);
        allSiswa = siswaData;
        updateSiswaTable();
        updateFilters();
        closeModal();
        showToast('Siswa berhasil ditambahkan', 'success');
    });
}

function editSiswa(nis) {
    const siswa = siswaData.find(s => s.nis === nis);
    if (!siswa) {
        showToast('Siswa tidak ditemukan', 'error');
        return;
    }

    // Jika role siswa, hanya bisa edit dirinya sendiri
    if (currentRole === 'siswa') {
        if (siswa.nis !== currentUsername && siswa.nama !== currentUser?.nama) {
            showToast('Anda hanya bisa mengedit data sendiri!', 'error');
            return;
        }
    }

    const kelasOptions = [...new Set(allSiswa.map(s => s.kelas))].map(k =>
    `<option value="${k}" ${k === siswa.kelas ? 'selected' : ''}>${k}</option>`).join('');
    const ekstraOptions = ['Pramuka', 'Paskibra', 'PMR', 'Futsal', 'Basket', 'Voli', 'Musik', 'Dance'].map(e =>
    `<option value="${e}" ${e === siswa.ekstra ? 'selected' : ''}>${e}</option>`).join('');

    const isSiswa = currentRole === 'siswa';
    const disabledAttr = isSiswa ? 'disabled' : '';

    showModal(isSiswa ? 'Edit Data Diri' : 'Edit Siswa', `
    <form id="formEditSiswa">
    <div class="form-row">
    <div class="form-group">
    <label>NIS/NISN</label>
    <input type="text" id="eNis" value="${siswa.nis}" ${disabledAttr}>
    </div>
    <div class="form-group">
    <label>Nama Lengkap</label>
    <input type="text" id="eNama" value="${siswa.nama}" ${isSiswa ? 'disabled' : 'required'}>
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label>Kelas</label>
    <select id="eKelas" ${isSiswa ? 'disabled' : ''}>
    <option value="">Pilih Kelas</option>
    ${kelasOptions}
    <option value="Lainnya">Lainnya</option>
    </select>
    </div>
    <div class="form-group">
    <label>Ekstrakurikuler</label>
    <select id="eEkstra" ${isSiswa ? 'disabled' : ''}>
    <option value="">Pilih Ekstra</option>
    ${ekstraOptions}
    <option value="Lainnya">Lainnya</option>
    </select>
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label>Jenis Kelamin</label>
    <select id="eJk" ${isSiswa ? 'disabled' : ''}>
    <option value="L" ${siswa.jk === 'L' ? 'selected' : ''}>Laki-laki</option>
    <option value="P" ${siswa.jk === 'P' ? 'selected' : ''}>Perempuan</option>
    </select>
    </div>
    <div class="form-group">
    <label>Tanggal Lahir</label>
    <input type="date" id="eTglLahir" value="${siswa.tglLahir}" ${isSiswa ? 'disabled' : ''}>
    </div>
    </div>
    <div class="form-row">
    <div class="form-group">
    <label>Agama</label>
    <input type="text" id="eAgama" value="${siswa.agama}" ${isSiswa ? 'disabled' : ''}>
    </div>
    <div class="form-group">
    <label>Password</label>
    <input type="password" id="ePassword" value="${siswa.password}" required>
    </div>
    </div>
    ${!isSiswa ? `
        <div class="form-row">
        <div class="form-group">
        <label>Nama Ayah</label>
        <input type="text" id="eAyah" value="${siswa.ayah}">
        </div>
        <div class="form-group">
        <label>Nama Ibu</label>
        <input type="text" id="eIbu" value="${siswa.ibu}">
        </div>
        </div>
        <div class="form-row">
        <div class="form-group">
        <label>No.HP</label>
        <input type="text" id="eHp" value="${siswa.hp}">
        </div>
        <div class="form-group">
        <label>Status</label>
        <select id="eKeterangan">
        <option value="Aktif" ${siswa.keterangan === 'Aktif' ? 'selected' : ''}>Aktif</option>
        <option value="Pindah" ${siswa.keterangan === 'Pindah' ? 'selected' : ''}>Pindah</option>
        <option value="Lulus" ${siswa.keterangan === 'Lulus' ? 'selected' : ''}>Lulus</option>
        <option value="Keluar" ${siswa.keterangan === 'Keluar' ? 'selected' : ''}>Keluar</option>
        </select>
        </div>
        </div>
        <div class="form-group">
        <label>Alamat</label>
        <textarea id="eAlamat">${siswa.alamat}</textarea>
        </div>
        ` : ''}
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">${isSiswa ? 'Update Data Diri' : 'Update Siswa'}</button>
        </form>
        `);

    document.getElementById('formEditSiswa').addEventListener('submit', function(e) {
        e.preventDefault();
        const index = siswaData.findIndex(s => s.nis === nis);
        if (index !== -1) {
            const updatedData = {
                nis: document.getElementById('eNis').value,
                                                              nama: isSiswa ? siswa.nama : document.getElementById('eNama').value,
                                                              kelas: isSiswa ? siswa.kelas : document.getElementById('eKelas').value,
                                                              ekstra: isSiswa ? siswa.ekstra : document.getElementById('eEkstra').value,
                                                              jk: isSiswa ? siswa.jk : document.getElementById('eJk').value,
                                                              tglLahir: isSiswa ? siswa.tglLahir : document.getElementById('eTglLahir').value,
                                                              agama: isSiswa ? siswa.agama : document.getElementById('eAgama').value,
                                                              ayah: isSiswa ? siswa.ayah : document.getElementById('eAyah').value,
                                                              ibu: isSiswa ? siswa.ibu : document.getElementById('eIbu').value,
                                                              hp: isSiswa ? siswa.hp : document.getElementById('eHp').value,
                                                              alamat: isSiswa ? siswa.alamat : document.getElementById('eAlamat').value,
                                                              keterangan: isSiswa ? siswa.keterangan : document.getElementById('eKeterangan').value,
                                                              password: document.getElementById('ePassword').value
            };
            siswaData[index] = updatedData;
            allSiswa = siswaData;
            updateSiswaTable();
            updateFilters();
            closeModal();
            showToast('Data berhasil diupdate!', 'success');
        }
    });
}

function hapusSiswa(nis) {
    if (currentRole === 'siswa') {
        showToast('Anda tidak memiliki akses untuk menghapus!', 'error');
        return;
    }
    if (confirm(`Yakin hapus siswa dengan NIS ${nis}?`)) {
        siswaData = siswaData.filter(s => s.nis !== nis);
        allSiswa = siswaData;
        updateSiswaTable();
        updateFilters();
        showToast('Siswa berhasil dihapus', 'success');
    }
}

function prevSiswaPage() {
    if (siswaCurrentPage > 1) {
        siswaCurrentPage--;
        updateSiswaTable();
    }
}

function nextSiswaPage() {
    const totalPages = Math.ceil(siswaData.length / siswaPerPage);
    if (siswaCurrentPage < totalPages) {
        siswaCurrentPage++;
        updateSiswaTable();
    }
}
