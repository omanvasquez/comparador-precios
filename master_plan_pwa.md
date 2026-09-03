# Master Plan: PWA - Calculadora de Ahorro Real y Liquidez

## 1. Objetivo Principal y Filosofía
Esta no es una simple calculadora. Es una herramienta de toma de decisiones financieras a microescala diseñada para combatir la reduflación y optimizar la liquidez en las compras diarias. El objetivo es determinar matemáticamente el precio real (por unidad de medida estándar) de dos productos con presentaciones engañosas y emitir un veredicto frío y objetivo sobre si el ahorro justifica el desembolso de capital.

## 2. Lógica de Negocio (El Core)
El motor de la aplicación se basa en la estandarización a 1.000 gramos o 1.000 mililitros.

**Fórmula Base:**
`Precio Estandarizado (Bs/kg o Bs/L) = (Precio / Cantidad) * 1000`

**Cálculo de Rendimiento/Ahorro:**
`% Ahorro = ((Precio Mayor - Precio Menor) / Precio Mayor) * 100`

**Matriz de Decisión (El Abogado del Diablo):**
- **Rojo (< 4% de ahorro):** Ahorro basura/engañoso. Recomendación: Proteger la liquidez. Comprar la opción que requiera menor desembolso inmediato (el empaque más barato en valor absoluto).
- **Amarillo (4% - 10% de ahorro):** Ahorro moderado. Recomendación: Comprar el de mayor volumen solo si el flujo de caja actual lo permite sin sacrificar otras compras.
- **Verde (> 10% de ahorro):** Ahorro real y contundente. Recomendación: Comprar la opción ganadora (menor costo por kilo), asumiendo que el producto no tiene riesgo de caducidad o merma por almacenamiento.

## 3. Arquitectura y Stack Tecnológico
La herramienta debe ser una **Progressive Web App (PWA) Offline-First**. No puede depender de conexión a internet para realizar los cálculos, garantizando operatividad en zonas con mala cobertura (ej. supermercados cerrados).

*   **Frontend:** Interfaz reactiva (HTML/CSS/JS vanilla o framework ligero compatible con PWA).
*   **Backend / Infraestructura:** Firebase.
    *   **Firebase Hosting:** Para el despliegue rápido y aprovisionamiento del certificado SSL (obligatorio para Service Workers).
    *   **PWA Configuration:** Service Worker robusto para cachear los assets principales (`index.html`, estilos, scripts) y un `manifest.json` configurado (íconos, `display: standalone`, colores de tema).

## 4. Requisitos de UI/UX
*   **Modo Oscuro por defecto:** Para reducir fatiga visual y ahorrar batería en los dispositivos.
*   **Reactividad en tiempo real:** Cero botones de "Calcular". El DOM debe actualizarse on-input (mientras el usuario teclea).
*   **Teclados Optimizados:** Los inputs deben invocar teclados numéricos (`inputmode="decimal"` para precios y `inputmode="numeric"` para gramos).
*   **Botones Rápidos (Chips):** Para minimizar fricción, debajo de cada input de peso deben existir chips de autocompletado para medidas estándar (ej. 250g, 500g, 900g, 1000g).

## 5. Fases de Ejecución para el Agente (Antigravity)
1.  **Setup PWA:** Crear la estructura de carpetas, `index.html`, `manifest.json` y `service-worker.js`.
2.  **Desarrollo UI/Algoritmo:** Implementar el grid comparativo y la lógica matemática descrita en la Sección 2.
3.  **Integración Firebase:** Inicializar el proyecto en Firebase (CLI), configurar el target de Hosting y preparar los scripts de despliegue.
4.  **Testing Offline:** Verificar que el Service Worker intercepta las peticiones y sirve la calculadora sin conexión.
5.  **Despliegue Final:** Hacer deploy a Firebase Hosting y entregar las URLs de producción.
