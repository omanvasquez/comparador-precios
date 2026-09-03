# 🛒 Ahorro Real & Liquidez — Comparador Anti-Reduflación (PWA)

[![Live Demo](https://img.shields.io/badge/Demo%20en%20Vivo-Firebase%20Hosting-0284c7?style=for-the-badge&logo=firebase&logoColor=white)](https://comparador-ahorro-pwa.web.app)
[![PWA Ready](https://img.shields.io/badge/PWA-100%25%20Offline--First-10b981?style=for-the-badge&logo=pwa&logoColor=white)](https://comparador-ahorro-pwa.web.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla%20ES6+-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)](https://comparador-ahorro-pwa.web.app)
[![License](https://img.shields.io/badge/Licencia-MIT-a855f7?style=for-the-badge)](LICENSE)

> **Herramienta de toma de decisiones financieras a microescala diseñada para combatir la reduflación y optimizar la liquidez en las compras diarias.**

Emite un veredicto frío, matemático y objetivo sobre si el ahorro de un producto de mayor tamaño justifica el desembolso adicional de capital o si es una trampa de liquidez.

🌐 **Prueba la aplicación aquí:** [https://comparador-ahorro-pwa.web.app](https://comparador-ahorro-pwa.web.app)

---

## ⚡ Características Principales

- **⚡ Reactividad en Tiempo Real:** Cero botones de "Calcular". El DOM y las métricas se recalculan instantáneamente al teclear (`input` reactivo).
- **⚖️ Estandarización Universal (1.000g / 1.000ml):** Convierte cualquier presentación engañosa a su costo unitario real en Bs/kg o Bs/L.
- **🚦 Semáforo de Decisiones (El Abogado del Diablo):**
  - 🔴 **Rojo (< 4% de ahorro):** *Ahorro Basura / Engañoso.* Recomendación: Proteger la liquidez. Comprar la opción que requiera menor desembolso inmediato (el empaque más barato en valor absoluto).
  - 🟡 **Amarillo (4% a 10% de ahorro):** *Ahorro Moderado.* Recomendación: Comprar el de mayor volumen únicamente si el flujo de caja actual lo permite sin sacrificar otras compras.
  - 🟢 **Verde (> 10% de ahorro):** *Ahorro Real y Contundente.* Recomendación: Comprar la opción ganadora (menor costo por kilo), asumiendo que el producto no tiene riesgo de caducidad ni merma.
- **📴 100% Offline-First:** Implementada con Service Worker y Cache Storage API. Funciona sin conexión a internet en pasillos de supermercados o sótanos sin cobertura móvil.
- **🌓 Modo Oscuro y Claro:** Tema oscuro estilo fintech de alto contraste por defecto (ahorro de batería OLED) con selector dinámico a modo claro y persistencia en `localStorage`.
- **🏷️ Chips de Entrada Rápida:** Botones de autocompletado para medidas estándar frecuentes (`250g`, `500g`, `900g`, `1.000g`).
- **📱 Teclados Móviles Optimizados:** Dispara teclados numéricos decimales en precios (`inputmode="decimal"`) y enteros en cantidad (`inputmode="numeric"`), admitiendo tanto punto (`.`) como coma (`,`).
- **📲 Instalable como PWA:** Experiencia nativa en Android, iOS y escritorio (`display: standalone`), sin barra de navegación del navegador.

---

## 📐 Modelo Matemático

### 1. Estandarización Unitaria
$$\text{Precio Estandarizado (Bs/kg o Bs/L)} = \left( \frac{\text{Precio Total}}{\text{Cantidad (g o ml)}} \right) \times 1.000$$

### 2. Rendimiento / Ahorro Real
$$\%\text{ Ahorro} = \left( \frac{\text{Precio Mayor} - \text{Precio Menor}}{\text{Precio Mayor}} \right) \times 100$$

### 3. Matriz de Decisión de Liquidez
| Rango de Ahorro | Clasificación | Acción Recomendada |
| :---: | :---: | :--- |
| **< 4.0%** | 🔴 **Rojo (Engañoso)** | **Proteger liquidez:** Comprar el empaque de menor desembolso absoluto. |
| **4.0% – 10.0%** | 🟡 **Amarillo (Moderado)** | **Condicionado:** Comprar empaque mayor solo con holgura de flujo de caja. |
| **> 10.0%** | 🟢 **Verde (Contundente)** | **Maximizar ahorro:** Comprar la opción ganadora por unidad. |

---

## 🛠️ Stack Tecnológico

- **Frontend:** Vanilla HTML5, CSS3 moderno (Variables CSS, Grid, Flexbox) y JavaScript ES6+ puro. Cero dependencias externas, librerías pesadas ni llamadas a CDNs externas para garantizar 0 ms de latencia y arranque instantáneo.
- **PWA:** Web App Manifest (`manifest.json`), Service Worker con estrategia de caché *Cache-First* y soporte de instalación PWA.
- **Infraestructura:** Firebase Hosting (Google Cloud Platform) con aprovisionamiento automático de SSL/TLS, compresión gzip/brotli y cabeceras de caché inmutables.

---

## 📂 Estructura del Código

```text
├── firebase.json                 # Configuración de Hosting, rewrites y cache headers
├── .firebaserc                   # Identificador del proyecto Firebase
├── package.json                  # Scripts de ejecución local y despliegue
├── master_plan_pwa.md            # Documento maestro de arquitectura y reglas
├── README.md                     # Documentación completa del proyecto
└── public/
    ├── index.html                # Interfaz de usuario semántica y accesible
    ├── style.css                 # Sistema de diseño, temas (oscuro/claro) y semáforo
    ├── app.js                    # Motor reactivo, parseo numérico y ciclo de vida PWA
    ├── manifest.json             # Manifiesto de la aplicación web instalable
    ├── service-worker.js         # Service Worker con estrategia offline Cache-First
    └── icons/                    # Recursos visuales e íconos PWA
        ├── icon.svg              # Ícono vectorial
        ├── icon-192.png          # Ícono estándar Android/PWA
        ├── icon-512.png          # Ícono de alta resolución
        └── favicon.ico           # Favicon del navegador
```

---

## 🚀 Instalación y Desarrollo Local

### Prerrequisitos
- [Node.js](https://nodejs.org/) (v18 o superior).

### 1. Clonar el repositorio
```bash
git clone git@github.com:omanvasquez/comparador-precios.git
cd comparador-precios
```

### 2. Servir localmente
Puedes utilizar cualquier servidor estático ligero:
```bash
npx serve public -l 5000
```
Abre tu navegador en: `http://localhost:5000`

### 3. Despliegue a Firebase Hosting
Si tienes acceso al proyecto de Firebase:
```bash
# Iniciar sesión en Firebase (si no lo has hecho)
npx firebase-tools login

# Desplegar a producción
npm run deploy
```

---

## 👨‍💻 Autor

Desarrollado con dedicación por **[Oman Vasquez](https://oman-vasquez.web.app/)**.

- **Sitio Web Personal:** [https://oman-vasquez.web.app](https://oman-vasquez.web.app)
- **GitHub:** [@omanvasquez](https://github.com/omanvasquez)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo para más detalles.
