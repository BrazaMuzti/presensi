// Data Guru Module
let guruData = [];
let guruCurrentPage = 1;
let guruPerPage = 10;

function loadGuruData() {
    // Simulasi data dari spreadsheet
    guruData = [
        { id: 'G001', username: 'guru01', kelas: 'XII RPL 1', password: 'guru123' },
        { id: 'G002', username: 'guru02', kelas: 'XII RPL 2', password: 'guru123' },
        { id: 'G003', username: 'guru03', kelas: 'XII MM 1', password: 'guru123' },
    ];
    allGuru = guruData;
    updateGuruTable();
}

function updateGuruTable() {
    const search = document.getElementById('searchGuru').value.toLowerCase();
    const kelasFilter = document.getElementById('filterGuruKelas').value;
    guruPerPage = parseInt(document.getElementById('showGuruEntries').value);

    let filtered = guruData.filter(g => {
        const matchSearch = g.username.toLowerCase().includes(search);
        const matchKelas = kelasFilter === 'all' || g.kelas === kelasFilter;
        return matchSearch && matchKelas;
    });

    const start = (guruCurrentPage - 1) * guruPerPage;
    const end = start + guruPerPage;
    const pageData = filtered.slice(start, end);

    const tbody = document.getElementById('guruTableBody');
    tbody.innerHTML = '';

    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Tidak ada data</td></tr>';
        return;
    }

    pageData.forEach((g, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td>${start + i + 1}</td>
        <td>${g.username}</td>
        <td>${g.kelas || '-'}</td>
        <td>${g.password}</td>
        <td>
        <button onclick="editGuru('${g.id}')" class="btn-warning" style="padding:4px 8px;">
        <i class="fas fa-edit"></i>
        </button>
        <button onclick="hapusGuru('${g.id}')" class="btn-danger" style="padding:4px 8px;">
        <i class="fas fa-trash"></i>
        </button>
        </td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('guruInfo').textContent =
    `Menampilkan ${start + 1} - ${Math.min(end, filtered.length)} dari ${filtered.length} data`;
    document.getElementById('guruPageInfo').textContent =
    `${guruCurrentPage} dari ${Math.ceil(filtered.length / guruPerPage) || 1}`;
}

function filterGuru() {
    guruCurrentPage = 1;
    updateGuruTable();
}

function refreshDataGuru() {
    loadGuruData();
    showToast('Data guru berhasil diperbarui', 'success');
}

function tambahGuru() {
    showModal('Tambah Guru', `
    <form id="formTambahGuru">
    <div class="form-group">
    <label>Username</label>
    <input type="text" id="tGuruUsername" required>
    </div>
    <div class="form-group">
    <label>Guru Kelas</label>
    <input type="text" id="tGuruKelas">
    </div>
    <div class="form-group">
    <label>Password</label>
    <input type="password" id="tGuruPassword" required>
    </div>
    <button type="submit" class="btn-primary">Simpan</button>
    </form>
    `);

    document.getElementById('formTambahGuru').addEventListener('submit', function(e) {
        e.preventDefault();
        const data = {
            id: 'G' + String(guruData.length + 1).padStart(3, '0'),
                                                               username: document.getElementById('tGuruUsername').value,
                                                               kelas: document.getElementById('tGuruKelas').value,
                                                               password: document.getElementById('tGuruPassword').value
        };

        guruData.push(data);
        allGuru = guruData;
        updateGuruTable();
        closeModal();
        showToast('Guru berhasil ditambahkan', 'success');
    });
}

function editGuru(id) {
    const guru = guruData.find(g => g.id === id);
    if (!guru) {
        showToast('Guru tidak ditemukan', 'error');
        return;
    }

    showModal('Edit Guru', `
    <form id="formEditGuru">
    <div class="form-group">
    <label>Username</label>
    <input type="text" id="eGuruUsername" value="${guru.username}" required>
    </div>
    <div class="form-group">
    <label>Guru Kelas</label>
    <input type="text" id="eGuruKelas" value="${guru.kelas || ''}">
    </div>
    <div class="form-group">
    <label>Password</label>
    <input type="password" id="eGuruPassword" value="${guru.password}" required>
    </div>
    <button type="submit" class="btn-primary">Update</button>
    </form>
    `);

    document.getElementById('formEditGuru').addEventListener('submit', function(e) {
        e.preventDefault();
        const index = guruData.findIndex(g => g.id === id);
        if (index !== -1) {
            guruData[index] = {
                id: id,
                username: document.getElementById('eGuruUsername').value,
                                                             kelas: document.getElementById('eGuruKelas').value,
                                                             password: document.getElementById('eGuruPassword').value
            };
            allGuru = guruData;
            updateGuruTable();
            closeModal();
            showToast('Data guru berhasil diupdate', 'success');
        }
    });
}

function hapusGuru(id) {
    if (confirm(`Apakah Anda yakin ingin menghapus guru ini?`)) {
        guruData = guruData.filter(g => g.id !== id);
        allGuru = guruData;
        updateGuruTable();
        showToast('Guru berhasil dihapus', 'success');
    }
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
