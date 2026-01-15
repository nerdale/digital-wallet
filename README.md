# 💰 Billetera Digital

Solución de billetera digital diseñada para gestionar activos financieros de manera segura, rápida y sencilla. Este proyecto forma parte de la evaluación integradora del Módulo 2 de Desarrollo Frontend.

## 🚀 Funcionalidades principales
La aplicación permite realizar el flujo completo de una billetera virtual:
* **Gestión de Acceso:** Login con validación de credenciales predefinidas.
* **Administración de Fondos:** Visualización de saldo actual, realización de depósitos y retiros.
* **Transferencias:** Simulación de envío de dinero a contactos registrados.
* **Agenda de Contactos:** Función para buscar y agregar nuevos contactos con validación de datos.
* **Historial Dinámico:** Registro de transacciones con filtros por tipo de movimiento (Ingresos/Gastos/Retiros).

## 🛠️ Tecnologías utilizadas
Para el desarrollo de la interfaz dinámica y responsive se emplearon las siguientes herramientas:
* **HTML5 & CSS3:** Estructura semántica y diseño personalizado con tipografía Roboto.
* **Bootstrap 5:** Framework para componentes visuales, grillas, navbars y modales.
* **JavaScript (ES6):** Lógica de negocio para transacciones y persistencia de datos en `localStorage`.
* **jQuery:** Manipulación del DOM, efectos de saldo, autocompletado y manejo de eventos.

## 📂 Estructura del proyecto
* `index.html`: Pantalla de bienvenida con acceso a login y registro.
* `login.html`: Interfaz de acceso con validación de usuario.
* `menu.html`: Dashboard con resumen de saldo y acceso rápido a funciones.
* `deposit.html`: Formulario para carga de saldo.
* `withdraw.html`: Interfaz para retiro de fondos.
* `sendmoney.html`: Gestión de envíos de dinero y contactos.
* `transactions.html`: Historial con filtros de búsqueda y categorías.
* `css/`: Hoja de estilos `style.css` con diseño personalizado.
* `js/`: Lógica centralizada en `index.js`.

## 🌳 Gestión de ramas (Git)
Se ha implementado la estrategia de ramas solicitada para organizar el desarrollo:
* `main`: Código estable y unificado.
* `feature/login`: Funcionalidad de inicio de sesión.
* `feature/transacciones`: Lógica de envíos, historial y recepción de fondos.
* `feature/depositos`: Implementación de depósitos, retiros y actualización de saldo.
* `gh-pages`: Rama dedicada al despliegue en vivo.

## 🔑 Credenciales de prueba
Para probar la aplicación, puedes utilizar los siguientes datos de acceso:
* **Usuario:** `alexandra@gmail.com`
* **Contraseña:** `123456`

---
Desarrollado como parte del desafío **Alkemy - Fundamentos del Desarrollo Front-end**.