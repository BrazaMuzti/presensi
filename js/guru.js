// ============================================================
// GURU MODULE - DENGAN KONEKSI SPREADSHEET
// ============================================================

let guruData = [];
let guruCurrentPage = 1;
let guruPerPage = 10;
let isGuruLoading = false;

// ============================================================
// LOAD GURU DATA
// ============================================================
async function loadGuruData() {
    if (isGuruLoading) return;
    isGuruLoading = true;
    
    try {
        console.log('Loading guru data from spreadsheet...');
        const result = await callAPI('getGuru');
        
        if (result && result.success) {
            guruData = result.data || [];
            allGuru = guruData;
            console.log('Guru data loaded:', guruData.length, 'records');
            updateGuruTable();
        } else {
            useDemoGuruData();
        }
    } catch (error) {
        console.error('Error loading guru:', error);
        useDemoGuruData();
    } finally {
        isGuruLoading = false;
    }
}

function useDemoGuruData() {
    guruData = [
        { id: 'G001', username: 'guru01', kelas: 'XII RPL 1', jabatan: 'Guru', password: 'guru123' },
        { id: 'G002', username: 'guru02', kelas: 'XII RPL 2', jabatan: 'Guru', password: 'guru123' },
        { id: 'G003', username: 'guru03', kelas: 'XII MM 1', jabatan: 'Guru', password: 'guru123' },
        { id: 'G004', username: 'kepsek', kelas: '-', jabatan: 'Kepala Sekolah', password: 'kepsek123' },
    ];
    allGuru = guruData;
    updateGuruTable();
}

// ============================================================
// UPDATE GURU TABLE
// ============================================================
function updateGuruTable() {
    const search = document.getElementById('searchGuru')?.value?.toLowerCase() || '';
    const kelasFilter = document.getElementById('filterGuruKelas')?.value || 'all';
    guruPerPage = parseInt(document.getElementById('showGuruEntries')?.value || 10);

    let filtered = guruData.filter(g => {
        const matchSearch = g.username?.toLowerCase().includes(search);
        const matchKelas = kelasFilter === 'all' || g.kelas === kelasFilter;
        return matchSearch && matchKelas;
    });

    const start = (guruCurrentPage - 1) * guruPerPage;
    const end = start + guruPerPage;
    const pageData = filtered.slice(start, end);

    const tbody = document.getElementById('guruTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:30px;color:var(--gray-400);font-size:13px;">
                    <i class="fas fa-inbox" style="font-size:28px;display:block;margin-bottom:6px;"></i>
                    Tidak ada data guru
                </td>
            </tr>
        `;
        return;
    }

    pageData.forEach((g, i) => {
        const tr = document.createElement('tr');
        const isKepsek = g.jabatan === 'Kepala Sekolah';
        tr.innerHTML = `
            <td>${start + i + 1}</td>
            <td><strong>${g.username || ''}</strong>${isKepsek ? ' ⭐' : ''}</td>
            <td><span style="background:var(--gray-100);padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;">${g.kelas || '-'}</span></td>
            <td><span style="background:${isKepsek ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.1)'};padding:2px 10px;border-radius:12px;font-size:11px;font-weight:600;color:${isKepsek ? 'var(--warning)' : 'var(--primary)'};">${g.jabatan || 'Guru'}</span></td>
            <td>
                ${!isKepsek ? `
                    <button onclick="editGuru('${g.id}')" class="btn btn-warning btn-sm">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="hapusGuru('${g.id}')" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : '<span style="color:var(--gray-400);font-size:11px;">Tidak dapat diedit</span>'}
            </td>
        `;
        tbody.appendChild(tr);
    });

    const info = document.getElementById('guruInfo');
    if (info) {
        info.textContent = `Menampilkan ${start + 1} - ${Math.min(end, filtered.length)} dari ${filtered.length} data`;
    }
    const pageInfo = document.getElementById('guruPageInfo');
    if (pageInfo) {
        pageInfo.textContent = `${guruCurrentPage} dari ${Math.ceil(filtered.length / guruPerPage) || 1}`;
    }
}

// ============================================================
// TAMBAH GURU
// ============================================================
async function tambahGuru() {
    showModal('Tambah Guru', `
        <form id="formTambahGuru">
            <div class="form-group">
                <label>Username *</label>
                <input type="text" id="tGuruUsername" required placeholder="Contoh: guru01">
            </div>
            <div class="form-group">
                <label>Guru Kelas</label>
                <input type="text" id="tGuruKelas" placeholder="Contoh: XII RPL 1">
            </div>
            <div class="form-group">
                <label>Jabatan</label>
                <select id="tGuruJabatan">
                    <option value="Guru">Guru</option>
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                </select>
            </div>
            <div class="form-group">
                <label>Password *</label>
                <input type="password" id="tGuruPassword" required placeholder="Minimal 6 karakter">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
                <i class="fas fa-save"></i> Simpan Guru
            </button>
        </form>
    `);

    document.getElementById('formTambahGuru').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const data = {
            username: document.getElementById('tGuruUsername').value.trim(),
            kelas: document.getElementById('tGuruKelas').value.trim(),
            jabatan: document.getElementById('tGuruJabatan').value,
            password: document.getElementById('tGuruPassword').value
        };

        if (!data.username || !data.password) {
            showToast('Username dan password harus diisi!', 'error');
            return;
        }

        if (data.password.length < 6) {
            showToast('Password minimal 6 karakter!', 'error');
            return;
        }

        try {
            showToast('Menyimpan data...', 'info');
            const result = await callAPI('addGuru', data);
            
            if (result && result.success) {
                await loadGuruData();
                closeModal();
                showToast(result.message || 'Guru berhasil ditambahkan!', 'success');
            } else {
                showToast(result?.message || 'Gagal menambahkan guru!', 'error');
            }
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    });
}

// ============================================================
// EDIT GURU
// ============================================================
async function editGuru(id) {
    const guru = guruData.find(g => g.id === id);
    if (!guru) {
        showToast('Guru tidak ditemukan', 'error');
        return;
    }

    showModal('Edit Guru', `
        <form id="formEditGuru">
            <div class="form-group">
                <label>Username</label>
                <input type="text" id="eGuruUsername" value="${guru.username || ''}" required>
            </div>
            <div class="form-group">
                <label>Guru Kelas</label>
                <input type="text" id="eGuruKelas" value="${guru.kelas || ''}">
            </div>
            <div class="form-group">
                <label>Jabatan</label>
                <select id="eGuruJabatan">
                    <option value="Guru" ${guru.jabatan === 'Guru' ? 'selected' : ''}>Guru</option>
                    <option value="Kepala Sekolah" ${guru.jabatan === 'Kepala Sekolah' ? 'selected' : ''}>Kepala Sekolah</option>
                </select>
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="eGuruPassword" value="${guru.password || ''}" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;">
                <i class="fas fa-save"></i> Update Guru
            </button>
        </form>
    `);

    document.getElementById('formEditGuru').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const data = {
            id: id,
            username: document.getElementById('eGuruUsername').value.trim(),
            kelas: document.getElementById('eGuruKelas').value.trim(),
            jabatan: document.getElementById('eGuruJabatan').value,
            password: document.getElementById('eGuruPassword').value
        };

        try {
            showToast('Mengupdate data...', 'info');
            const result = await callAPI('updateGuru', data);
            
            if (result && result.success) {
                await loadGuruData();
                closeModal();
                showToast(result.message || 'Data guru berhasil diupdate!', 'success');
            } else {
                showToast(result?.message || 'Gagal mengupdate data!', 'error');
            }
        } catch (error) {
            showToast('Error: ' + error.message, 'error');
        }
    });
}

// ============================================================
// HAPUS GURU
// ============================================================
async function hapusGuru(id) {
    const guru = guruData.find(g => g.id === id);
    if (guru?.jabatan === 'Kepala Sekolah') {
        showToast('Tidak dapat menghapus Kepala Sekolah!', 'error');
        return;
    }
    
    if (!confirm('Yakin hapus guru ini?')) return;

    try {
        showToast('Menghapus data...', 'info');
        const result = await callAPI('deleteGuru', { username: guru?.username });
        
        if (result && result.success) {
            await loadGuruData();
            showToast(result.message || 'Guru berhasil dihapus', 'success');
        } else {
            showToast(result?.message || 'Gagal menghapus guru!', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// ============================================================
// FILTER & PAGINATION
// ============================================================
function filterGuru() {
    guruCurrentPage = 1;
    updateGuruTable();
}

function refreshDataGuru() {
    loadGuruData();
}

function prevGuruPage() {
    if (guruCurrentPage > 1) {
        guruCurrentPage--;
        updateGuruTable();
    }
}

function nextGuruPage() {
    const totalPages = Math.ceil(guruData.length / guruPerPage);
    if (guruCurrentPage < totalPages) {
        guruCurrentPage++;
        updateGuruTable();
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================
function getKepsekNama() {
    const kepsek = allGuru.find(g => g.jabatan === 'Kepala Sekolah');
    return kepsek ? kepsek.username : 'Dr. H. Ahmad, M.Pd.';
}

function getKepsekNip() {
    const kepsek = allGuru.find(g => g.jabatan === 'Kepala Sekolah');
    return kepsek ? '196512312005011001' : '196512312005011001';
}

function getGuruNama() {
    const guru = allGuru.find(g => g.jabatan === 'Guru' && g.kelas);
    return guru ? guru.username : 'Drs. Budi, M.Pd.';
}

function getGuruNip() {
    const guru = allGuru.find(g => g.jabatan === 'Guru' && g.kelas);
    return guru ? '197001012008012001' : '197001012008012001';
}