// ============================================================
// KELOLA ABSEN MODULE - DENGAN KONEKSI SPREADSHEET
// ============================================================

let jadwalData = [];
let liburData = [];

// ============================================================
// LOAD JADWAL & LIBUR
// ============================================================
async function loadJadwalData() {
    try {
        const result = await callAPI('getJadwal');
        if (result && result.success) {
            jadwalData = result.data || [];
            allJadwal = jadwalData;
        } else {
            useDemoJadwalData();
        }
    } catch (error) {
        console.error('Error loading jadwal:', error);
        useDemoJadwalData();
    }
    renderJadwal();
}

function useDemoJadwalData() {
    jadwalData = [
        { id: 1, mapel: 'Matematika', jam_datang: '07:00', jam_selesai: '08:30', kelas: 'XII RPL 1' },
        { id: 2, mapel: 'Bahasa Indonesia', jam_datang: '08:45', jam_selesai: '10:15', kelas: 'XII RPL 1' },
        { id: 3, mapel: 'Pemrograman', jam_datang: '10:30', jam_selesai: '12:00', kelas: 'XII RPL 1' },
    ];
    allJadwal = jadwalData;
}

async function loadLiburData() {
    try {
        const result = await callAPI('getLibur');
        if (result && result.success) {
            liburData = result.data || [];
            allLibur = liburData;
        } else {
            useDemoLiburData();
        }
    } catch (error) {
        console.error('Error loading libur:', error);
        useDemoLiburData();
    }
    renderLibur();
}

function useDemoLiburData() {
    liburData = [
        { tanggal: '2024-12-25', keterangan: 'Hari Natal' },
        { tanggal: '2024-12-31', keterangan: 'Tahun Baru' },
    ];
    allLibur = liburData;
}

// ============================================================
// RENDER JADWAL & LIBUR
// ============================================================
function renderJadwal() {
    const container = document.getElementById('jadwalList');
    if (!container) return;
    
    if (jadwalData.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:16px;color:var(--gray-400);font-size:12px;">Belum ada jadwal</p>';
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
                <td><strong>${j.mapel || ''}</strong></td>
                <td>${j.jam_datang || j.jamDatang || ''}</td>
                <td>${j.jam_selesai || j.jamSelesai || ''}</td>
                <td><span style="background:var(--gray-100);padding:2px 10px;border-radius:12px;font-size:11px;">${j.kelas || ''}</span></td>
                <td>
                    <button onclick="hapusJadwal(${j.id})" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderLibur() {
    const container = document.getElementById('liburList');
    if (!container) return;
    
    if (liburData.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:16px;color:var(--gray-400);font-size:12px;">Belum ada hari libur</p>';
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
                <td>${l.tanggal || ''}</td>
                <td>${l.keterangan || ''}</td>
                <td>
                    <button onclick="hapusLibur('${l.tanggal}')" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i>
                    </button>
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
async function tambahJadwal() {
    const mapel = document.getElementById('mapelInput')?.value?.trim() || '';
    const jamDatang = document.getElementById('jamDatang')?.value || '';
    const jamSelesai = document.getElementById('jamSelesai')?.value || '';
    const kelas = document.getElementById('jadwalKelas')?.value || '';

    if (!mapel || !jamDatang || !jamSelesai || !kelas) {
        showToast('Semua field harus diisi!', 'error');
        return;
    }

    const data = {
        mapel: mapel,
        jam_datang: jamDatang,
        jam_selesai: jamSelesai,
        kelas: kelas
    };

    try {
        showToast('Menyimpan jadwal...', 'info');
        const result = await callAPI('addJadwal', data);
        
        if (result && result.success) {
            await loadJadwalData();
            showToast(result.message || 'Jadwal berhasil ditambahkan', 'success');
            
            document.getElementById('mapelInput').value = '';
            document.getElementById('jamDatang').value = '';
            document.getElementById('jamSelesai').value = '';
            document.getElementById('jadwalKelas').value = '';
        } else {
            showToast(result?.message || 'Gagal menambahkan jadwal!', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function hapusJadwal(id) {
    if (!confirm('Hapus jadwal ini?')) return;

    try {
        showToast('Menghapus jadwal...', 'info');
        const result = await callAPI('deleteJadwal', { id });
        
        if (result && result.success) {
            await loadJadwalData();
            showToast(result.message || 'Jadwal berhasil dihapus', 'success');
        } else {
            showToast(result?.message || 'Gagal menghapus jadwal!', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// ============================================================
// CRUD LIBUR
// ============================================================
async function tambahLibur() {
    const tanggal = document.getElementById('tanggalLibur')?.value || '';
    const keterangan = document.getElementById('keteranganLibur')?.value?.trim() || '';

    if (!tanggal || !keterangan) {
        showToast('Tanggal dan keterangan harus diisi!', 'error');
        return;
    }

    const data = {
        tanggal: tanggal,
        keterangan: keterangan
    };

    try {
        showToast('Menyimpan hari libur...', 'info');
        const result = await callAPI('addLibur', data);
        
        if (result && result.success) {
            await loadLiburData();
            showToast(result.message || 'Hari libur berhasil ditambahkan', 'success');
            
            document.getElementById('tanggalLibur').value = '';
            document.getElementById('keteranganLibur').value = '';
        } else {
            showToast(result?.message || 'Gagal menambahkan hari libur!', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

async function hapusLibur(tanggal) {
    if (!confirm('Hapus hari libur ini?')) return;

    try {
        showToast('Menghapus hari libur...', 'info');
        const result = await callAPI('deleteLibur', { tanggal });
        
        if (result && result.success) {
            await loadLiburData();
            showToast(result.message || 'Hari libur berhasil dihapus', 'success');
        } else {
            showToast(result?.message || 'Gagal menghapus hari libur!', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}

// ============================================================
// KELOLA KEHADIRAN
// ============================================================
async function loadKelolaAbsen() {
    const kelas = document.getElementById('kelolaKelas')?.value || 'all';
    const tanggal = document.getElementById('kelolaTanggal')?.value || '';

    let data = allAbsensi || [];
    if (kelas !== 'all') {
        data = data.filter(a => a.kelas === kelas);
    }
    if (tanggal) {
        data = data.filter(a => a.tanggal === tanggal);
    }

    const tbody = document.getElementById('kelolaTableBody');
    if (!tbody) return;
    
    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;padding:20px;color:var(--gray-400);font-size:13px;">
                    Tidak ada data
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';
    data.forEach((item, i) => {
        const tr = document.createElement('tr');
        const statusOptions = ['Hadir', 'Sakit', 'Izin', 'Alpha'].map(s =>
            `<option value="${s}" ${s === item.status ? 'selected' : ''}>${s}</option>`).join('');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.nama || ''}</td>
            <td>${item.kelas || ''}</td>
            <td><span class="status-badge ${item.status?.toLowerCase() || ''}">${item.status || '-'}</span></td>
            <td>
                <select class="edit-status" data-nis="${item.nis}" data-tanggal="${item.tanggal}" style="padding:4px 8px;border:1px solid var(--gray-200);border-radius:var(--radius);font-size:11px;outline:none;">
                    ${statusOptions}
                </select>
                <button onclick="updateKelolaStatus(this)" class="btn btn-primary btn-sm">
                    <i class="fas fa-save"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function updateKelolaStatus(button) {
    const row = button.closest('tr');
    const select = row.querySelector('.edit-status');
    const nis = select.dataset.nis;
    const tanggal = select.dataset.tanggal;
    const newStatus = select.value;

    try {
        showToast('Mengupdate status...', 'info');
        const result = await callAPI('updateAbsensi', {
            nis: nis,
            tanggal: tanggal,
            status: newStatus,
            keterangan: 'Diedit manual'
        });
        
        if (result && result.success) {
            const absen = allAbsensi.find(a => a.nis === nis && a.tanggal === tanggal);
            if (absen) {
                absen.status = newStatus;
                absen.keterangan = 'Diedit manual';
            }
            loadKelolaAbsen();
            updateStats();
            showToast(result.message || 'Status berhasil diupdate', 'success');
        } else {
            showToast(result?.message || 'Gagal mengupdate status!', 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }
}