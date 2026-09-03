// ============================================================
//  منطق منوی آنلاین — سواري (رندر منو + واترمارک)
// ============================================================

(function () {
    'use strict';

    // بارگذاری اطلاعات رستوران
    function setHeader() {
        document.getElementById('restName').textContent = DATA.name;
        document.getElementById('restAddr').textContent = DATA.address;

        var tel = 'tel:' + DATA.phonenumber;
        var wa = 'https://wa.me/' + DATA.phonenumber;
        var orderBtn = document.getElementById('waOrder');
        orderBtn.href = wa;

        var phOrder = document.getElementById('phOrder');
        phOrder.textContent = DATA.phonenumber;
        phOrder.href = tel;

        var callBtn = document.getElementById('callBtn');
        callBtn.href = tel;
        callBtn.onclick = function () { location.href = tel; };
    }

    // ساخت هر دسته (کارت جمع‌شونده)
    function buildCategories() {
        var list = document.getElementById('menuList');
        DATA.categories.forEach(function (cat, idx) {
            var card = document.createElement('article');
            card.className = 'cat-card open';
            card.id = 'cat-' + idx;

            var head = document.createElement('button');
            head.className = 'cat-head';
            head.setAttribute('data-index', idx);

            var imgWrap = document.createElement('div');
            imgWrap.className = 'cat-img';
            var img = document.createElement('img');
            img.src = 'assets/images/' + cat.img;
            img.alt = cat.title;
            img.loading = 'lazy';
            imgWrap.appendChild(img);

            var titleWrap = document.createElement('div');
            titleWrap.className = 'cat-title-wrap';
            var title = document.createElement('h2');
            title.className = 'cat-title';
            title.textContent = cat.title;
            titleWrap.appendChild(title);
            if (cat.note) {
                var note = document.createElement('span');
                note.className = 'cat-note';
                note.textContent = cat.note;
                titleWrap.appendChild(note);
            }

            var items = document.createElement('ul');
            items.className = 'cat-items';

            cat.items.forEach(function (it) {
                var li = document.createElement('li');
                li.className = 'menu-item';
                var nm = document.createElement('span');
                nm.className = 'item-name';
                nm.textContent = it[0];
                var price = document.createElement('span');
                price.className = 'item-price';
                price.innerHTML = it[1] + ' <span class="riyal"></span>';
                li.appendChild(nm);
                li.appendChild(price);
                items.appendChild(li);
            });

            var arrow = document.createElement('span');
            arrow.className = 'cat-arrow';
            arrow.textContent = '\u203A';

            head.appendChild(imgWrap);
            head.appendChild(titleWrap);
            head.appendChild(arrow);
            card.appendChild(head);
            card.appendChild(items);
            list.appendChild(card);

            head.addEventListener('click', function () {
                // هر دسته مستقل باز/بسته می‌شود؛ چند دسته می‌توانند همزمان باز باشند
                card.classList.toggle('open');
            });
        });
    }

    // ---------- واترمارک ----------
    function buildWatermark() {
        var wm = typeof EXTRAS !== 'undefined' && EXTRAS.watermark;
        if (!wm || !wm.enabled) return;

        var wrap = document.createElement('div');
        wrap.className = 'watermark';
        wrap.style.pointerEvents = 'none';

        var cellW = wm.spacingX * 2;
        var cols = Math.ceil(window.innerWidth / cellW) + 1;
        var rows = Math.ceil(document.body.scrollHeight / (wm.spacingY * 2)) + 1;
        var n = 0;

        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                var s = document.createElement('span');
                s.className = 'wm-item';
                s.style.fontSize = (wm.fontSize || 46) + 'px';
                s.style.color = wm.color || '#d4af37';
                var staggerX = wm.stagger && (r % 2 === 1) ? wm.spacingX : 0;
                s.style.left = (c * cellW + staggerX) + 'px';
                s.style.top = (r * wm.spacingY * 2 + (wm.spacingY * 0.2)) + 'px';
                s.textContent = wm.phone || '';
                wrap.appendChild(s);
                n++;
            }
        }
        wrap.style.opacity = (wm.opacity != null ? wm.opacity : 0.12);
        document.body.appendChild(wrap);
    }

// جایگذاری آیکون ریال در همه قیمتها
    function initRiyalIcons() {
        document.querySelectorAll('.riyal').forEach(function (r) {
            r.innerHTML = '<svg viewBox="0 0 1124 1256" width="15" height="15" aria-hidden="true"><path fill="#d4af37" d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/><path fill="#d4af37" d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14C18.33,1062.75,5.07,1111.03,0,1161.65l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28v.02Z"/></svg>';
        });
    }

// ---------- نوار منو (بالا) ----------
    function buildNav() {
        var nav = document.getElementById('catNav');
        DATA.categories.forEach(function (cat, idx) {
            var a = document.createElement('a');
            a.className = 'cat-nav-link';
            a.href = '#cat-' + idx;
            a.textContent = cat.title;
            a.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelectorAll('.cat-nav-link').forEach(function (l) {
                    l.classList.remove('active');
                });
                a.classList.add('active');

                // اسکرول افقی نوار منو: لینک کلیک‌شده را به وسط نوار بیاور
                // تا لینک‌های همسایه (مقبلات/معجنات و...) بیرون بیایند و دیده شوند
                // (scrollIntoView با inline:'center' در RTL خودش درست عمل می‌کند)
                a.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

                var target = document.getElementById('cat-' + idx);
                if (target) {
                    // اسکرول هوشمند: دسته انتخاب‌شده را به وسط صفحه ببر
                    // تا دسته‌های همسایه که در کنارند بیرون بیایند و کاربر بفهمد منوی بیشتری هست
                    var navH = nav.getBoundingClientRect().height;
                    var centerShift = (window.innerHeight - navH) / 2;
                    var top = target.getBoundingClientRect().top + window.scrollY - navH - centerShift + target.getBoundingClientRect().height / 2;
                    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
                }
            });
            nav.appendChild(a);
        });
        nav.scrollLeft = 0;
    }

    setHeader();
    buildCategories();
    initRiyalIcons();
    buildNav();
    buildWatermark();
})();