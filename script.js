// === 1. LOGIKA ANIMASI INTERAKTIF 3D TILT CARDS ===
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Melacak pergerakan titik koordinat kursor di atas kartu
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Mencari titik tengah kartu sebagai titik tumpu (pivot)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Membatasi rotasi maksimal agar tidak terlalu ekstrem (maks 15 derajat)
        const rotateX = ((y - centerY) / centerY) * -15;
        const rotateY = ((x - centerX) / centerX) * 15;

        // Terapkan transformasi matriks 3D
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.05s ease'; // Dibuat super responsif mengikuti gerak mouse
    });

    // Reset posisi kartu saat kursor keluar agar kembali lurus secara smooth
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    });
});


// === 2. LOGIKA ANIMASI MODAL / LIGHTBOX JURNAL MEMORI ===
const modal = document.getElementById('customModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const mainModalImg = document.getElementById('mainModalImg');
const modalThumbGrid = document.getElementById('modalThumbGrid');
const btnClose = document.getElementById('btnCloseModal');

cards.forEach(card => {
    card.addEventListener('click', () => {
        // Ambil data-atribut bawaan dari kartu HTML yang diklik user
        const mainImgSrc = card.getAttribute('data-main-img');
        const titleText = card.getAttribute('data-title');
        const captionText = card.getAttribute('data-caption');
        const thumbnailsSrc = card.getAttribute('data-thumbnails');

        // Suntikkan data tersebut ke dalam komponen modal secara real-time
        mainModalImg.src = mainImgSrc;
        modalTitle.textContent = titleText;
        modalDesc.textContent = captionText;

        // Bersihkan riwayat data foto kecil dari modal sebelumnya
        modalThumbGrid.innerHTML = '';

        // Pecah teks string data-thumbnails menjadi deretan array terpisah menggunakan tanda koma
        if (thumbnailsSrc) {
            const thumbList = thumbnailsSrc.split(',');
            
            thumbList.forEach((srcUrl, index) => {
                if (srcUrl.trim() !== "") {
                    const thumbImg = document.createElement('img');
                    thumbImg.src = srcUrl.trim();
                    thumbImg.alt = `Sub Memory ${index + 1}`;
                    
                    // Efek Interaktif Tambahan: Klik foto kecil di kanan untuk membesarkannya di kiri
                    thumbImg.addEventListener('click', () => {
                        mainModalImg.src = srcUrl.trim();
                        
                        // Kelola garis tepi (border) indikator aktif
                        document.querySelectorAll('.thumbnail-grid img').forEach(img => {
                            img.classList.remove('active-thumb');
                        });
                        thumbImg.classList.add('active-thumb');
                    });

                    modalThumbGrid.appendChild(thumbImg);
                }
            });
        }

        // Munculkan modal lewat penambahan kelas CSS
        modal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Kunci scroll layar utama agar tidak mengganggu fokus
    });
});

// Fungsi untuk menutup modal
const closeModalWindow = () => {
    modal.classList.remove('open');
    document.body.style.overflow = ''; // Kembalikan fungsionalitas scroll layar utama
};

// Pasang pemicu penutupan modal lewat tombol X, klik luar area, atau tombol Escape keyboard
btnClose.addEventListener('click', closeModalWindow);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalWindow();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModalWindow();
    }
});