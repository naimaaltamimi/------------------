/**
 * AURA FITNESS & CLUB - INTERACTIVE JAVASCRIPT
 * منطق التفاعل لحجز النوادي والبطاقات والتبديل الزمني والإشعارات
 */

document.addEventListener('DOMContentLoaded', () => {
  // بيانات الأسعار الشهرية والسنوية للباقات الثلاث
  const PRICING_DATA = {
    monthly: {
      basic: { price: '299', period: '/ شهرياً', original: '' },
      pro: { price: '549', period: '/ شهرياً', original: '' },
      vip: { price: '999', period: '/ شهرياً', original: '' },
      label: 'اشتراك شهري'
    },
    yearly: {
      basic: { price: '239', period: '/ شهرياً (فاتورة سنوية)', original: '299 ر.س' },
      pro: { price: '439', period: '/ شهرياً (فاتورة سنوية)', original: '549 ر.س' },
      vip: { price: '799', period: '/ شهرياً (فاتورة سنوية)', original: '999 ر.س' },
      label: 'اشتراك سنوي (خصم 20%)'
    }
  };

  let currentBilling = 'monthly';
  let selectedPackage = {
    name: 'اشتراك المحترفين (Pro Athlete)',
    price: '549 ر.س',
    billingLabel: 'اشتراك شهري'
  };

  // عناصر واجهة المستخدم
  const btnMonthly = document.getElementById('btn-monthly');
  const btnYearly = document.getElementById('btn-yearly');
  
  const priceBasic = document.getElementById('price-basic');
  const periodBasic = document.getElementById('period-basic');
  const origBasic = document.getElementById('orig-basic');
  
  const pricePro = document.getElementById('price-pro');
  const periodPro = document.getElementById('period-pro');
  const origPro = document.getElementById('orig-pro');

  const priceVip = document.getElementById('price-vip');
  const periodVip = document.getElementById('period-vip');
  const origVip = document.getElementById('orig-vip');

  const modalOverlay = document.getElementById('booking-modal-overlay');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelModalBtn = document.getElementById('btn-cancel-modal');
  const bookingForm = document.getElementById('booking-form');
  const summaryPackageName = document.getElementById('summary-package-name');
  const summaryBillingCycle = document.getElementById('summary-billing-cycle');
  const summaryPriceDisplay = document.getElementById('summary-price-display');
  const startDateInput = document.getElementById('start-date');
  const toastContainer = document.getElementById('toast-container');

  // ضبط الحد الأدنى لتاريخ البدء ليكون اليوم
  if (startDateInput) {
    const today = new Date().toISOString().split('T')[0];
    startDateInput.min = today;
    startDateInput.value = today;
  }

  // ==========================================================================
  // وظيفة تحديث أسعار البطاقات الثلاث عند التبديل
  // ==========================================================================
  function updatePricing(billingMode) {
    currentBilling = billingMode;
    const data = PRICING_DATA[billingMode];

    // تبديل أزرار التبديل
    if (billingMode === 'monthly') {
      btnMonthly.classList.add('active');
      btnYearly.classList.remove('active');
      document.querySelectorAll('.product-card').forEach(card => card.classList.remove('show-discount'));
    } else {
      btnYearly.classList.add('active');
      btnMonthly.classList.remove('active');
      document.querySelectorAll('.product-card').forEach(card => card.classList.add('show-discount'));
    }

    // تأثير حركة لطيف وتغيير الأرقام
    animateValue(priceBasic, data.basic.price);
    periodBasic.textContent = data.basic.period;
    origBasic.textContent = data.basic.original;

    animateValue(pricePro, data.pro.price);
    periodPro.textContent = data.pro.period;
    origPro.textContent = data.pro.original;

    animateValue(priceVip, data.vip.price);
    periodVip.textContent = data.vip.period;
    origVip.textContent = data.vip.original;

    // تحديث بيانات أزرار الحجز
    document.getElementById('btn-book-basic').setAttribute('data-price', data.basic.price);
    document.getElementById('btn-book-pro').setAttribute('data-price', data.pro.price);
    document.getElementById('btn-book-vip').setAttribute('data-price', data.vip.price);
  }

  // حركة انتقال ناعمة للأرقام
  function animateValue(element, newValue) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      element.textContent = newValue;
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, 150);
  }

  if (btnMonthly && btnYearly) {
    btnMonthly.addEventListener('click', () => updatePricing('monthly'));
    btnYearly.addEventListener('click', () => updatePricing('yearly'));
  }

  // ==========================================================================
  // إدارة نافذة الحجز التفاعلية المنبثقة (Modal)
  // ==========================================================================
  function openBookingModal(pkgName, pkgPrice) {
    selectedPackage.name = pkgName;
    selectedPackage.price = `${pkgPrice} ر.س`;
    selectedPackage.billingLabel = PRICING_DATA[currentBilling].label;

    summaryPackageName.textContent = selectedPackage.name;
    summaryPriceDisplay.textContent = selectedPackage.price;
    summaryBillingCycle.textContent = `نظام الفوترة: ${selectedPackage.billingLabel}`;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // تركيز مؤشر الكتابة تلقائياً في حقل الاسم
    setTimeout(() => {
      const nameInput = document.getElementById('member-name');
      if (nameInput) nameInput.focus();
    }, 200);
  }

  function closeBookingModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ربط أزرار البطاقات لفتح نافذة الحجز
  document.querySelectorAll('.btn-card-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pkgName = btn.getAttribute('data-package') || 'اشتراك رياضي';
      const pkgPrice = btn.getAttribute('data-price') || '299';
      openBookingModal(pkgName, pkgPrice);
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeBookingModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeBookingModal);

  // إغلاق النافذة بالنقر خارجها أو بضغط زر Escape
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeBookingModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeBookingModal();
    }
  });

  // ==========================================================================
  // معالجة نموذج الحجز وإظهار رسائل النجاح (Toast)
  // ==========================================================================
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const memberName = document.getElementById('member-name').value.trim();
    const memberPhone = document.getElementById('member-phone').value.trim();
    const branch = document.getElementById('club-branch').value;
    const startDate = document.getElementById('start-date').value;

    const submitBtn = document.getElementById('btn-confirm-booking');
    const originalText = submitBtn.innerHTML;

    // زر التحميل التفاعلي
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>جارٍ تأكيد الاشتراك...</span>';

    setTimeout(() => {
      // رقم حجز عشوائي فريد
      const bookingCode = 'AURA-' + Math.floor(1000 + Math.random() * 9000);

      // إعادة تعيين الزر وإغلاق النافذة
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      closeBookingModal();
      bookingForm.reset();

      // إعادة ضبط التاريخ بعد التفريغ
      const today = new Date().toISOString().split('T')[0];
      startDateInput.value = today;

      // إظهار إشعار التأكيد الفاخر
      showToast(
        `مرحباً بك ${memberName}!`,
        `تم تأكيد حجزك في ${selectedPackage.name} بنجاح. رقم اشتراكك: (${bookingCode}) في فرع (${branch}). سيتم التواصل معك لتسليم بطاقتك.`
      );
    }, 800);
  });

  // ==========================================================================
  // نظام الإشعارات العصرية (Toast Notifications)
  // ==========================================================================
  function showToast(title, message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <div class="toast-content">
        <h5>${title}</h5>
        <p>${message}</p>
      </div>
    `;

    toastContainer.appendChild(toast);

    // إظهار التنبيه
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // إزالة التنبيه بعد 5 ثوانٍ
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 400);
    }, 5500);
  }

  // ==========================================================================
  // تأثير 3D خفيف عند تحريك الماوس فوق البطاقات (Tilt Effect)
  // ==========================================================================
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotateX = (-y / rect.height) * 8;
      const rotateY = (x / rect.width) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // تغيير مظهر شريط التنقل عند التمرير
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 12, 16, 0.95)';
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      navbar.style.background = 'rgba(10, 12, 16, 0.85)';
      navbar.style.boxShadow = 'none';
    }
  });
});
