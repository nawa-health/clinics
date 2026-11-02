function nawaBoot(PRE) {
  'use strict';
  var CATALOG = window.NAWA_CATALOG || [];
  var STORE_BASE = 'nawa_clinics_v1';
  var WA = '966535923936';
  var MAIL = 'contact@nawa.com.sa';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function toLatin(s) {
    return String(s == null ? '' : s)
      .replace(/[٠-٩]/g, function (d) { return d.charCodeAt(0) - 0x660; })
      .replace(/[۰-۹]/g, function (d) { return d.charCodeAt(0) - 0x6F0; });
  }
  function norm(s) {
    return toLatin(s).toLowerCase()
      .replace(/[ً-ٰٟـ]/g, '')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه').replace(/ى/g, 'ي');
  }

  /* ---------- clinic config (hash c= with base64 of JSON) ---------- */
  function b64uEncode(str) {
    var bytes = new TextEncoder().encode(str), bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64uDecode(s) {
    s = s.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
    var bin = atob(s), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function clip(v, n) { return typeof v === 'string' ? v.trim().slice(0, n) : ''; }
  function normalizeConfig(o, raw, code) {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return null;
    var n = clip(o.n, 120);
    if (!n) return null;
    var keys = Array.isArray(o.k) ? o.k.filter(function (k, i, arr) {
      return typeof k === 'string' && arr.indexOf(k) === i && CATALOG.some(function (c) { return c.key === k; });
    }) : [];
    var s = {};
    if (o.s && typeof o.s === 'object' && !Array.isArray(o.s)) {
      Object.keys(o.s).forEach(function (c) {
        var q = parseInt(o.s[c], 10);
        s[String(c).toUpperCase()] = isNaN(q) || q < 0 ? 1 : Math.min(q, 99999999);
      });
    }
    var r = typeof o.r === 'string' ? o.r.replace(/[^A-Za-z0-9-]/g, '').slice(0, 32) : '';
    if (code) r = code.toUpperCase();
    return {
      n: n, ci: clip(o.ci, 80), d: clip(o.d, 80), k: keys, s: s,
      l: o.l === 'ar' || o.l === 'en' ? o.l : '',
      r: r,
      lg: lgOk(o.lg) ? o.lg : '',
      raw: raw || '', code: code || ''
    };
  }
  function parseConfig() {
    try {
      var m = /[#&]c=([A-Za-z0-9_=-]+)/.exec(location.hash);
      if (!m) return null;
      return normalizeConfig(JSON.parse(b64uDecode(m[1])), m[1], '');
    } catch (e) { return null; }
  }
  function lgOk(v) {
    if (typeof v !== 'string') return false;
    if (/^data:image\/(png|webp|svg\+xml);base64,[A-Za-z0-9+\/=]+$/.test(v)) return v.length <= 400000;
    if (v.length > 600) return false;
    return /^https?:\/\//i.test(v) || /^assets\/partners\/[A-Za-z0-9._-]+\.(png|webp|svg)$/.test(v);
  }
  var CFG = PRE ? normalizeConfig(PRE.o, '', PRE.code) : parseConfig();
  var SFX = CFG ? ':' + (CFG.r || 'n:' + CFG.n.toLowerCase()) : '';
  var STORE = STORE_BASE + SFX;
  var LANG_KEY2 = STORE + ':lang';
  if (CFG) document.documentElement.classList.add('has-cfg');

  /* ---------- i18n ---------- */
  var LANG_KEY = 'nawa_lang';
  var I18N = {
    en: {
      title: 'NAWA — Clinic Catalogue',
      meta_desc: 'NAWA clinic catalogue: genetic testing, general laboratory tests and IVF consumables. Choose what fits your clinic and request a tailored quotation.',
      brand: 'NAWA', menu: 'Menu', nav_label: 'Main navigation',
      nav_catalog: 'Catalogue', nav_how: 'How it works', nav_services: 'Services for clinics', nav_quote: 'Request a quotation',
      cart: 'Quotation list', lang_btn: 'العربية', lang_btn_lang: 'ar', lang_aria: 'التبديل إلى العربية',
      eyebrow: 'CLINIC PARTNERSHIPS', hero_h1: 'One laboratory partner for your clinic',
      hero_lead: 'NAWA supplies your clinic with genetic testing, general laboratory tests and IVF consumables. Choose what fits your practice and we will send you a tailored quotation.',
      hero_browse: 'Browse the catalogue', hero_quote: 'Request a quotation',
      figs_aria: 'Catalogue figures', fig_items: 'items in the catalogue', fig_catalogs: 'catalogues', fig_cats: 'categories',
      svc_title: 'Services for clinics', svc_sub: 'Five services that support your clinic, from pricing to clinical support.',
      svc1_t: 'Test pricing', svc1_d: 'A clear quotation tailored to your clinic, based on the tests you select.',
      svc2_t: 'Sample collection', svc2_d: "Collection arrangements that fit your clinic's workflow.",
      svc3_t: 'Sample logistics', svc3_d: 'Coordinated transport of samples to the laboratory.',
      svc4_t: 'Staff orientation', svc4_d: 'Guidance for your team on ordering and sample handling.',
      svc5_t: 'Clinical support', svc5_d: 'A team available to answer your questions about the tests.',
      how_title: 'How it works',
      step1_t: 'Select', step1_p: 'Select tests or products from the catalogue.',
      step2_t: 'Estimate', step2_p: 'Enter the expected monthly volume for each item.',
      step3_t: 'Send', step3_p: 'Send the request and receive a tailored quotation for your clinic.',
      cat_title: 'Catalogue', tabs_aria: 'Catalogues', search_label: 'Search the catalogue',
      search_ph: 'Search by code, test name or category', search_all: 'Search all catalogues', cats_aria: 'Categories',
      all: 'All', add: 'Add', added: 'Added', add_cat: 'Add whole category', rm_cat: 'Remove whole category',
      n_items: function (n) { return n + (n === 1 ? ' item' : ' items'); },
      res_q: function (n) { return n + (n === 1 ? ' result' : ' results'); },
      res_all: function (n) { return n + (n === 1 ? ' item shown' : ' items shown'); },
      empty: function (all) { return 'No matching results. Try another keyword' + (all ? '.' : ', or enable search across all catalogues.'); },
      quote_title: 'Request a quotation',
      quote_sub: 'Tell us which tests your clinic would like to offer. Select catalogue items, estimate your monthly volumes and send the request to NAWA for a tailored quotation.',
      sel_head: 'Products for quotation', copy_link: 'Copy list link', clear_all: 'Clear list',
      clear_confirm: 'Remove all items from the list?',
      sel_empty: 'You have not selected any items yet. ', sel_back: 'Back to the catalogue',
      qty_unit: function (u) { return 'Quantity: ' + u; },
      th_code: 'Catalogue ID', th_name: 'Test / product', th_qty: function (u) { return cap(u); }, th_rm: 'Remove',
      qty_aria: function (k) { return 'Quantity ' + k; }, rm_aria: function (k) { return 'Remove ' + k; },
      form_head: 'Clinic and contact details',
      f_clinic: 'Clinic / organisation name', f_city: 'City', f_dept: 'Department / specialty', f_contact: 'Contact person',
      f_title: 'Job title', f_email: 'Business email', f_phone: 'Phone / WhatsApp', f_start: 'Preferred start date / timeframe',
      f_total: 'Estimated total tests per month',
      req_head: 'Partnership requirements',
      req_pricing: 'Test pricing', req_collection: 'Sample collection', req_logistics: 'Sample logistics',
      req_orientation: 'Staff orientation', req_support: 'Clinical support', req_other: 'Other',
      f_notes: 'Additional requirements / preferred reporting or logistics arrangements',
      send_wa: 'Send via WhatsApp', send_mail: 'Send by email', print: 'Save PDF / Print',
      mail_note: 'The list is long, so the email contains a shortened version. Save the list as a PDF and attach it to your message.',
      e_clinic: 'Please enter the clinic or organisation name.', e_contact: "Please enter the contact person's name.",
      e_phone: 'Please enter a valid phone number so we can reach you.', e_email: 'The email address looks incomplete.',
      e_items: 'Select at least one item from the catalogue before sending.',
      m_empty: 'Add at least one item to copy the link.', m_ok: 'Link copied.',
      m_fail: 'Could not copy automatically. Copy the link from the address bar.',
      foot_l1: 'NAWA | Nawat Al Takwin LLC', foot_l2: 'Saudi limited liability company',
      foot_l3: 'CR National No. <span class="num-t">7053936733</span> | VAT No. <span class="num-t">314703130800003</span>',
      foot_phone: 'Phone / WhatsApp', foot_wa: 'WhatsApp', foot_email: 'Email', foot_site: 'Website', foot_addr_l: 'Address',
      foot_addr: 'Al Arid, Riyadh 13338, Saudi Arabia',
      sep: ', ',
      msg_title: 'Quotation request — NAWA', msg_date: 'Date: ', msg_clinic_head: 'Clinic and contact details',
      msg_org: 'Organisation', msg_city: 'City', msg_dept: 'Department / specialty', msg_contact: 'Contact person', msg_jt: 'Job title',
      msg_email: 'Email', msg_phone: 'Phone', msg_start: 'Preferred start date / timeframe', msg_total: 'Estimated total tests per month',
      msg_reqs: 'Partnership requirements: ', msg_notes: 'Additional requirements: ',
      msg_items: 'Requested items (code — name — monthly quantity): ', msg_of: function (a, b) { return a + ' of ' + b; },
      msg_short: 'The list has been shortened here. The full list is in the attached PDF.',
      mail_subj: 'Quotation request — ', mail_clinic: 'Clinic',
      pr_title: 'Quotation request form', pr_items: 'Requested products', pr_notes: 'Additional requirements',
      pr_unit: function (u) { return 'Quantity: ' + u; },
      pr_f1: 'NAWA | Nawat Al Takwin LLC · Saudi limited liability company · 0535923936 · contact@nawa.com.sa · nawa.com.sa',
      pr_f2: 'CR National No. 7053936733 · VAT No. 314703130800003 · Al Arid, Riyadh 13338, Saudi Arabia',
      eyebrow_for: function (n) { return 'PREPARED FOR ' + n; },
      intro_label: 'Welcome to your NAWA clinic catalogue', intro_welcome: 'Welcome, our future partner', intro_ready: 'The NAWA catalogue, prepared for you — we look forward to a mutually beneficial partnership', intro_enter: 'Next',
      f_locked: 'Set for your clinic', msg_ref: function (r) { return 'Reference: ' + r; },
      desc: 'desc_en', unit: 'unit_en'
    },
    ar: {
      title: 'نواة — كتالوج العيادات',
      meta_desc: 'كتالوج نواة للعيادات: الفحوص الجينية، فحوص المختبر العام، ومستلزمات أطفال الأنابيب. اختر ما يناسب عيادتك واطلب عرض سعر مخصّصًا.',
      brand: 'نواة', menu: 'القائمة', nav_label: 'التنقل الرئيسي',
      nav_catalog: 'الكتالوج', nav_how: 'كيف نعمل', nav_services: 'خدماتنا للعيادات', nav_quote: 'طلب عرض سعر',
      cart: 'قائمة الطلب', lang_btn: 'English', lang_btn_lang: 'en', lang_aria: 'Switch to English',
      eyebrow: 'شراكات العيادات', hero_h1: 'شريك مختبري واحد لعيادتك',
      hero_lead: 'نواة توفّر لعيادتك الفحوص الجينية، وفحوص المختبر العام، ومستلزمات أطفال الأنابيب — اختر ما يناسبك ونرسل لك عرض سعر مخصّص.',
      hero_browse: 'تصفّح الكتالوج', hero_quote: 'اطلب عرض سعر',
      figs_aria: 'أرقام الكتالوج', fig_items: 'بند في الكتالوج', fig_catalogs: 'كتالوجات', fig_cats: 'تصنيفًا',
      svc_title: 'خدماتنا للعيادات', svc_sub: 'خمس خدمات تدعم عيادتك من التسعير حتى المتابعة السريرية.',
      svc1_t: 'تسعير الفحوص', svc1_d: 'عرض سعر واضح ومخصّص لعيادتك بحسب الفحوص التي تختارها.',
      svc2_t: 'سحب العينات', svc2_d: 'ترتيب سحب العينات بما يناسب سير العمل في عيادتك.',
      svc3_t: 'نقل العينات', svc3_d: 'تنسيق نقل العينات إلى المختبر بعناية ومتابعة مستمرة.',
      svc4_t: 'تدريب الكادر', svc4_d: 'تعريف فريق العيادة بآلية الطلب والتعامل مع العينات.',
      svc5_t: 'الدعم السريري', svc5_d: 'فريق جاهز للإجابة عن استفساراتكم حول الفحوص.',
      how_title: 'كيف نعمل',
      step1_t: 'اختر', step1_p: 'اختر الفحوص أو المستلزمات من الكتالوج.',
      step2_t: 'حدّد', step2_p: 'حدّد الكمية الشهرية المتوقعة لكل بند.',
      step3_t: 'أرسل', step3_p: 'أرسل الطلب، ويصلك عرض سعر مخصّص لعيادتك.',
      cat_title: 'الكتالوج', tabs_aria: 'الكتالوجات', search_label: 'ابحث في الكتالوج',
      search_ph: 'ابحث بالرمز أو اسم الفحص أو التصنيف', search_all: 'البحث في كل الكتالوجات', cats_aria: 'التصنيفات',
      all: 'الكل', add: 'إضافة', added: 'مُضاف', add_cat: 'إضافة كل التصنيف', rm_cat: 'إزالة كل التصنيف',
      n_items: function (n) { return n + ' بند'; },
      res_q: function (n) { return 'عدد النتائج: ' + n; },
      res_all: function (n) { return 'عدد البنود المعروضة: ' + n; },
      empty: function (all) { return 'لا توجد نتائج مطابقة. جرّب كلمة أخرى' + (all ? '.' : '، أو فعّل البحث في كل الكتالوجات.'); },
      quote_title: 'طلب عرض سعر',
      quote_sub: 'راجع القائمة، حدّد الكميات، وأكمل بيانات العيادة.',
      sel_head: 'البنود المختارة', copy_link: 'نسخ رابط القائمة', clear_all: 'مسح القائمة',
      clear_confirm: 'هل تريد مسح كل البنود من القائمة؟',
      sel_empty: 'لم تختر أي بند بعد. ', sel_back: 'العودة إلى الكتالوج',
      qty_unit: function (u) { return 'الكمية: ' + u; },
      th_code: 'الرمز', th_name: 'الاسم', th_qty: function () { return 'الكمية الشهرية'; }, th_rm: 'إزالة',
      qty_aria: function (k) { return 'الكمية ' + k; }, rm_aria: function (k) { return 'إزالة ' + k; },
      form_head: 'بيانات العيادة',
      f_clinic: 'اسم العيادة / الجهة', f_city: 'المدينة', f_dept: 'القسم / التخصص', f_contact: 'اسم المسؤول',
      f_title: 'المسمى الوظيفي', f_email: 'البريد الإلكتروني', f_phone: 'الجوال / واتساب', f_start: 'تاريخ البدء المتوقع',
      f_total: 'إجمالي الفحوص الشهرية المتوقع',
      req_head: 'متطلبات الشراكة',
      req_pricing: 'تسعير الفحوص', req_collection: 'سحب العينات', req_logistics: 'نقل العينات',
      req_orientation: 'تدريب الكادر', req_support: 'الدعم السريري', req_other: 'أخرى',
      f_notes: 'ملاحظات إضافية',
      send_wa: 'إرسال عبر واتساب', send_mail: 'إرسال بالبريد', print: 'حفظ PDF / طباعة',
      mail_note: 'القائمة طويلة، فاختصرنا البنود في رسالة البريد. احفظ القائمة كملف PDF وأرفقها بالرسالة.',
      e_clinic: 'نحتاج اسم العيادة أو الجهة.', e_contact: 'نحتاج اسم المسؤول عن الطلب.',
      e_phone: 'نحتاج رقم جوال صحيحًا للتواصل.', e_email: 'يبدو أن البريد الإلكتروني غير مكتمل.',
      e_items: 'اختر بندًا واحدًا على الأقل من الكتالوج قبل الإرسال.',
      m_empty: 'أضف بندًا واحدًا على الأقل لنسخ الرابط.', m_ok: 'تم نسخ الرابط.',
      m_fail: 'تعذّر النسخ تلقائيًا. انسخ الرابط من شريط العنوان.',
      foot_l1: 'نواة التكوين — شركة ذات مسؤولية محدودة', foot_l2: '',
      foot_l3: 'السجل التجاري <span class="num-t">7053936733</span> · الرقم الضريبي <span class="num-t">314703130800003</span>',
      foot_phone: 'جوال / واتساب', foot_wa: 'واتساب', foot_email: 'البريد الإلكتروني', foot_site: 'الموقع', foot_addr_l: 'العنوان',
      foot_addr: 'العارض، الرياض 13338، المملكة العربية السعودية',
      sep: '، ',
      msg_title: 'طلب عرض سعر — نواة', msg_date: 'التاريخ: ', msg_clinic_head: 'بيانات العيادة',
      msg_org: 'الجهة', msg_city: 'المدينة', msg_dept: 'القسم / التخصص', msg_contact: 'المسؤول', msg_jt: 'المسمى الوظيفي',
      msg_email: 'البريد الإلكتروني', msg_phone: 'الجوال', msg_start: 'تاريخ البدء المتوقع', msg_total: 'إجمالي الفحوص الشهرية المتوقع',
      msg_reqs: 'متطلبات الشراكة: ', msg_notes: 'ملاحظات: ',
      msg_items: 'البنود المطلوبة (الرمز — الاسم — الكمية الشهرية): ', msg_of: function (a, b) { return a + ' من ' + b; },
      msg_short: 'تم اختصار القائمة هنا. القائمة الكاملة في ملف PDF المرفق.',
      mail_subj: 'طلب عرض سعر — ', mail_clinic: 'عيادة',
      pr_title: 'نموذج طلب عرض سعر', pr_items: 'البنود المطلوبة', pr_notes: 'ملاحظات إضافية',
      pr_unit: function (u) { return 'الكمية: ' + u; },
      pr_f1: 'نواة التكوين — شركة ذات مسؤولية محدودة · 0535923936 · contact@nawa.com.sa · nawa.com.sa',
      pr_f2: 'السجل التجاري 7053936733 · الرقم الضريبي 314703130800003 · العارض، الرياض 13338، المملكة العربية السعودية',
      eyebrow_for: function (n) { return 'مُعدّ خصيصًا لـ ' + n; },
      intro_label: 'أهلًا بكم في كتالوج نواة المُعدّ لعيادتكم', intro_welcome: 'أهلًا بشريكنا المستقبلي', intro_ready: 'كتالوج نواة المُعدّ لكم، ونتطلّع لشراكة نتبادل فيها المنفعة', intro_enter: 'التالي',
      f_locked: 'محدّد لعيادتكم', msg_ref: function (r) { return 'المرجع: ' + r; },
      desc: 'desc', unit: 'unit'
    }
  };
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function getLang() {
    var m = /[?&]lang=(ar|en)\b/.exec(location.search);
    if (m) return m[1];
    if (CFG) {
      try { var cl = localStorage.getItem(LANG_KEY2); if (cl === 'ar' || cl === 'en') return cl; } catch (e) { }
      if (CFG.l) return CFG.l;
    }
    try { var l = localStorage.getItem(LANG_KEY); if (l === 'ar' || l === 'en') return l; } catch (e) { }
    return 'en';
  }
  var lang = getLang();
  function T(k) { var v = I18N[lang][k]; if (typeof v === 'function') return v.apply(null, Array.prototype.slice.call(arguments, 1)); return v; }
  function cName(c) { return lang === 'en' ? c.en : c.ar; }
  function cDesc(c) { return lang === 'en' ? (c.desc_en || c.desc) : c.desc; }
  function cUnit(c) { return lang === 'en' ? (c.unit_en || c.unit) : c.unit; }
  var REQ_KEYS = ['pricing', 'collection', 'logistics', 'orientation', 'support', 'other'];
  var REQ_LEGACY = { 'تسعير الفحوص': 'pricing', 'سحب العينات': 'collection', 'نقل العينات': 'logistics', 'تدريب الكادر': 'orientation', 'الدعم السريري': 'support', 'أخرى': 'other' };
  var errKeys = {};      // field id -> message key
  var copyKey = '';
  var ICON_CHECK = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
  var ICON_X = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12"/></svg>';

  /* ---------- index ---------- */
  var ITEMS = {};   // code -> {code,name,cat,catalog}
  var catalogs = CATALOG.filter(function (c) { return !CFG || !CFG.k.length || CFG.k.indexOf(c.key) > -1; }).map(function (c) {
    c.cats.forEach(function (cat) {
      cat._n = norm(cat.ar + ' ' + cat.en);
      cat.items.forEach(function (it) {
        ITEMS[it[0]] = { code: it[0], name: it[1], cat: cat, catalog: c, _n: norm(it[0] + ' ' + it[1]) };
      });
    });
    c.count = c.cats.reduce(function (n, k) { return n + k.items.length; }, 0);
    return c;
  });

  /* ---------- state ---------- */
  var sel = {};          // code -> qty
  var seeded = false;    // preselected items from the link already merged on this device
  var active = catalogs.length ? catalogs[0].key : '';
  var activeCat = 'all';
  var query = '';
  var searchAll = false;

  function save() {
    try {
      var f = {};
      $$('[data-f]').forEach(function (el) { f[el.getAttribute('data-f')] = el.value; });
      f.req = $$('input[name=req]:checked').map(function (e) { return e.value; });
      localStorage.setItem(STORE, JSON.stringify({ sel: sel, form: f, seeded: seeded }));
    } catch (e) { /* storage unavailable */ }
  }
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (!d) return;
      seeded = !!d.seeded;
      if (d.sel) Object.keys(d.sel).forEach(function (k) { if (ITEMS[k]) sel[k] = d.sel[k]; });
      if (d.form) {
        $$('[data-f]').forEach(function (el) { var v = d.form[el.getAttribute('data-f')]; if (v != null) el.value = v; });
        $$('input[name=req]').forEach(function (el) { el.checked = (d.form.req || []).map(function (v) { return REQ_LEGACY[v] || v; }).indexOf(el.value) > -1; });
      }
    } catch (e) { /* ignore */ }
  }

  /* ---------- clinic config: apply ---------- */
  function applyConfig() {
    if (!CFG) return;
    var fc = $('#f_clinic');
    fc.value = CFG.n; fc.readOnly = true; fc.classList.add('locked');
    var ci = $('#f_city'), de = $('#f_dept');
    if (CFG.ci && !ci.value) ci.value = CFG.ci;
    if (CFG.d && !de.value) de.value = CFG.d;
    if (!seeded) {
      Object.keys(CFG.s).forEach(function (k) { if (ITEMS[k] && sel[k] == null) sel[k] = CFG.s[k]; });
      seeded = true;
    }
    $('#lockNote').hidden = false;
    $('#tabs').hidden = catalogs.length < 2;
    if (catalogs.length < 2) { var ac = $('#allCats'); if (ac) ac.closest('label').style.display = 'none'; }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1), t = id && document.getElementById(id);
      if (!t) return;
      e.preventDefault(); t.scrollIntoView();
    });
  }
  function applyChip() {
    if (!CFG) return;
    var n = esc(CFG.n);
    var ey = $('.eyebrow');
    ey.innerHTML = lang === 'ar' ? 'مُعدّ خصيصًا لـ <bdi>' + n + '</bdi>' : 'PREPARED FOR <bdi>' + n + '</bdi>';
    ey.classList.add('for');
  }

  /* ---------- hero figures (from data) ---------- */
  function renderFigures() {
    var total = 0, cats = 0;
    catalogs.forEach(function (c) { total += c.count; cats += c.cats.length; });
    var data = [[total, T('fig_items')], [catalogs.length, T('fig_catalogs')], [cats, T('fig_cats')]];
    $('#figures').innerHTML = data.map(function (d) {
      return '<div class="figure"><b>' + d[0] + '</b><span>' + d[1] + '</span></div>';
    }).join('');
  }

  /* ---------- tabs ---------- */
  function renderTabs() {
    $('#tabs').innerHTML = catalogs.map(function (c) {
      return '<button type="button" class="tab" role="tab" data-key="' + c.key + '" aria-selected="' + (c.key === active) + '">' +
        '<h3>' + esc(cName(c)) + '</h3>' + (lang === 'ar' ? '<p class="en">' + esc(c.en) + '</p>' : '') + '<p class="d">' + esc(cDesc(c)) + '</p>' +
        '<span class="n">' + T('n_items', c.count) + '</span></button>';
    }).join('');
  }
  $('#tabs').addEventListener('click', function (e) {
    var b = e.target.closest('.tab'); if (!b) return;
    active = b.getAttribute('data-key'); activeCat = 'all';
    renderTabs(); renderCatalog();
  });

  /* ---------- catalog ---------- */
  function matches(it, q) { return !q || it._n.indexOf(q) > -1 || it.cat._n.indexOf(q) > -1; }
  function currentCatalogs() {
    if (searchAll && query) return catalogs;
    return catalogs.filter(function (c) { return c.key === active; });
  }

  function renderCatalog() {
    var q = norm(query).trim();
    var multi = searchAll && !!q;
    var cs = currentCatalogs();
    var chipsHtml = '', listHtml = '', total = 0;

    if (!multi && cs[0]) {
      var all = 0;
      cs[0].cats.forEach(function (cat) {
        var n = cat.items.filter(function (it) { return matches(ITEMS[it[0]], q); }).length;
        all += n;
        chipsHtml += '<button type="button" class="chip' + (n ? '' : ' zero') + '" data-cat="' + cat.id + '" aria-pressed="' + (activeCat === cat.id) + '"><span>' + esc(cName(cat)) + '</span><span class="c">' + n + '</span></button>';
      });
      chipsHtml = '<button type="button" class="chip" data-cat="all" aria-pressed="' + (activeCat === 'all') + '"><span>' + T('all') + '</span><span class="c">' + all + '</span></button>' + chipsHtml;
    }
    $('#cats').hidden = multi;

    cs.forEach(function (c) {
      var blocks = '';
      c.cats.forEach(function (cat) {
        if (!multi && activeCat !== 'all' && activeCat !== cat.id) return;
        var its = cat.items.filter(function (it) { return matches(ITEMS[it[0]], q); });
        if (!its.length) return;
        total += its.length;
        var codes = its.map(function (i) { return i[0]; }).join(',');
        blocks += '<section class="cat-block"><div class="cat-head"><h3>' + esc(cName(cat)) + '</h3>' + (lang === 'ar' ? '<span class="en">' + esc(cat.en) + '</span>' : '') + '<span class="cnt">' + T('n_items', its.length) + '</span>' +
          '<button type="button" class="addall" data-codes="' + codes + '">' + T('add_cat') + '</button></div>' +
          its.map(function (it) {
            var on = sel[it[0]] != null;
            return '<div class="row' + (on ? ' sel' : '') + '" data-code="' + it[0] + '"><span class="code">' + esc(it[0]) + '</span>' +
              '<span class="name" dir="ltr">' + esc(it[1]) + '</span>' +
              '<button type="button" class="tog" aria-pressed="' + on + '">' + ICON_CHECK + '<span>' + (on ? T('added') : T('add')) + '</span></button></div>';
          }).join('') + '</section>';
      });
      if (blocks) listHtml += (multi ? '<h3 class="group-title">' + esc(cName(c)) + '</h3>' : '') + blocks;
    });

    $('#cats').innerHTML = chipsHtml;
    $('#list').innerHTML = listHtml || '<div class="empty">' + T('empty', searchAll) + '</div>';
    $('#resultCount').textContent = q ? T('res_q', total) : T('res_all', total);
    refreshAddAll();
  }

  function refreshAddAll() {
    $$('.addall').forEach(function (b) {
      var codes = b.getAttribute('data-codes').split(',');
      var all = codes.every(function (c) { return sel[c] != null; });
      b.textContent = all ? T('rm_cat') : T('add_cat');
    });
  }
  function refreshRow(row) {
    var on = sel[row.getAttribute('data-code')] != null;
    row.classList.toggle('sel', on);
    var b = row.querySelector('.tog');
    b.setAttribute('aria-pressed', on);
    b.lastChild.textContent = on ? T('added') : T('add');
  }
  function refreshRows() { $$('.row').forEach(refreshRow); refreshAddAll(); }

  $('#list').addEventListener('click', function (e) {
    var add = e.target.closest('.addall');
    if (add) {
      var codes = add.getAttribute('data-codes').split(',');
      var all = codes.every(function (c) { return sel[c] != null; });
      codes.forEach(function (c) { if (all) delete sel[c]; else if (sel[c] == null) sel[c] = 1; });
      refreshRows(); onSelChange(); return;
    }
    var row = e.target.closest('.row'); if (!row) return;
    var code = row.getAttribute('data-code');
    if (sel[code] != null) delete sel[code]; else sel[code] = 1;
    refreshRow(row); refreshAddAll(); onSelChange();
  });
  $('#cats').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    activeCat = b.getAttribute('data-cat');
    renderCatalog();
  });

  var timer;
  $('#q').addEventListener('input', function (e) {
    clearTimeout(timer);
    var v = e.target.value;
    timer = setTimeout(function () { query = v; renderCatalog(); }, 120);
  });
  $('#allCats').addEventListener('change', function (e) { searchAll = e.target.checked; renderCatalog(); });

  /* ---------- selection / quote ---------- */
  function selCodes() { return Object.keys(sel).filter(function (c) { return ITEMS[c]; }); }

  function renderSelected() {
    var codes = selCodes();
    $('#cartBadge').textContent = codes.length;
    $('#selCount').textContent = codes.length;
    var host = $('#selected');
    if (!codes.length) {
      host.innerHTML = '<div class="empty">' + esc(T('sel_empty')) + '<a href="#catalog">' + esc(T('sel_back')) + '</a></div>';
      return;
    }
    host.innerHTML = catalogs.map(function (c) {
      var rows = codes.filter(function (k) { return ITEMS[k].catalog === c; });
      if (!rows.length) return '';
      return '<div class="sel-group"><h4>' + esc(cName(c)) + ' <small>' + esc(T('qty_unit', cUnit(c))) + '</small></h4><div class="tbl-wrap"><table><thead><tr><th>' + T('th_code') + '</th><th>' + T('th_name') + '</th><th>' + esc(T('th_qty', cUnit(c))) + '</th><th><span class="sr">' + T('th_rm') + '</span></th></tr></thead><tbody>' +
        rows.map(function (k) {
          var it = ITEMS[k];
          return '<tr data-code="' + k + '"><td><span class="code">' + esc(k) + '</span></td><td class="nm">' + esc(it.name) + '</td>' +
            '<td><label class="sr" for="q_' + k + '">' + esc(T('qty_aria', k)) + '</label><input class="qty" id="q_' + k + '" type="number" min="0" step="1" inputmode="numeric" value="' + (sel[k] == null ? 1 : sel[k]) + '"></td>' +
            '<td><button type="button" class="rm" aria-label="' + esc(T('rm_aria', k)) + '">' + ICON_X + '</button></td></tr>';
        }).join('') + '</tbody></table></div></div>';
    }).join('');
  }
  $('#selected').addEventListener('input', function (e) {
    var inp = e.target.closest('.qty'); if (!inp) return;
    var code = inp.closest('tr').getAttribute('data-code');
    var n = parseInt(toLatin(inp.value), 10);
    sel[code] = isNaN(n) || n < 0 ? 0 : n;
    save(); renderPrint();
  });
  $('#selected').addEventListener('click', function (e) {
    var b = e.target.closest('.rm'); if (!b) return;
    delete sel[b.closest('tr').getAttribute('data-code')];
    refreshRows(); onSelChange();
  });
  $('#clearAll').addEventListener('click', function () {
    if (!selCodes().length) return;
    if (!confirm(T('clear_confirm'))) return;
    sel = {}; refreshRows(); onSelChange();
  });

  function onSelChange() { renderSelected(); renderPrint(); save(); errKeys.items = ''; $('#e_items').textContent = ''; }

  /* ---------- form + messages ---------- */
  function val(id) { return ($('#' + id).value || '').trim(); }
  function data() {
    return {
      clinic: val('f_clinic'), city: val('f_city'), dept: val('f_dept'), contact: val('f_contact'),
      title: val('f_title'), email: val('f_email'), phone: toLatin(val('f_phone')), start: val('f_start'),
      total: toLatin(val('f_total')), notes: val('f_notes'),
      req: $$('input[name=req]:checked').map(function (e) { return T('req_' + e.value); })
    };
  }
  function today() {
    var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }
  function lines(codes) {
    return codes.map(function (k) { return k + ' — ' + ITEMS[k].name + ' — ' + (sel[k] == null ? 1 : sel[k]); });
  }
  function head(d, count, total) {
    var L = [T('msg_title'), T('msg_date') + today()];
    if (CFG && CFG.r) L.push(T('msg_ref', CFG.r));
    L.push('', T('msg_clinic_head'));
    var pairs = [[T('msg_org'), d.clinic], [T('msg_city'), d.city], [T('msg_dept'), d.dept], [T('msg_contact'), d.contact], [T('msg_jt'), d.title],
      [T('msg_email'), d.email], [T('msg_phone'), d.phone], [T('msg_start'), d.start], [T('msg_total'), d.total]];
    pairs.forEach(function (p) { if (p[1]) L.push(p[0] + ': ' + p[1]); });
    if (d.req.length) L.push('', T('msg_reqs') + d.req.join(T('sep')));
    if (d.notes) L.push('', T('msg_notes') + d.notes);
    L.push('', T('msg_items') + (count === total ? total : T('msg_of', count, total)));
    return L;
  }
  function buildMessage(d, codes) { return head(d, codes.length, codes.length).concat(lines(codes)).join('\n'); }
  function mailUrl(d, codes, n) {
    var shown = codes.slice(0, n);
    var L = head(d, shown.length, codes.length).concat(lines(shown));
    if (n < codes.length) L.push('', T('msg_short'));
    return 'mailto:' + MAIL + '?subject=' + encodeURIComponent(T('mail_subj') + (d.clinic || T('mail_clinic')) + (CFG && CFG.r ? ' (' + CFG.r + ')' : '')) + '&body=' + encodeURIComponent(L.join('\n'));
  }

  function validate() {
    var d = data(), ok = true;
    function bad(id, key) { errKeys[id] = key; $('#e_' + id).textContent = key ? T(key) : ''; $('#f_' + id).classList.toggle('bad', !!key); if (key) ok = false; }
    bad('clinic', d.clinic ? '' : 'e_clinic');
    bad('contact', d.contact ? '' : 'e_contact');
    bad('phone', d.phone.replace(/\D/g, '').length >= 8 ? '' : 'e_phone');
    bad('email', !d.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) ? '' : 'e_email');
    var codes = selCodes();
    errKeys.items = codes.length ? '' : 'e_items';
    $('#e_items').textContent = errKeys.items ? T('e_items') : '';
    if (!codes.length) ok = false;
    if (!ok) {
      var first = $('.bad') || $('#selected');
      first.scrollIntoView({ block: 'center' });
      if (first.focus && first.classList.contains('bad')) first.focus();
    }
    return ok ? { d: d, codes: codes } : null;
  }

  $('#sendWa').addEventListener('click', function () {
    var v = validate(); if (!v) return;
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(buildMessage(v.d, v.codes)), '_blank', 'noopener');
  });
  $('#sendMail').addEventListener('click', function () {
    var v = validate(); if (!v) return;
    var n = v.codes.length, MAX = 1800, url = mailUrl(v.d, v.codes, n);
    if (url.length > MAX) {
      var lo = 0, hi = n - 1;
      while (lo < hi) { var mid = Math.ceil((lo + hi) / 2); if (mailUrl(v.d, v.codes, mid).length <= MAX) lo = mid; else hi = mid - 1; }
      n = lo; url = mailUrl(v.d, v.codes, n);
    }
    $('#mailNote').hidden = n >= v.codes.length;
    window.location.href = url;
  });
  $('#printBtn').addEventListener('click', function () {
    var v = validate(); if (!v) return;
    renderPrint(); window.print();
  });

  /* ---------- copy link / hash ---------- */
  function buildLink() {
    if (CFG) {
      var o = { n: CFG.n, s: {}, v: 1 };
      if (CFG.ci) o.ci = CFG.ci;
      if (CFG.d) o.d = CFG.d;
      if (CFG.k.length) o.k = CFG.k;
      if (CFG.l) o.l = CFG.l;
      if (CFG.r) o.r = CFG.r;
      selCodes().forEach(function (k) { o.s[k] = sel[k] == null ? 1 : sel[k]; });
      if (CFG.code) {
        var ps = selCodes().map(function (k) { return k + ':' + (sel[k] == null ? 1 : sel[k]); });
        return location.href.split('#')[0].split('?')[0] + '?' + CFG.code + (ps.length ? '#sel=' + ps.join(',') : '');
      }
      return location.href.split('#')[0] + '#c=' + b64uEncode(JSON.stringify(o));
    }
    var parts = selCodes().map(function (k) { return k + ':' + (sel[k] == null ? 1 : sel[k]); });
    return location.href.split('#')[0] + '#sel=' + parts.join(',');
  }
  function copyText(t) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = t; ta.style.cssText = 'position:fixed;opacity:0;top:0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { }
      document.body.removeChild(ta); return ok;
    }
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(t).then(function () { return true; }, function () { return fallback(); });
    }
    return Promise.resolve(fallback());
  }
  $('#copyLink').addEventListener('click', function () {
    var msg = $('#copyMsg');
    if (!selCodes().length) { copyKey = 'm_empty'; msg.textContent = T(copyKey); return; }
    copyText(buildLink()).then(function (ok) { copyKey = ok ? 'm_ok' : 'm_fail'; msg.textContent = T(copyKey); });
  });
  function readHash() {
    var m = /[#&]sel=([^&]*)/.exec(location.hash);
    if (!m) return false;
    var any = false;
    decodeURIComponent(m[1]).split(',').forEach(function (p) {
      var a = p.split(':'), code = (a[0] || '').trim().toUpperCase();
      if (!ITEMS[code]) return;
      var n = parseInt(toLatin(a[1]), 10);
      sel[code] = isNaN(n) || n < 0 ? 1 : n; any = true;
    });
    return any;
  }

  /* ---------- print document ---------- */
  function renderPrint() {
    var d = data(), codes = selCodes();
    var rows = [[T('f_clinic'), d.clinic], [T('f_city'), d.city], [T('f_dept'), d.dept], [T('f_contact'), d.contact],
      [T('f_title'), d.title], [T('f_email'), d.email], [T('f_phone'), d.phone], [T('f_start'), d.start],
      [T('f_total'), d.total]].filter(function (r) { return r[1]; });
    var h = '<div class="ph"><img src="assets/logo-wordmark-dark.png" alt="' + esc(T('brand')) + '"><div><h1>' + T('pr_title') + '</h1></div><div class="dt">' + today() + (CFG && CFG.r ? '<br>' + esc(T('msg_ref', CFG.r)) : '') + '</div></div>';
    h += '<h2>' + T('form_head') + '</h2><div class="grid2">' + rows.map(function (r) { return '<div><span>' + r[0] + ':</span> ' + esc(r[1]) + '</div>'; }).join('') + '</div>';
    if (d.req.length) h += '<h2>' + T('req_head') + '</h2><p>' + esc(d.req.join(T('sep'))) + '</p>';
    if (d.notes) h += '<h2>' + T('pr_notes') + '</h2><p>' + esc(d.notes) + '</p>';
    h += '<h2>' + T('pr_items') + ' (' + codes.length + ')</h2>';
    catalogs.forEach(function (c) {
      var rs = codes.filter(function (k) { return ITEMS[k].catalog === c; });
      if (!rs.length) return;
      h += '<p class="gh">' + esc(cName(c)) + ' — ' + esc(T('pr_unit', cUnit(c))) + '</p><table><thead><tr><th>' + T('th_code') + '</th><th>' + T('th_name') + '</th><th>' + esc(T('th_qty', cUnit(c))) + '</th></tr></thead><tbody>' +
        rs.map(function (k) { return '<tr><td class="l">' + esc(k) + '</td><td class="l">' + esc(ITEMS[k].name) + '</td><td class="q">' + (sel[k] == null ? 1 : sel[k]) + '</td></tr>'; }).join('') + '</tbody></table>';
    });
    h += '<div class="pf">' + T('pr_f1') + '<br>' + T('pr_f2') + '</div>';
    $('#printDoc').innerHTML = h;
  }
  window.addEventListener('beforeprint', renderPrint);

  /* ---------- misc ---------- */
  $('#form').addEventListener('input', function (e) {
    if (e.target.classList.contains('bad')) { e.target.classList.remove('bad'); var id = e.target.id.replace('f_', ''); errKeys[id] = ''; var m = $('#e_' + id); if (m) m.textContent = ''; }
    save(); renderPrint();
  });
  $('#form').addEventListener('change', function () { save(); renderPrint(); });
  $('#f_phone').addEventListener('blur', function (e) { e.target.value = toLatin(e.target.value); });
  $('#form').addEventListener('submit', function (e) { e.preventDefault(); });

  var menuBtn = $('#menuBtn'), nav = $('#mainNav');
  menuBtn.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } });

  /* ---------- language switching ---------- */
  function applyStatic() {
    $$('[data-i18n]').forEach(function (el) { el.textContent = T(el.getAttribute('data-i18n')); });
    $$('[data-i18n-html]').forEach(function (el) { el.innerHTML = T(el.getAttribute('data-i18n-html')); });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (p) {
        var a = p.split(':'); if (a.length === 2) el.setAttribute(a[0], T(a[1]));
      });
    });
    document.title = T('title');
    var md = $('meta[name=description]'); if (md) md.setAttribute('content', T('meta_desc'));
    var lb = $('#langBtn');
    lb.textContent = T('lang_btn'); lb.setAttribute('lang', T('lang_btn_lang')); lb.setAttribute('aria-label', T('lang_aria'));
    applyChip();
    errKeys && Object.keys(errKeys).forEach(function (id) { var e = $('#e_' + id); if (e) e.textContent = errKeys[id] ? T(errKeys[id]) : ''; });
    if (copyKey) $('#copyMsg').textContent = T(copyKey);
  }
  function renderAll() {
    var root = document.documentElement;
    root.lang = lang; root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    applyStatic(); renderFigures(); renderTabs(); renderCatalog(); renderSelected(); renderPrint();
  }
  function currentAnchor() {
    var best = null;
    $$('.site-header ~ main > section, main > section').forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= 100) best = sec;
    });
    return best ? { el: best, top: best.getBoundingClientRect().top } : null;
  }
  function setLang(l) {
    if (l === lang) return;
    var a = currentAnchor();
    lang = l;
    try { localStorage.setItem(LANG_KEY, lang); if (CFG) localStorage.setItem(LANG_KEY2, lang); } catch (e) { }
    try {
      if (/[?&]lang=/.test(location.search)) history.replaceState(null, '', location.pathname + location.search.replace(/([?&]lang=)(ar|en)/, '$1' + lang) + location.hash);
    } catch (e) { }
    var de = document.documentElement, prev = de.style.scrollBehavior;
    de.style.scrollBehavior = 'auto';
    renderAll();
    if (a) window.scrollTo(0, window.pageYOffset + a.el.getBoundingClientRect().top - a.top);
    de.style.scrollBehavior = prev;
  }
  $('#langBtn').addEventListener('click', function () { setLang(lang === 'en' ? 'ar' : 'en'); });
  try { if (/[?&]lang=(ar|en)/.test(location.search)) localStorage.setItem(LANG_KEY, lang); } catch (e) { }


  /* ---------- opening intro (personalised links only) ---------- */
  function initials(name) {
    var w = String(name).split(/\s+/).map(function (x) { return Array.from(x.replace(/^[^\p{L}\p{N}]+/u, '').replace(/^ال(?=[\u0600-\u06FF]{2})/, ''))[0]; }).filter(Boolean).slice(0, 2);
    var isAr = /[\u0600-\u06FF]/.test(w.join(''));
    return { text: isAr ? w.join(' ') : w.join('').toUpperCase(), ar: isAr };
  }
  function showIntro() {
    if (!CFG) return;
    var ini = initials(CFG.n), prev = document.activeElement, done = false, ov = document.createElement('div');
    ov.className = 'intro'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', T('intro_label'));
    ov.innerHTML =
      '<svg class="intro-grain" aria-hidden="true" focusable="false"><filter id="introGrain"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="ur' + 'l(#introGrain)"/></svg>' +
      '<i class="intro-glow g1" aria-hidden="true"></i><i class="intro-glow g2" aria-hidden="true"></i>' +
      '<div class="intro-in">' +
        '<div class="intro-badges">' +
          '<div class="ib ib-nawa"><img src="assets/logo-mark.png" alt=""></div>' +
          '<span class="ib-sep" aria-hidden="true"></span>' +
          '<div class="ib ib-partner" id="ibPartner"></div>' +
        '</div>' +
        '<p class="intro-eyebrow rise d4">' + esc(T('intro_welcome')) + '</p>' +
        '<h2 class="intro-name rise d5"><bdi>' + esc(CFG.n) + '</bdi></h2>' +
        '<p class="intro-line rise d6">' + esc(T('intro_ready')) + '</p>' +
        '<div class="intro-bar rise d7" aria-hidden="true"><i></i></div>' +
        '<button type="button" class="intro-enter rise d8">' + esc(T('intro_enter')) + '</button>' +
      '</div>';
    var pb = ov.querySelector('#ibPartner');
    function mono() {
      pb.innerHTML = '<span class="ib-mono' + (ini.ar ? '' : ' lat') + '" dir="' + (ini.ar ? 'rtl' : 'ltr') + '" aria-hidden="true">' + esc(ini.text) + '</span>';
    }
    if (CFG.lg) {
      var im = new Image(), fb = setTimeout(function () { if (!im.complete || !im.naturalWidth) { im.onload = im.onerror = null; mono(); } }, 1500);
      im.alt = ''; im.referrerPolicy = 'no-referrer';
      im.onload = function () { clearTimeout(fb); pb.appendChild(im); };
      im.onerror = function () { clearTimeout(fb); mono(); };
      im.src = CFG.lg;
    } else mono();
    document.body.appendChild(ov);
    document.documentElement.classList.add('intro-lock');
    var enter = ov.querySelector('.intro-enter');
    function close() {
      if (done) return; done = true;
      document.removeEventListener('keydown', onKey, true);
      ov.classList.add('out');
      document.documentElement.classList.add('intro-handoff');
      setTimeout(function () { document.documentElement.classList.remove('intro-handoff'); }, 1200);
      document.documentElement.classList.remove('intro-lock');
      try { if (prev && prev.focus && document.contains(prev)) prev.focus({ preventScroll: true }); } catch (e) { }
      setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 750);
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'Tab') {
        e.preventDefault();
        enter.focus();
      }
    }
    document.addEventListener('keydown', onKey, true);
    enter.addEventListener('click', close);
    enter.focus({ preventScroll: true });
    setTimeout(function () { ov.classList.add('settled'); }, 2300);
  }

  /* ---------- init ---------- */
  load();
  applyConfig();
  var fromHash = readHash();
  renderAll();
  if (CFG) save();
  showIntro();
  document.documentElement.classList.remove('intro-pre');
  if (fromHash) {
    save();
    try { history.replaceState(null, '', location.pathname + location.search + (CFG && CFG.raw ? '#c=' + CFG.raw : '')); } catch (e) { }
    setTimeout(function () { var q = $('#quote'); if (q) q.scrollIntoView(); }, 50);
  }
}

/* ---------- bootstrap: short code (?alrida / ?c=alrida) or classic ---------- */
(function () {
  function shortCode() {
    if (/[#&]c=[A-Za-z0-9_=-]/.test(location.hash)) return '';
    var q = location.search.replace(/^\?/, '').split('&'), i, m;
    for (i = 0; i < q.length; i++) {
      if ((m = /^c=([A-Za-z0-9-]{2,32})$/i.exec(q[i]))) return m[1].toLowerCase();
    }
    for (i = 0; i < q.length; i++) {
      if (/^[A-Za-z0-9-]{2,32}$/.test(q[i])) return q[i].toLowerCase();
    }
    return '';
  }
  var code = shortCode();
  if (!code) { nawaBoot(null); return; }
  var done = false;
  function go(o) {
    if (done) return; done = true;
    nawaBoot(o ? { o: o, code: code } : null);
  }
  fetch('clinics/' + code + '.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw 0; return r.json(); })
    .then(go, function () { go(null); });
})();
