/**
 * Ahorro Real & Liquidez - Progressive Web App
 * Lógica matemática de estandarización y semáforo de decisiones anti-reduflación.
 */

(() => {
  'use strict';

  // --- State ---
  let currentUnitType = 'weight'; // 'weight' (g/kg) | 'volume' (ml/L)
  let deferredPrompt = null;

  // --- DOM Elements ---
  const priceAInput = document.getElementById('priceA');
  const qtyAInput = document.getElementById('qtyA');
  const stdValueA = document.getElementById('stdValueA');
  const outlayValueA = document.getElementById('outlayValueA');
  const tagA = document.getElementById('tagA');

  const priceBInput = document.getElementById('priceB');
  const qtyBInput = document.getElementById('qtyB');
  const stdValueB = document.getElementById('stdValueB');
  const outlayValueB = document.getElementById('outlayValueB');
  const tagB = document.getElementById('tagB');

  const verdictEmpty = document.getElementById('verdictEmpty');
  const verdictActive = document.getElementById('verdictActive');
  const trafficBadge = document.getElementById('trafficBadge');
  const verdictTitle = document.getElementById('verdictTitle');
  const savingsPctValue = document.getElementById('savingsPctValue');
  const recommendationText = document.getElementById('recommendationText');
  const breakdownOutlay = document.getElementById('breakdownOutlay');
  const breakdownStandard = document.getElementById('breakdownStandard');
  const breakdownDiff = document.getElementById('breakdownDiff');
  const adviceNote = document.getElementById('adviceNote');

  const resetBtn = document.getElementById('resetBtn');
  const unitToggles = document.querySelectorAll('.unit-toggle');
  const unitLabelCurrent = document.querySelectorAll('.unit-label-current');
  const unitSuffixCurrent = document.querySelectorAll('.unit-suffix-current');
  const unitAbbrEls = document.querySelectorAll('.unit-abbr');
  const chipBtns = document.querySelectorAll('.chip-btn');
  const chipUnits = document.querySelectorAll('.chip-unit');

  const installBanner = document.getElementById('installBanner');
  const installActionBtn = document.getElementById('installActionBtn');
  const installDismissBtn = document.getElementById('installDismissBtn');
  const offlineStatusBadge = document.getElementById('offlineStatus');

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  // --- Theme Management (Light / Dark Mode) ---
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIconSun) themeIconSun.classList.add('hidden');
      if (themeIconMoon) themeIconMoon.classList.remove('hidden');
      if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Cambiar a modo oscuro');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#f1f5f9');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIconSun) themeIconSun.classList.remove('hidden');
      if (themeIconMoon) themeIconMoon.classList.add('hidden');
      if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Cambiar a modo claro');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#080c14');
    }
    try {
      localStorage.setItem('comparador_theme', theme);
    } catch (e) {
      // Ignorar restricciones en entornos aislados
    }
  }

  function initTheme() {
    let savedTheme = 'dark';
    try {
      savedTheme = localStorage.getItem('comparador_theme') || 'dark';
    } catch (e) {
      savedTheme = 'dark';
    }
    applyTheme(savedTheme);
  }

  // --- Number Parsing Helper ---
  // Normalizes comma/dot and handles mobile keypad differences
  function parseNumber(val) {
    if (!val) return 0;
    const clean = String(val).replace(/\s/g, '').replace(',', '.');
    const num = parseFloat(clean);
    return isNaN(num) || num < 0 ? 0 : num;
  }

  // Formatting currency / numbers
  function formatMoney(amount) {
    return 'Bs ' + Number(amount).toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function getUnitSymbols() {
    return currentUnitType === 'weight'
      ? { base: 'g', std: 'kg', name: 'kilo' }
      : { base: 'ml', std: 'L', name: 'litro' };
  }

  // --- Core Calculation & Decision Matrix ---
  function calculate() {
    const pA = parseNumber(priceAInput.value);
    const qA = parseNumber(qtyAInput.value);
    const pB = parseNumber(priceBInput.value);
    const qB = parseNumber(qtyBInput.value);

    const units = getUnitSymbols();

    // Standard Unit Prices (Formula: (Precio / Cantidad) * 1000)
    const stdA = (pA > 0 && qA > 0) ? (pA / qA) * 1000 : 0;
    const stdB = (pB > 0 && qB > 0) ? (pB / qB) * 1000 : 0;

    // Update Option A preview
    if (stdA > 0) {
      stdValueA.textContent = `${formatMoney(stdA)} / ${units.std}`;
      outlayValueA.textContent = formatMoney(pA);
    } else {
      stdValueA.textContent = '--';
      outlayValueA.textContent = pA > 0 ? formatMoney(pA) : '--';
    }

    // Update Option B preview
    if (stdB > 0) {
      stdValueB.textContent = `${formatMoney(stdB)} / ${units.std}`;
      outlayValueB.textContent = formatMoney(pB);
    } else {
      stdValueB.textContent = '--';
      outlayValueB.textContent = pB > 0 ? formatMoney(pB) : '--';
    }

    // Both options must have valid price and quantity to evaluate the decision matrix
    if (stdA > 0 && stdB > 0) {
      renderVerdict(pA, qA, stdA, pB, qB, stdB, units);
    } else {
      renderIncomplete(stdA, stdB, pA, pB);
    }

    // Update chip active states
    syncActiveChips();
  }

  function renderIncomplete(stdA, stdB, pA, pB) {
    verdictEmpty.classList.remove('hidden');
    verdictActive.classList.add('hidden');
    tagA.className = 'preview-tag';
    tagB.className = 'preview-tag';

    if (stdA > 0 || stdB > 0) {
      verdictEmpty.querySelector('.verdict-title').textContent = 'Faltan datos de comparación';
      verdictEmpty.querySelector('.verdict-desc').textContent = 'Ingresa el precio y la cantidad de ambas opciones para activar el semáforo de decisiones.';
    } else {
      verdictEmpty.querySelector('.verdict-title').textContent = 'Ingresa precios y cantidades';
      verdictEmpty.querySelector('.verdict-desc').textContent = 'El análisis de liquidez vs. ahorro real se calculará automáticamente al teclear.';
    }
  }

  /**
   * Evaluates the Decision Matrix (El Abogado del Diablo):
   * Formula: % Ahorro = ((Precio Mayor - Precio Menor) / Precio Mayor) * 100
   * - Rojo (< 4%): Ahorro basura/engañoso. Proteger liquidez.
   * - Amarillo (4% - 10%): Ahorro moderado. Solo si el flujo de caja lo permite.
   * - Verde (> 10%): Ahorro real y contundente. Comprar opción ganadora.
   */
  function renderVerdict(pA, qA, stdA, pB, qB, stdB, units) {
    verdictEmpty.classList.add('hidden');
    verdictActive.classList.remove('hidden');

    const higherStd = Math.max(stdA, stdB);
    const lowerStd = Math.min(stdA, stdB);

    // % Ahorro = ((Precio Mayor - Precio Menor) / Precio Mayor) * 100
    const savingsPct = higherStd > 0 ? ((higherStd - lowerStd) / higherStd) * 100 : 0;
    savingsPctValue.textContent = savingsPct.toFixed(1);

    // Identify winners
    const winnerStdIsA = stdA < stdB;
    const isTieStd = Math.abs(stdA - stdB) < 0.0001;
    const winnerOptLetter = isTieStd ? 'Ambas' : (winnerStdIsA ? 'A' : 'B');

    const lowestOutlayIsA = pA < pB;
    const isTieOutlay = Math.abs(pA - pB) < 0.001;
    const lowestOutlayLetter = isTieOutlay ? 'Igual' : (lowestOutlayIsA ? 'A' : 'B');

    // Tags on cards
    tagA.className = 'preview-tag show';
    tagB.className = 'preview-tag show';

    if (isTieStd) {
      tagA.textContent = 'Mismo precio unitario';
      tagA.className = 'preview-tag show';
      tagB.textContent = 'Mismo precio unitario';
      tagB.className = 'preview-tag show';
    } else if (winnerStdIsA) {
      tagA.textContent = '★ Menor costo / ' + units.std;
      tagA.className = 'preview-tag show winner';
      tagB.textContent = lowestOutlayIsA ? 'Más costoso' : '★ Menor desembolso';
      tagB.className = lowestOutlayIsA ? 'preview-tag show' : 'preview-tag show low-outlay';
    } else {
      tagB.textContent = '★ Menor costo / ' + units.std;
      tagB.className = 'preview-tag show winner';
      tagA.textContent = lowestOutlayIsA ? '★ Menor desembolso' : 'Más costoso';
      tagA.className = lowestOutlayIsA ? 'preview-tag show low-outlay' : 'preview-tag show';
    }

    // Reset verdict theme classes
    verdictActive.classList.remove('theme-red', 'theme-amber', 'theme-green');

    const diffStd = Math.abs(stdA - stdB);
    const diffOutlay = Math.abs(pA - pB);

    // Populate financial breakdown
    breakdownOutlay.textContent = `${formatMoney(pA)} vs ${formatMoney(pB)}`;
    breakdownStandard.textContent = `${formatMoney(stdA)} vs ${formatMoney(stdB)}`;
    breakdownDiff.textContent = diffOutlay > 0 ? `${formatMoney(diffOutlay)} dif.` : 'Sin diferencia';

    // --- Matriz de Decisión ---
    if (savingsPct < 4.0) {
      // 🔴 ROJO (< 4% de ahorro)
      verdictActive.classList.add('theme-red');
      trafficBadge.textContent = '🔴 Ahorro Basura / Engañoso (< 4%)';
      verdictTitle.textContent = 'Prioridad: Proteger la Liquidez';

      let directRecommendation = '';
      if (!isTieOutlay) {
        const bestOutlayPrice = lowestOutlayIsA ? pA : pB;
        const worstOutlayPrice = lowestOutlayIsA ? pB : pA;
        directRecommendation = `Recomendación: Proteger la liquidez. Comprar la Opción ${lowestOutlayLetter} (empaque más barato en valor absoluto: ${formatMoney(bestOutlayPrice)} vs ${formatMoney(worstOutlayPrice)}).`;
      } else {
        directRecommendation = `Recomendación: Proteger la liquidez. Ambas opciones tienen el mismo desembolso (${formatMoney(pA)}).`;
      }

      recommendationText.textContent = directRecommendation;
      adviceNote.innerHTML = `<strong>Abogado del Diablo:</strong> La diferencia de precio unitario es mínima (<strong>${savingsPct.toFixed(1)}%</strong>, apenas ${formatMoney(diffStd)} por ${units.std}). Pagar más dinero de bolsillo hoy no justifica inmovilizar capital por un ahorro cosmético.`;

    } else if (savingsPct >= 4.0 && savingsPct <= 10.0) {
      // 🟡 AMARILLO (4% - 10% de ahorro)
      verdictActive.classList.add('theme-amber');
      trafficBadge.textContent = '🟡 Ahorro Moderado (4% - 10%)';
      verdictTitle.textContent = 'Decisión Condicionada al Flujo de Caja';

      const largerVolIsA = qA > qB;
      const largerVolOpt = largerVolIsA ? 'A' : 'B';

      recommendationText.textContent = `Recomendación: Ahorro moderado. Comprar el de mayor volumen (Opción ${largerVolOpt}) solo si el flujo de caja actual lo permite sin sacrificar otras compras.`;

      adviceNote.innerHTML = `<strong>Análisis de Liquidez:</strong> La Opción ${winnerOptLetter} rinde <strong>${savingsPct.toFixed(1)}%</strong> más por ${units.name}. Si tu liquidez está ajustada, quédate con la opción de menor desembolso inmediato (${formatMoney(Math.min(pA, pB))}). Si dispones de excedente sin comprometer tu presupuesto diario, aprovecha el empaque mayor.`;

    } else {
      // 🟢 VERDE (> 10% de ahorro)
      verdictActive.classList.add('theme-green');
      trafficBadge.textContent = '🟢 Ahorro Real y Contundente (> 10%)';
      verdictTitle.textContent = `Victoria Clara: Opción ${winnerOptLetter}`;

      recommendationText.textContent = `Recomendación: Comprar la opción ganadora (Opción ${winnerOptLetter}, menor costo por ${units.name}), asumiendo que el producto no tiene riesgo de caducidad o merma por almacenamiento.`;

      adviceNote.innerHTML = `<strong>Ahorro Significativo:</strong> Estás ahorrando <strong>${formatMoney(diffStd)} por cada ${units.std}</strong> (${savingsPct.toFixed(1)}% de rendimiento). El ahorro compensa ampliamente el desembolso de capital siempre que el producto sea consumido en su totalidad.`;
    }
  }

  // --- Synchronize Active Chips UI ---
  function syncActiveChips() {
    const valA = qtyAInput.value.trim();
    const valB = qtyBInput.value.trim();

    chipBtns.forEach(btn => {
      const container = btn.closest('.chips-container');
      const targetId = container ? container.getAttribute('data-target') : null;
      const chipVal = btn.getAttribute('data-value');

      if (targetId === 'qtyA') {
        btn.classList.toggle('active', valA === chipVal);
      } else if (targetId === 'qtyB') {
        btn.classList.toggle('active', valB === chipVal);
      }
    });
  }

  // --- Event Listeners for Real-Time Reactivity ---
  const inputs = [priceAInput, qtyAInput, priceBInput, qtyBInput];
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      calculate();
    });
    input.addEventListener('keyup', () => {
      calculate();
    });
    input.addEventListener('change', () => {
      calculate();
    });
  });

  // --- Quick Chips Handler ---
  chipBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const container = btn.closest('.chips-container');
      const targetId = container ? container.getAttribute('data-target') : null;
      const val = btn.getAttribute('data-value');

      if (targetId === 'qtyA') {
        qtyAInput.value = val;
        qtyAInput.focus();
      } else if (targetId === 'qtyB') {
        qtyBInput.value = val;
        qtyBInput.focus();
      }
      calculate();
    });
  });

  // --- Unit Selector Handler ---
  unitToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const unitType = toggle.getAttribute('data-unit');
      if (unitType === currentUnitType) return;

      currentUnitType = unitType;
      unitToggles.forEach(t => t.classList.remove('active'));
      toggle.classList.add('active');

      const symbols = getUnitSymbols();

      // Update labels in DOM
      unitLabelCurrent.forEach(el => el.textContent = `(${symbols.base})`);
      unitSuffixCurrent.forEach(el => el.textContent = symbols.base);
      unitAbbrEls.forEach(el => el.textContent = symbols.base);
      chipUnits.forEach(el => el.textContent = symbols.base);

      calculate();
    });
  });

  // --- Reset Button Handler ---
  resetBtn.addEventListener('click', () => {
    priceAInput.value = '';
    qtyAInput.value = '';
    priceBInput.value = '';
    qtyBInput.value = '';
    calculate();
    priceAInput.focus();
  });

  // --- Connection Status Management ---
  function updateConnectionStatus() {
    if (navigator.onLine) {
      offlineStatusBadge.classList.remove('offline');
      offlineStatusBadge.querySelector('.status-label').textContent = 'Offline Ready';
    } else {
      offlineStatusBadge.classList.add('offline');
      offlineStatusBadge.querySelector('.status-label').textContent = 'Modo Sin Conexión';
    }
  }
  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);
  updateConnectionStatus();

  // --- PWA Installation Handling ---
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner.classList.remove('hidden');
  });

  installActionBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('Usuario instaló la PWA');
    }
    deferredPrompt = null;
    installBanner.classList.add('hidden');
  });

  installDismissBtn.addEventListener('click', () => {
    installBanner.classList.add('hidden');
  });

  window.addEventListener('appinstalled', () => {
    installBanner.classList.add('hidden');
    deferredPrompt = null;
  });

  // --- Register Service Worker for 100% Offline Support ---
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => {
          console.log('Service Worker registrado correctamente. Ámbito:', reg.scope);
        })
        .catch((err) => {
          console.warn('Error al registrar el Service Worker:', err);
        });
    });
  }

  // --- Theme Toggle Click Handler ---
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  // Initialize Theme and Calculation
  initTheme();
  calculate();
})();
