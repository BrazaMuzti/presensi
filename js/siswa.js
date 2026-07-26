// ============================================================
// SISWA MODULE - DENGAN KONEKSI SPREADSHEET
// ============================================================

let siswaData = [];
let siswaCurrentPage = 1;
let siswaPerPage = 10;
let isSiswaLoading = false;

// ============================================================
// LOAD SISWA DATA
// ============================================================
async function loadSiswaData() {
    if (isSiswaLoading) return;
    isSiswaLoading = true;
    
    try {
        console.log('Loading siswa data from spreadsheet...');
        showToast('Memuat data siswa...', 'info');
        
        const result = await callAPI('getSiswa');
        
        if (result && result.success) {
            siswaData = result.data || [];
            allSiswa = siswaData;
            console.log('Siswa data loaded:', siswaData.length, 'records');
            
            updateSiswaTable();
            updateFilters();
            updateStats();
            
            showToast('Data siswa berhasil dimuat', 'success');
        } else {
            // Jika gagal, gunakan data demo
            console.log('Using demo data...');
            useDemoSiswaData();
            showToast('Menggunakan data demo', 'warning');
        }
    } catch (error) {
        console.error('Error loading siswa:', error);
        useDemoSiswaData();
        showToast('Error: ' + error.message, 'error');
    } finally {
        isSiswaLoading = false;
    }
}

// ============================================================
// DEMO DATA (Fallback)
// ============================================================
function useDemoSiswaData() {
    siswaData = [
        { nis: '001', nama: 'Ahmad Fauzi', kelas: 'XII RPL 1', jk: 'L', tgl_lahir: '2005-01-15', agama: 'Islam',
            ayah: 'Budi', ibu: 'Siti', hp: '081234567890', alamat: 'Jl. Merdeka No.1', keterangan: 'Aktif',
            password: 'siswa123', ekstra: 'Pramuka' },
        { nis: '002', nama: 'Siti Aminah', kelas: 'XII RPL 1', jk: 'P', tgl_lahir: '2005-03-20', agama: 'Islam',
            ayah: 'Ahmad', ibu: 'Fatimah', hp: '081234567891', alamat: 'Jl. Sudirman No.2', keterangan: 'Aktif',
            password: 'siswa123', ekstra: 'Paskibra' },
    ];
    allSiswa = siswaData;
    updateSiswaTable();
    updateFilters();
    updateStats();
}

// ============================================================
// UPDATE SISWA TABLE
// ============================================================
function updateSiswaTable() {
    const search = document.getElementById('searchSiswa')?.value?.toLowerCase() || '';
    const kelasFilter = document.getElementById('filterSiswaKelas')?.value || 'all';
    siswaPerPage = parseInt(document.getElementById('showEntries')?.value || 10);

    let filtered = siswaData.filter(s => {
        const matchSearch = s.nama?.toLowerCase().includes(search) || s.nis?.includes(search);
        const matchKelas = kelasFilter === 'all' || s.kelas === kelasFilter;
        return matchSearch && matchKelas;
    });

    const start = (siswaCurrentPage - 1) * siswaPerPage;
    const end = start + siswaPerPage;
    const pageData = filtered.slice(start, end);

    const tbody = document.getElementById('siswaTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align:center;padding:30px;color:var(--gray-400);font-size:13px;">
                    <i class="fas fa-inbox" style="font-size:28px;display:block;margin-bottom:6px;"></i>
                    Tidak ada data siswa
                </td>
            </tr>
        `;
        return;
    }

    pageData.forEach((s, i) => {
        const tr = document.createElement('tr');
        const isOwnData = currentRole === 'siswa' && (s.nis === currentUsername || s.nama === currentUser?.nama);
        tr.innerHTML = `
            <td>${start + i + 1}</td>
            <td><strong>${s.nis || ''}</strong></td>
            <td>${s.nama || ''}${isOwnData ? ' 👤' : ''}</td>
            <td><span style="background:var(--gray-100);padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;">${s.kelas || ''}</span></td>
            <td>${s.jk || ''}</td>
            <td>${s.tgl_lahir || ''}</td>
            <td>${s.agama || ''}</td>
            <td>${s.ayah || ''}<br><small>${s.ibu || ''}</small></td>
            <td>${s.hp || ''}</td>
            <td style="max-width:100px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${s.alamat || ''}</td>
            <td>
                <span class="status-badge hadir">${s.keterangan || 'Aktif'}</span>
                <br><small>${s.ekstra || ''}</small>
            </td>
            <td>
                <button onclick="editSiswa('${s.nis}')" class="btn btn-warning btn-sm">
                    <i class="fas fa-edit"></i>
                </button>
                ${currentRole !== 'siswa' ? `
                    <button onclick="hapusSiswa('${s.nis}')" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });

    const info = document.getElementById('siswaInfo');
    if (info) {
        info.textContent = `Menampilkan ${start + 1} - ${Math.min(end, filtered.length)} dari ${filtered.length} data`;
    }
    const pageInfo = document.getElementById('siswaPageInfo');
    if (pageInfo) {
        pageInfo.textContent = `${siswaCurrentPage} dari ${Math.ceil(filtered.length / siswaPerPage) || 1}`;
    }
}

// ============================================================
// TAMBAH SISWA
// ============================================================
async function tambahSiswa() {
    if (currentRole === 'siswa') {
        showToast('Anda tidak memiliki akses untuk menambah siswa!', 'error');
        return;
    }

    const kelasOptions = [...new Set(allSiswa.map(s => s.kelas).filter(k => k))].map(k =>
        `<option value="${k}">${k}</option>`).join('');
    const ekstraOptions = ['Pramuka', 'Paskibra', 'PMR', 'Futsal', 'Basket', 'Voli', 'Musik', 'Dance'].map(e =>
        `<option value="${e}">${e}</option>`).join('');

    showModal('Tambah Siswa', `
        <form id="formTambahSiswa">
            <div class="form-row">
                <div class="form-group">
                    <label>NIS/NISN *</label>
                    <input type="text" id="tNis" required placeholder="Contoh: 001">
                </div>
                <div class="form-group">
                    <label>Nama Lengkap *</label>
                    <input type="text" id="tNama" required placeholder="Nama lengkap">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Kelas *</label>
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
                    <input type="text" id="tAgama" placeholder="Islam, Kristen, dll">
                </div>
                <div class="form-group">
                    <label>Password *</label>
                    <input type="password" id="tPassword" required placeholder="Minimal 6 karakter">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Nama Ayah</label>
                    <input type="text" id="tAyah" placeholder="Nama ayah">
                </div>
                <div class="form-group">
                    <label>Nama Ibu</label>
                    <input type="text" id="tIbu" placeholder="Nama ibu">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>No.HP</label>
                    <input type="text" id="tHp" placeholder="081234567890">
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
                <textarea id="tAlamat" placeholder="Alamat lengkap"></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
                <i class="fas fa-save"></i> Simpan Siswa
            </button>
        </form>
    `);

    document.getElementById('formTambahSiswa').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const data = {
            nis: document.getElementById('tNis').value.trim(),
            nama: document.getElementById('tNama').value.trim(),
            kelas: document.getElementById('tKelas').value,
            ekstra: document.getElementById('tEkstra').value,
            jk: document.getElementById('tJk').value,
            tgl_lahir: document.getElementById('tTglLahir').value,
            agama: document.getElementById('tAgama').value.trim(),
            ayah: document.getElementById('tAyah').value.trim(),
            ibu: document.getElementById('tIbu').value.trim(),
            hp: document.getElementById('tHp').value.trim(),
            alamat: document.getElementById('tAlamat').value.trim(),
            keterangan: document.getElementById('tKeterangan').value,
            password: document.getElementById('tPassword').value
        };

        // Validasi
        if (!data.nis || !data.nama || !data.kelas || !data.password) {
            showToast('Field yang bertanda * harus diisi!', 'error');
            return;
        }

        if (data.password.length < 6) {
            showToast('Password minimal 6 karakter!', 'error');
            return;
        }

        try {
            showToast('Menyimpan data...', 'info');
            const result = await callAPI('addSiswa', data);
            
            if (result && result.success) {
                await loadSiswaData(); // Refresh data
                closeModal();
                showToast(result.message || 'Siswa berhasil ditambahkan!', 'success');
            } else {
                showToast(result?.message || 'Gagal menambahkan siswa!', 'error');
            }
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    });
}

// ============================================================
// EDIT SISWA
// ============================================================
async function editSiswa(nis) {
    const siswa = siswaData.find(s => s.nis === nis);
    if (!siswa) {
