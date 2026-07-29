// ============================================================
// SCAN ABSENSI MODULE
// ============================================================

let scanStream = null;
let scanActive = false;
let scanLogData = [];
let currentCamera = 'environment';

// ============================================================
// CAMERA SWITCH
// ============================================================
function switchCamera() {
    currentCamera = document.getElementById('cameraSelect').value;
    if (scanActive) {
        stopScan();
        setTimeout(startScan, 500);
    }
}

// ============================================================
// START SCAN
// ============================================================
async function startScan() {
    if (scanActive) return;

    try {
        const video = document.getElementById('video');
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: currentCamera }
        });
        video.srcObject = stream;
        scanStream = stream;
        scanActive = true;

        const location = await getLocation();
        document.getElementById('gpsLocation').textContent = location || 'Lokasi tidak tersedia';

        scanQRCode();
        showToast('Scan aktif, arahkan ke QR Code', 'info');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error(error);
    }
}

// ============================================================
// STOP SCAN
// ============================================================
function stopScan() {
    if (scanStream) {
        scanStream.getTracks().forEach(track => track.stop());
        scanStream = null;
    }
    scanActive = false;
    document.getElementById('video').srcObject = null;
    showToast('Scan dihentikan', 'info');
}

// ============================================================
// SCAN QR CODE
// ============================================================
function scanQRCode() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    function scan() {
        if (!scanActive) return;

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code && code.data) {
                try {
                    const data = JSON.parse(code.data);
                    processQRData(data);
                    stopScan();
                    return;
                } catch (e) {}
            }
        }

        requestAnimationFrame(scan);
    }

    scan();
}

// ============================================================
// PROCESS QR DATA
// ============================================================
function processQRData(data) {
    const resultContainer = document.getElementById('scanResult');
    const nis = data.nis || data.username;

    const siswa = allSiswa.find(s => s.nis === nis);

    if (siswa) {
        const today = new Date().toISOString().split('T')[0];
        const existing = allAbsensi.find(a => a.nis === siswa.nis && a.tanggal === today);
        if (existing) {
            resultContainer.innerHTML = `
                <div style="background:var(--warning);color:white;padding:12px;border-radius:var(--radius);">
                    <i class="fas fa-exclamation-triangle" style="margin-right:8px;"></i>
                    ${siswa.nama} sudah melakukan presensi hari ini (${existing.status})
                </div>
            `;
            return;
        }

        resultContainer.innerHTML = `
            <div style="background:var(--success);color:white;padding:12px;border-radius:var(--radius);">
                <i class="fas fa-check-circle" style="margin-right:8px;"></i>
                <strong>${siswa.nama}</strong> (NIS: ${siswa.nis})
                <br>Status: <strong>Hadir</strong>
                <br>Waktu: ${new Date().toLocaleTimeString('id-ID')}
            </div>
        `;

        simpanAbsensi(siswa, 'Hadir', 'Presensi via QR Code');
        updateStats();
        showToast(`Absensi Hadir untuk ${siswa.nama} berhasil`, 'success');
    } else {
        resultContainer.innerHTML = `
            <div style="background:var(--danger);color:white;padding:12px;border-radius:var(--radius);">
                <i class="fas fa-times-circle" style="margin-right:8px;"></i>
                Siswa tidak terdaftar!
            </div>
        `;
    }
}

// ============================================================
// SIMPAN ABSENSI
// ============================================================
async function simpanAbsensi(siswa, status, keterangan = '') {
    const absen = {
        nis: siswa.nis,
        nama: siswa.nama,
        kelas: siswa.kelas,
        tanggal: new Date().toISOString().split('T')[0],
        waktu: new Date().toLocaleTimeString('id-ID'),
        status: status,
        keterangan: keterangan || `Presensi ${status}`
    };

    // Simpan ke local
    if (!allAbsensi) allAbsensi = [];
    allAbsensi.push(absen);
    scanLogData.push(absen);
    updateScanLog();
    updateStats();

    // Simpan ke spreadsheet
    try {
        await callAPI('addAbsensi', absen);
    } catch (error) {
        console.warn('Gagal menyimpan ke spreadsheet:', error);
    }
}

// ============================================================
// UPDATE SCAN LOG
// ============================================================
function updateScanLog() {
    const container = document.getElementById('scanLog');
    if (scanLogData.length === 0) {
        container.innerHTML = '<p class="empty-state">Belum ada presensi</p>';
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayLog = scanLogData.filter(a => a.tanggal === today);

    if (todayLog.length === 0) {
        container.innerHTML = '<p class="empty-state">Belum ada presensi hari ini</p>';
        return;
    }

    container.innerHTML = todayLog.map((item, i) => `
        <div class="result-item">
            <span>${i + 1}. ${item.nama} (${item.kelas})</span>
            <span>
                <span class="status status-badge ${item.status.toLowerCase()}">${item.status}</span>
                <small style="color:var(--gray-400);font-size:10px;">${item.waktu}</small>
                ${item.keterangan ? `<small style="color:var(--gray-400);font-size:10px;">${item.keterangan}</small>` : ''}
            </span>
        </div>
    `).join('');
}

// ============================================================
// PRESENSI MANUAL
// ============================================================
async function presensiManual() {
    const kelas = document.getElementById('manualKelas').value;
    const siswaSelect = document.getElementById('manualSiswa');
    const nis = siswaSelect.value;
    const status = document.querySelector('input[name="status"]:checked')?.value;

    if (!kelas || !nis || !status) {
        showToast('Pilih kelas, siswa, dan status!', 'error');
        return;
    }

    const siswa = allSiswa.find(s => s.nis === nis && s.kelas === kelas);
    if (!siswa) {
        showToast('Siswa tidak ditemukan!', 'error');
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    const existing = allAbsensi.find(a => a.nis === siswa.nis && a.tanggal === today);
    if (existing) {
        if (confirm(`${siswa.nama} sudah presensi ${existing.status}. Ubah status?`)) {
            existing.status = status;
            existing.keterangan = 'Diedit manual';
            showToast(`Status ${siswa.nama} diubah menjadi ${status}`, 'success');
            updateScanLog();
            updateStats();
            
            // Update ke spreadsheet
            try {
                await callAPI('updateAbsensi', {
                    nis: siswa.nis,
                    tanggal: today,
                    status: status,
                    keterangan: 'Diedit manual'
                });
            } catch (error) {
                console.warn('Gagal update ke spreadsheet:', error);
            }
        }
        return;
    }

    await simpanAbsensi(siswa, status, 'Presensi manual');
    showToast(`Presensi ${status} untuk ${siswa.nama} berhasil`, 'success');
    document.getElementById('manualSiswa').value = '';
}

// ============================================================
// UPDATE MANUAL SISWA
// ============================================================
function updateManualSiswa() {
    const kelas = document.getElementById('manualKelas').value;
    const select = document.getElementById('manualSiswa');
    if (!select) return;
    
    select.innerHTML = '<option value="">Pilih Siswa</option>';

    const siswa = allSiswa.filter(s => s.kelas === kelas || kelas === 'all');
    siswa.forEach(s => {
        const option = document.createElement('option');
        option.value = s.nis;
        option.textContent = `${s.nama} (${s.nis})`;
        select.appendChild(option);
    });
}

// ============================================================
// SELESAI SEMUA
// ============================================================
async function selesaiSemua() {
    const kelas = document.getElementById('manualKelas').value;
    const status = document.querySelector('input[name="status"]:checked')?.value;

    if (!kelas || !status) {
        showToast('Pilih kelas dan status!', 'error');
        return;
    }

    const siswaList = allSiswa.filter(s => s.kelas === kelas);
    if (siswaList.length === 0) {
        showToast('Tidak ada siswa di kelas ini', 'warning');
        return;
    }

    if (confirm(`Set semua siswa kelas ${kelas} dengan status ${status}?`)) {
        const today = new Date().toISOString().split('T')[0];
        for (const s of siswaList) {
            const existing = allAbsensi.find(a => a.nis === s.nis && a.tanggal === today);
            if (existing) {
                existing.status = status;
                existing.keterangan = 'Diedit massal';
                try {
                    await callAPI('updateAbsensi', {
                        nis: s.nis,
                        tanggal: today,
                        status: status,
                        keterangan: 'Diedit massal'
                    });
                } catch (error) {
                    console.warn('Gagal update ke spreadsheet:', error);
                }
            } else {
                await simpanAbsensi(s, status, 'Presensi massal');
            }
        }
        showToast(`Semua siswa kelas ${kelas} set ${status} berhasil`, 'success');
        updateScanLog();
        updateStats();
    }
}

// ============================================================
// SCAN FROM IMAGE
// ============================================================
function scanFromImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(ev) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code && code.data) {
                    try {
                        const data = JSON.parse(code.data);
                        processQRData(data);
                    } catch (error) {
                        showToast('Format QR tidak valid', 'error');
                    }
                } else {
                    showToast('Tidak ada QR Code terdeteksi', 'error');
                }
            };
            img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };
    input.click();
}

// ============================================================
// GET LOCATION
// ============================================================
function getLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve('Geolokasi tidak didukung');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                resolve(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
            },
            () => {
                resolve('Gagal mendapatkan lokasi');
            }
        );
    });
}

// ============================================================
// EVENT LISTENER
// ============================================================
document.addEventListener('change', function(e) {
    if (e.target.id === 'manualKelas') {
        updateManualSiswa();
    }
});