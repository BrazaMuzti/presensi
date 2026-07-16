// Laporan Module
function generateLaporan() {
    const kelas = document.getElementById('laporanKelas').value;
    const bulan = parseInt(document.getElementById('laporanBulan').value);

    // Filter data berdasarkan kelas dan bulan
    let data = allAbsensi;
    if (kelas !== 'all') {
        data = data.filter(a => a.kelas === kelas);
    }

    // Filter berdasarkan bulan (simulasi)
    // ...

    const content = document.getElementById('laporanContent');

    if (data.length === 0) {
        content.innerHTML = '<p style="text-align:center;padding:20px;">Tidak ada data untuk ditampilkan</p>';
        return;
    }

    // Generate laporan
    let html = `
    <h4>Laporan Kehadiran ${kelas !== 'all' ? `Kelas ${kelas}` : 'Semua Kelas'}</h4>
    <p>Periode: ${new Date(2024, bulan, 1).toLocaleDateString('id-ID', {month:'long', year:'numeric'})}</p>
    <table style="width:100%;margin-top:15px;border-collapse:collapse;">
    <thead>
    <tr style="background:#f8f9fa;">
    <th style="padding:10px;border:1px solid #ddd;">No</th>
    <th style="padding:10px;border:1px solid #ddd;">Nama</th>
    <th style="padding:10px;border:1px solid #ddd;">Kelas</th>
    <th style="padding:10px;border:1px solid #ddd;">Tanggal</th>
    <th style="padding:10px;border:1px solid #ddd;">Status</th>
    <th style="padding:10px;border:1px solid #ddd;">Keterangan</th>
    </tr>
    </thead>
    <tbody>
    `;

    data.forEach((item, i) => {
        const statusColor = {
            'Hadir': '#28a745',
            'Sakit': '#ffc107',
            'Izin': '#17a2b8',
            'Alpha': '#dc3545'
        };
        html += `
        <tr>
        <td style="padding:10px;border:1px solid #ddd;">${i + 1}</td>
        <td style="padding:10px;border:1px solid #ddd;">${item.nama}</td>
        <td style="padding:10px;border:1px solid #ddd;">${item.kelas}</td>
        <td style="padding:10px;border:1px solid #ddd;">${item.tanggal}</td>
        <td style="padding:10px;border:1px solid #ddd;">
        <span style="background:${statusColor[item.status] || '#6c757d'};color:white;padding:2px 10px;border-radius:4px;">
        ${item.status || '-'}
        </span>
        </td>
        <td style="padding:10px;border:1px solid #ddd;">${item.keterangan || '-'}</td>
        </tr>
        `;
    });

    html += `
    </tbody>
    </table>
    <div style="margin-top:20px;padding:15px;background:#f8f9fa;border-radius:8px;">
    <p><strong>Total Siswa:</strong> ${data.length}</p>
    <p><strong>Hadir:</strong> ${data.filter(d => d.status === 'Hadir').length}</p>
    <p><strong>Sakit:</strong> ${data.filter(d => d.status === 'Sakit').length}</p>
    <p><strong>Izin:</strong> ${data.filter(d => d.status === 'Izin').length}</p>
    <p><strong>Alpha:</strong> ${data.filter(d => d.status === 'Alpha').length}</p>
    </div>
    `;

    content.innerHTML = html;
}

function exportLaporan() {
    const content = document.getElementById('laporanContent');
    if (content.innerHTML === '' || content.innerHTML.includes('Tidak ada data')) {
        showToast('Tidak ada data untuk diexport', 'error');
        return;
    }

    // Simulasi export PDF - dalam implementasi nyata gunakan library seperti jsPDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
    <html>
    <head>
    <title>Laporan Kehadiran</title>
    <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
    th { background: #f5f5f5; }
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
