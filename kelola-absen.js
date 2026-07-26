// ============================================================
// KELOLA ABSEN MODULE
// ============================================================

let jadwalData = [];
let liburData = [];

// ============================================================
// LOAD JADWAL & LIBUR
// ============================================================
function loadJadwalData() {
    jadwalData = [
        { id: 1, mapel: 'Matematika', jamDatang: '07:00', jamSelesai: '08:30', kelas: 'XII RPL 1' },
        { id: 2, mapel: 'Bahasa Indonesia', jamDatang: '08:45', jamSelesai: '10:15', kelas: 'XII RPL 1' },
        { id: 3, mapel: 'Pemrograman', jamDatang: '10:30', jamSelesai: '12:00', kelas: 'XII RPL 1' },
    ];
    allJadwal = jadwalData;
    renderJadwal();
}

function loadLiburData() {
    liburData = [
        { tanggal: '2024-12-25', keterangan: 'Hari Natal' },
        { tanggal: '2024-12-31', keterangan: 'Tahun Baru' },
    ];
    allLibur = liburData;
    renderLibur();
}

// ============================================================
// RENDER JADWAL & LIBUR
// ============================================================
function renderJadwal() {
    const container = document.getElementById('jadwalList');
    if (jadwalData.length === 0) {
        container.innerHTML =
        '<p style="text-align:center;padding:16px;color:var(--gray-400);font-size:12px;">Belum ada jadwal</p>';
    return;
    }

    let html = `
    <table>
    <thead>
    <tr>
    <th>#</th>
    <th>Mata Pelajaran</th>
    <th>Jam Datang</th>
    <th>Jam Selesai</th>
    <th>Kelas</th>
    <th>Aksi</th>
    </tr>
    </thead>
    <tbody>
    `;

    jadwalData.forEach((j, i) => {
        html += `
        <tr>
        <td>${i + 1}</td>
        <td><strong>${j.mapel}</strong></td>
        <td>${j.jamDatang}</td>
        <td>${j.jamSelesai}</td>
        <td><span style="background:var(--gray-100);padding:2px 10px;border-radius:12px;font-size:11px;">${j.kelas}</span></td>
        <td>
        <button onclick="hapusJadwal(${j.id})" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
        </td>
        </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderLibur() {
    const container = document.getElementById('liburList');
    if (liburData.length === 0) {
        container.innerHTML =
        '<p style="text-align:center;padding:16px;color:var(--gray-400);font-size:12px;">Belum ada hari libur</p>';
    return;
    }

    let html = `
    <table>
    <thead>
    <tr>
    <th>#</th>
    <th>Tanggal</th>
    <th>Keterangan</th>
    <th>Aksi</th>
    </tr>
    </thead>
    <tbody>
    `;

    liburData.forEach((l, i) => {
        html += `
        <tr>
        <td>${i + 1}</td>
        <td>${l.tanggal}</td>
        <td>${l.keterangan}</td>
        <td>
        <button onclick="hapusLibur(${i})" class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
        </td>
        </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ============================================================
// CRUD JADWAL
// ============================================================
function tambahJadwal() {
    const mapel = document.getElementById('mapelInput').value.trim();
    const jamDatang = document.getElementById('jamDatang').value;
    const jamSelesai = document.getElementById('jamSelesai').value;
    const kelas = document.getElementById('jadwalKelas').value;

    if (!mapel || !jamDatang || !jamSelesai || !kelas) {
        showToast('Semua field harus diisi!', 'error');
        return;
    }

    const id = jadwalData.length > 0 ? Math.max(...jadwalData.map(j => j.id)) + 1 : 1;
    jadwalData.push({ id, mapel, jamDatang, jamSelesai, kelas });
    allJadwal = jadwalData;
    renderJadwal();
    showToast('Jadwal berhasil ditambahkan', 'success');

    document.getElementById('mapelInput').value = '';
    document.getElementById('jamDatang').value = '';
    document.getElementById('jamSelesai').value = '';
    document.getElementById('jadwalKelas').value = '';
}

function hapusJadwal(id) {
    if (confirm('Hapus jadwal ini?')) {
        jadwalData = jadwalData.filter(j => j.id !== id);
        allJadwal = jadwalData;
        renderJadwal();
        showToast('Jadwal berhasil dihapus', 'success');
    }
}

// ============================================================
// CRUD LIBUR
// ============================================================
function tambahLibur() {
    const tanggal = document.getElementById('tanggalLibur').value;
    const keterangan = document.getElementById('keteranganLibur').value.trim();

    if (!tanggal || !keterangan) {
        showToast('Tanggal dan keterangan harus diisi!', 'error');
        return;
    }

    liburData.push({ tanggal, keterangan });
    allLibur = liburData;
    renderLibur();
    showToast('Hari libur berhasil ditambahkan', 'success');

    document.getElementById('tanggalLibur').value = '';
    document.getElementById('keteranganLibur').value = '';
}

function hapusLibur(index) {
    if (confirm('Hapus hari libur ini?')) {
        liburData.splice(index, 1);
        allLibur = liburData;
        renderLibur();
        showToast('Hari libur berhasil dihapus', 'success');
    }
}

// ============================================================
// KELOLA KEHADIRAN
// ============================================================
function loadKelolaAbsen() {
    const kelas = document.getElementById('kelolaKelas').value;
    const tanggal = document.getElementById('kelolaTanggal').value;

    let data = allAbsensi;
    if (kelas !== 'all') {
        data = data.filter(a => a.kelas === kelas);
    }
    if (tanggal) {
        data = data.filter(a => a.tanggal === tanggal);
    }

    const tbody = document.getElementById('kelolaTableBody');
    if (data.length === 0) {
        tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;padding:20px;color:var(--gray-400);font-size:13px;">Tidak ada data</td></tr>';
    return;
    }

    tbody.innerHTML = '';
    data.forEach((item, i) => {
        const tr = document.createElement('tr');
        const statusOptions = ['Hadir', 'Sakit', 'Izin', 'Alpha'].map(s =>
        `<option value="${s}" ${s === item.status ? 'selected' : ''}>${s}</option>`).join('');
        tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${item.nama}</td>
        <td>${item.kelas}</td>
        <td><span class="status-badge ${item.status?.toLowerCase() || ''}">${item.status || '-'}</span></td>
        <td>
        <select class="edit-status" data-idx="${i}" style="padding:4px 8px;border:1px solid var(--gray-200);border-radius:var(--radius);font-size:11px;outline:none;">
        ${statusOptions}
        </select>
        <button onclick="updateKelolaStatus(${i})" class="btn btn-primary btn-sm"><i class="fas fa-save"></i></button>
        </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateKelolaStatus(index) {
    const selects = document.querySelectorAll('.edit-status');
    if (selects[index]) {
        const newStatus = selects[index].value;
        if (allAbsensi[index]) {
            allAbsensi[index].status = newStatus;
            showToast(`Status berhasil diupdate menjadi ${newStatus}`, 'success');
            loadKelolaAbsen();
            updateStats();
        }
    }
}
