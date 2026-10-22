// Draw the 10-segment skill meters on the tech stack board.
// data-level holds how many segments (0–10) are filled.
document.querySelectorAll('.level').forEach(function (el) {
  var level = Number(el.dataset.level) || 0;
  for (var i = 0; i < 10; i++) {
    var seg = document.createElement('i');
    if (i < level) seg.className = 'on';
    seg.style.setProperty('--i', i);
    el.appendChild(seg);
  }
});

// Filter chips for the certificates & badges grid.
var chips = document.querySelectorAll('.chip');
chips.forEach(function (chip) {
  chip.addEventListener('click', function () {
    var filter = chip.dataset.filter;
    chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
    document.querySelectorAll('.badge').forEach(function (badge) {
      badge.hidden = filter !== 'all' && badge.dataset.cat !== filter;
    });
  });
});

// Copy buttons for contact details.
document.querySelectorAll('[data-copy]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var target = document.getElementById(btn.dataset.copy);
    var text = target.textContent.trim();

    function reset() { setTimeout(function () { btn.textContent = 'Copy'; }, 1600); }
    function selectText() {
      var range = document.createRange();
      range.selectNodeContents(target);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      btn.textContent = 'Selected';
      reset();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'Copied';
        reset();
      }, selectText);
    } else {
      selectText();
    }
  });
});

// Project screenshot galleries share one full-size viewer.
// Each gallery's thumbnails (data-src + data-caption) are the slides.
var lightbox = document.getElementById('lightbox');
var lbImg = lightbox.querySelector('img');
var lbCaption = lightbox.querySelector('figcaption');
var slides = [];
var current = 0;

function showSlide(i) {
  current = (i + slides.length) % slides.length;
  lbImg.src = slides[current].src;
  lbImg.alt = slides[current].caption;
  lbCaption.textContent = slides[current].title + ' · ' + slides[current].caption + '  (' + (current + 1) + ' / ' + slides.length + ')';
}

document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
  var thumbs = gallery.querySelectorAll('.shot-thumbs button');
  var items = Array.prototype.map.call(thumbs, function (t) {
    return { src: t.dataset.src, caption: t.dataset.caption, title: gallery.dataset.gallery };
  });

  function open(i) {
    slides = items;
    showSlide(i);
    lightbox.showModal();
  }

  gallery.querySelectorAll('[data-index]').forEach(function (el) {
    el.addEventListener('click', function () { open(Number(el.dataset.index)); });
  });
});

lightbox.querySelector('.lb-prev').addEventListener('click', function () { showSlide(current - 1); });
lightbox.querySelector('.lb-next').addEventListener('click', function () { showSlide(current + 1); });
lightbox.querySelector('.lb-close').addEventListener('click', function () { lightbox.close(); });
// Clicking the dark backdrop (outside the image) closes the viewer.
lightbox.addEventListener('click', function (e) { if (e.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') showSlide(current - 1);
  if (e.key === 'ArrowRight') showSlide(current + 1);
});

// CV menu: the button slides down two options, view on the page or download.
var cvToggle = document.querySelector('[data-cv-toggle]');
var cvOptions = document.getElementById('cv-options');

function setCvMenu(open) {
  cvOptions.classList.toggle('open', open);
  cvToggle.setAttribute('aria-expanded', String(open));
}

cvToggle.addEventListener('click', function () {
  setCvMenu(cvToggle.getAttribute('aria-expanded') !== 'true');
});
document.addEventListener('click', function (e) {
  if (!e.target.closest('.cv-menu')) setCvMenu(false);
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') setCvMenu(false);
});
cvOptions.querySelector('a').addEventListener('click', function () { setCvMenu(false); });

// Document viewer, shared by the CV and the certificates.
// Pages are shown as images (rendered from the PDFs); Download still gives the PDF.
var cvViewer = document.getElementById('cv-viewer');
var cvPages = cvViewer.querySelector('.cv-pages');
var cvTitle = cvViewer.querySelector('.cv-bar strong');
var cvDownload = cvViewer.querySelector('a[download]');

function openDoc(pages, title, pdf, filename) {
  cvTitle.textContent = title;
  cvViewer.setAttribute('aria-label', title);
  cvDownload.href = pdf;
  cvDownload.download = filename;
  cvPages.textContent = '';
  pages.forEach(function (src, i) {
    var img = document.createElement('img');
    img.src = src;
    img.alt = title + (pages.length > 1 ? ', page ' + (i + 1) : '');
    cvPages.appendChild(img);
  });
  cvPages.scrollTop = 0;
  cvViewer.showModal();
}

document.querySelectorAll('[data-cv-view]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    setCvMenu(false);
    openDoc(['images/resume/page-1.jpg'], 'Josiah Cedric Serrano · CV', 'resume.pdf', 'Josiah-Cedric-Serrano-CV.pdf');
  });
});

document.querySelectorAll('[data-cert]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var name = btn.dataset.cert;
    openDoc(['images/certificates/' + name + '.jpg'], btn.dataset.certTitle, 'certificates/' + name + '.pdf', 'Josiah-Serrano-' + name + '.pdf');
  });
});
cvViewer.querySelector('.cv-close').addEventListener('click', function () { cvViewer.close(); });
cvViewer.addEventListener('click', function (e) { if (e.target === cvViewer) cvViewer.close(); });

// Keep the footer year current.
document.getElementById('year').textContent = new Date().getFullYear();
