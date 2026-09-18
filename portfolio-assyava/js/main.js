/* =========================================================
   main.js
   Interaksi halaman: menu mobile, tahun footer, dan
   pengiriman formulir kontak ke backend (PHP/Python).
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

const header = document.getElementById('header');
if (header) {
  const onScroll = () => header.classList.toggle('compact', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
// -----------------------------------------------------
  // Efek Perubahan Teks Logo Saat Layar Digulir (Scroll)
  // -----------------------------------------------------
  const logoText = document.getElementById('logoText');
  
  if (logoText) {
    window.addEventListener('scroll', () => {
      // Jika layar digulir ke bawah lebih dari 50 piksel
      if (window.scrollY > 50) {
        logoText.textContent = 'AS';
      } else {
        // Jika layar kembali ke posisi paling atas
        logoText.textContent = 'Assyava';
      }
    });
  }
  // -----------------------------------------------------
  // Tahun berjalan di footer
  // -----------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -----------------------------------------------------
  // Menu navigasi mobile
  // -----------------------------------------------------
  const menuBtn    = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const iconOpen   = document.getElementById('iconOpen');
  const iconClose  = document.getElementById('iconClose');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      iconOpen.classList.toggle('hidden');
      iconClose.classList.toggle('hidden');
      menuBtn.setAttribute('aria-expanded', String(!isOpen));
    });

    document.querySelectorAll('#mobileMenu a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -----------------------------------------------------
  // Formulir kontak
  // -----------------------------------------------------
  // GANTI nilai ENDPOINT di bawah sesuai backend yang Anda pakai:
  //   - Hosting biasa (cPanel/shared hosting yang mendukung PHP):
  //       ENDPOINT = 'php/kirim-pesan.php'
  //   - Server Python/Flask (lihat python/app.py):
  //       ENDPOINT = 'http://alamat-server-anda/kirim-pesan'
  //     (saat development lokal biasanya 'http://127.0.0.1:5000/kirim-pesan')
  const ENDPOINT = 'php/kirim-pesan.php';

  // Alamat email tujuan fallback (dipakai hanya jika backend gagal dihubungi)
  const FALLBACK_EMAIL = 'mochassyava@gmail.com';

  const form      = document.getElementById('contactForm');
  const formNote  = document.getElementById('formNote');
  const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nama   = document.getElementById('nama').value.trim();
      const email  = document.getElementById('email').value.trim();
      const subjek = document.getElementById('subjek').value.trim();
      const pesan  = document.getElementById('pesan').value.trim();

      if (!nama || !email || !subjek || !pesan) {
        setNote('Mohon lengkapi seluruh kolom terlebih dahulu.', 'error');
        return;
      }

      setLoading(true);
      setNote('Mengirim pesan...', '');

      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nama, email, subjek, pesan }),
        });

        const result = await safeParseJSON(response);

        if (response.ok && result && result.success) {
          setNote('Pesan berhasil terkirim. Terima kasih sudah menghubungi saya.', 'success');
          form.reset();
        } else {
          throw new Error((result && result.message) || 'Gagal mengirim pesan.');
        }
      } catch (err) {
        // Backend tidak tersedia (mis. dibuka sebagai file statis tanpa server) —
        // gunakan mailto sebagai jalur cadangan agar pesan tetap bisa terkirim.
        console.warn('Pengiriman via backend gagal, memakai mailto sebagai cadangan:', err);
        const body = `Nama: ${nama}\nEmail: ${email}\n\n${pesan}`;
        const mailto = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(subjek)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        setNote('Server tidak dapat dihubungi. Aplikasi email Anda dibuka sebagai jalur cadangan.', 'error');
      } finally {
        setLoading(false);
      }
    });
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.classList.toggle('btn-loading', isLoading);
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? 'Mengirim...' : 'Kirim Pesan';
  }

  function setNote(text, type) {
    if (!formNote) return;
    formNote.textContent = text;
    formNote.classList.remove('form-note-success', 'form-note-error');
    if (type === 'success') formNote.classList.add('form-note-success');
    if (type === 'error') formNote.classList.add('form-note-error');
  }

  async function safeParseJSON(response) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

});
