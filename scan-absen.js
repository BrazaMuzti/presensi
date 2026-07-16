// Scan Absensi Module
let scanStream = null;
let scanActive = false;

async function startScan() {
    if (scanActive) return;
    
    try {
        const video = document.getElementById('video');
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        video.srcObject = stream;
        scanStream = stream;
        scanActive = true;
        
        // Get GPS location
        const location = await getLocation();
        document.getElementById('gpsLocation').textContent = location;
        
        // Start QR Code scanning
        scanQRCode();
        
        showToast('Scan aktif, arahkan ke QR Code', 'success');
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
        console.error(error);
    }
}

function stopScan() {
    if (scanStream) {
        scanStream.getTracks().forEach(track => track.stop());
        scanStream = null;
    }
    scanActive = false;
    document.getElementById('video').srcObject = null;
    showToast('Scan dihentikan', 'warning');
}

function scanQRCode() {
    // Menggunakan library jsQR untuk scan QR
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
                // QR Code detected
                const data = JSON.parse(code.data);
                processQRData(data);
                stopScan();
                return;
            }
        }
        
        requestAnimationFrame(scan);
    }
    
    scan();
}

function processQRData(data) {
    // Proses data dari QR Code
    const resultContainer = document.getElementById('scanResult');
    const nis = data.nis || data.username;
    const name = data.nama || data.name || 'Unknown';
    
    // Cek apakah siswa terdaftar
    const siswa = allSiswa.find(s => s.nis === nis || s.nama === name);
    
    if (siswa) {
        resultContainer.innerHTML = `
            <div style="background:#28a745;color:white;padding:15px;border-radius:8px;">
                <i class="fas fa-check-circle"></i>
                <strong>${siswa.nama}</strong> (NIS: ${siswa.nis})
                <br>Status: <strong>Hadir</strong>
                <br>Waktu: ${new Date().toLocaleTimeString('id-ID')}
            </div>
        `;
        
        // Simpan absensi
        simpanAbsensi(siswa, 'Hadir');
        updateStats();
    } else {
        resultContainer.innerHTML = `
            <div style="background:#dc3545;color:white;padding:15px;border-radius:8px;">
                <i class="fas fa-times-circle"></i>
                Siswa tidak terdaftar!
            </div>
        `;
    }
}

function simpanAbsensi(siswa, status) {
    const absen = {
        nis: siswa.nis,
        nama: siswa.nama,
        kelas: siswa.kelas,
        tanggal: new Date().toISOString().split('T')[0],
        waktu: new Date().toLocaleTimeString('id-ID'),
        status: status,
        keterangan: 'Presensi via QR Code'
    };
    
    // Simpan ke state
    if (!allAbsensi) allAbsensi = [];
    allAbsensi.push(absen);
    
    // Update UI
    updateStats();
    showToast(`Absensi ${status} untuk ${siswa.nama} berhasil`, 'success');
}

function selesaiSemua() {
    const selected = document.querySelector('input[name="status"]:checked');
    if (!selected) {
        showToast('Pilih status terlebih dahulu', 'error');
        return;
    }
    
    const status = selected.value;
    const count = document.querySelectorAll('#siswaTableBody tr').length;
    
    if (count === 0) {
        showToast('Tidak ada siswa', 'warning');
        return;
    }
    
    if (confirm(`Set semua siswa dengan status ${status}?`)) {
        const rows = document.querySelectorAll('#siswaTableBody tr');
        rows.forEach(row => {
            const td = row.querySelectorAll('td');
            if (td.length > 0) {
                const nama = td[2]?.textContent || '';
                const nis = td[1]?.textContent || '';
                const kelas = td[3]?.textContent || '';
                
                if (nama && nis) {
                    allAbsensi.push({
                        nis,
                        nama,
                        kelas,
                        tanggal: new Date().toISOString().split('T')[0],
                        waktu: new Date().toLocaleTimeString('id-ID'),
                        status: status,
                        keterangan: 'Presensi massal'
                    });
                }
            }
        });
        
        updateStats();
        showToast(`Semua siswa set ${status} berhasil`, 'success');
    }
}

// QR Code library loader
(function loadQRCodeLib() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jsqr/1.4.0/jsQR.min.js';
    document.head.appendChild(script);
})();

// Tambahkan fungsi scan dari QR
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
