// Kelola Absen Module
let jadwalData = [];
let liburData = [];

function loadJadwalData() {
  // Simulasi data jadwal
  jadwalData = [
    { id: 1, mapel: 'Matematika', jamDatang: '07:00', jamSelesai: '08:30', kelas: 'XII RPL 1' },
    { id: 2, mapel: 'Bahasa Indonesia', jamDatang: '08:45', jamSelesai: '10:15', kelas: 'XII RPL 1' },
    { id: 3, mapel: 'Pemrograman', jamDatang: '10:30', jamSelesai: '12:00', kelas: 'XII RPL 1' },
  ];
  allJadwal = jadwalData;
  renderJadwal();
}

function loadLiburData() {
  // Simulasi data libur
  liburData = [
    { tanggal: '2024-12-25', keterangan: 'Hari Natal' },
    { tanggal: '2024-12-31', keterangan: 'Tahun Baru' },
  ];
  allLibur = liburData;
  renderLibur();
}

function renderJadwal() {
  const container = document.getElementById('jadwalList');
  if (jadwalData.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:20px;">Belum ada jadwal</p>';
    return;
  }

  let html = `
  <table style="width:100%;margin-top:15px;">
  <thead>
  <tr>
  <th>No</th>
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
    <td>${j.mapel}</td>
    <td>${j.jamDatang}</td>
    <td>${j.jamSelesai}</td>
    <td>${j.kelas}</td>
    <td>
    <button onclick="hapusJadwal(${j.id})" class="btn-danger" style="padding:4px 8px;">
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
  if (liburData.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:20px;">Belum ada hari libur</p>';
    return;
  }

  let html = `
  <table style="width:100%;margin-top:15px;">
  <thead>
  <tr>
  <th>No</th>
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
    <button onclick="hapusLibur(${i})" class="btn-danger" style="padding:4px 8px;">
    <i class="fas fa-trash"></i>
    </button>
    </td>
    </tr>
    `;
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

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

  // Reset form
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

  // Reset form
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
