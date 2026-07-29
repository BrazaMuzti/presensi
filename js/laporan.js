// ============================================================
// LAPORAN MODULE
// ============================================================

// ============================================================
// GENERATE LAPORAN
// ============================================================
function generateLaporan() {
    const kelas = document.getElementById('laporanKelas').value;
    const bulan = parseInt(document.getElementById('laporanBulan').value);

    let data = allAbsensi;
    if (kelas !== 'all') {
        data = data.filter(a => a.kelas === kelas);
    }

    // Filter by month
    const monthStr = String(bulan + 1).padStart(2, '0');
    data = data.filter(a => a.tanggal && a.tanggal.substring(5, 7) === monthStr);

    const content = document.getElementById('laporanContent');

    if (data.length === 0) {
        content.innerHTML = `
            <p class="empty-state">
                <i class="fas fa-file-alt"></i>
                Tidak ada data untuk ditampilkan
            </p>
        `;
        return;
    }

    const bulanNama = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober',
        'November', 'Desember'
    ];

    let html = `
        <h4 style="margin-bottom:4px;">Laporan Kehadiran ${kelas !== 'all' ? `Kelas ${kelas}` : 'Semua Kelas'}</h4>
        <p style="color:var(--gray-500);font-size:12px;margin-bottom:14px;">Periode: ${bulanNama[bulan]} 2024</p>
        <div class="table-responsive">
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nama</th>
                        <th>Kelas</th>
                        <th>Tanggal</th>
                        <th>Status</th>
                        <th>Keterangan</th>
                    </tr>
                </thead>
                <tbody>
    `;

    data.forEach((item, i) => {
        const statusClass = {
            'Hadir': 'hadir',
            'Sakit': 'sakit',
            'Izin': 'izin',
            'Alpha': 'alpha'
        };
        html += `
            <tr>
                <td>${i + 1}</td>
                <td>${item.nama || ''}</td>
                <td>${item.kelas || ''}</td>
                <td>${item.tanggal || ''}</td>
                <td><span class="status-badge ${statusClass[item.status] || ''}">${item.status || '-'}</span></td>
                <td>${item.keterangan || '-'}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
        <div style="margin:16px 0;padding:12px;background:var(--gray-50);border-radius:var(--radius);display:grid;grid-template-columns:repeat(5,1fr);gap:10px;text-align:center;font-size:13px;">
            <div><strong>Total</strong><br>${data.length}</div>
            <div style="color:var(--success);"><strong>Hadir</strong><br>${data.filter(d => d.status === 'Hadir').length}</div>
            <div style="color:var(--warning);"><strong>Sakit</strong><br>${data.filter(d => d.status === 'Sakit').length}</div>
            <div style="color:var(--info);"><strong>Izin</strong><br>${data.filter(d => d.status === 'Izin').length}</div>
            <div style="color:var(--danger);"><strong>Alpha</strong><br>${data.filter(d => d.status === 'Alpha').length}</div>
        </div>
        <div class="ttd-section">
            <div class="ttd-box">
                <div class="ttd-label">Mengetahui,<br>Kepala Sekolah</div>
                <div class="ttd-line"></div>
                <div class="ttd-name">${getKepsekNama()}</div>
                <div class="ttd-nip">NIP. ${getKepsekNip()}</div>
            </div>
            <div class="ttd-box">
                <div class="ttd-label">Petugas,<br>Guru</div>
                <div class="ttd-line"></div>
                <div class="ttd-name">${getGuruNama()}</div>
                <div class="ttd-nip">NIP. ${getGuruNip()}</div>
            </div>
        </div>
    `;

    content.innerHTML = html;
}

// ============================================================
// EXPORT LAPORAN
// ============================================================
function exportLaporan() {
    const content = document.getElementById('laporanContent');
    if (content.innerHTML.includes('Tidak ada data')) {
        showToast('Tidak ada data untuk diexport', 'error');
        return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Laporan Kehadiran</title>
                <style>
                    * { font-family: Arial, sans-serif; }
                    body { padding: 30px; }
                    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                    th, td { padding: 8px 10px; border: 1px solid #ddd; text-align: left; font-size: 12px; }
                    th { background: #f5f5f5; }
                    .status-badge { padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
                    .hadir { background: #d1fae5; color: #065f46; }
                    .sakit { background: #fef3c7; color: #92400e; }
                    .izin { background: #dbeafe; color: #1e40af; }
                    .alpha { background: #fee2e2; color: #991b1b; }
                    .ttd-section { display: flex; justify-content: space-between; margin-top: 40px; padding-top: 30px; border-top: 2px solid #333; }
                    .ttd-box { text-align: center; min-width: 180px; }
                    .ttd-box .ttd-label { font-size: 12px; color: #666; margin-bottom: 30px; }
                    .ttd-box .ttd-line { width: 180px; border-bottom: 1px solid #333; margin: 0 auto 4px; }
                    .ttd-box .ttd-name { font-weight: 600; font-size: 13px; }
                    .ttd-box .ttd-nip { font-size: 11px; color: #666; }
                </style>
            </head>
            <body>
                ${content.innerHTML}
                <script>
                    window.onload = function() { window.print(); }
                <\/script>
            </body>
        </html>
    `);
    printWindow.document.close();
}