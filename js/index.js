/**
 * 1- validación acceso login.html
 */

const intentarLogin = (email, pass) => {
    const emailCorrecto = "alexandra@gmail.com"
    const passCorrecta = "123456"

    if (email === emailCorrecto && pass === passCorrecta) {
        return true
    }
    return false
}

/*----------------------------------------------*/

/**
 * 2- lectura y guardado de datos -> saldo usuario
 */

// obtiene saldo y convierte valor número entero, el saldo por defecto de inicio es 60.000 en caso de no existir localmente un saldo guardado
const obtenerSaldo = () => parseInt(localStorage.getItem("saldoTotal")) || 60000

// guarda saldo localmente con localstorage
const guardarSaldo = (nuevoMonto) => {
    localStorage.setItem("saldoTotal", nuevoMonto.toString())
}

// obtiene lista de movimientos (depósitos y envíos) como un arreglo vacío o con datos
const obtenerHistorial = () => {
  const datosLocal = localStorage.getItem("historial")

  if (datosLocal === null) {
    return []
  }

  return JSON.parse(datosLocal)
}

// quita los puntos para evitar errores
const limpiarPuntos = (texto) => texto.toString().replace(/\./g, "")

/*----------------------------------------------*/

/**
 * 3- procesamiento de transacciones
 */

// calcula el aumento de saldo del depósito, registra movimiento y valida que sea un monto "válido"
const realizarDeposito = (monto) => {

    if (isNaN(monto) || monto <= 0) {
        alert("Ingrese un monto válido")
        return false
    }

    const nuevoSaldo = obtenerSaldo() + monto
    // nuevo saldo se guarda en memoria local
    guardarSaldo(nuevoSaldo) 
    // registra el depósito en el historial como un "ingreso"
    registrarMovimiento("Depósito realizado", monto, "ingreso")
    return monto

}

// retiro de fondos
const realizarRetiro = (monto) => {
    const saldoActual = obtenerSaldo()

    if (isNaN(monto) || monto <= 0) {
        alert("Ingrese un monto válido")
        return false
    }

    if (monto > saldoActual) {
        alert("No tiene fondos suficientes para retirar")
        return false
    }

    const nuevoSaldo = saldoActual - monto
    guardarSaldo(nuevoSaldo)
    registrarMovimiento("Retiro realizado", monto, "gasto")

    return true
}

// obtiene saldo inicial, valida contacto y monto de envío, registra saldo final post envío
const realizarEnvio = (monto, contacto) => {
    const saldoActual = obtenerSaldo() 

    if (!contacto) {
        alert("Debe seleccionar un contacto de la lista")
        return false
    }
    
    if (isNaN(monto) || monto <= 0) {
        alert("Monto no válido")
        return false
    }

    if (monto > saldoActual) {
        alert("Saldo insuficiente para realizar envío")
        return false
    }

    const nuevoSaldo = saldoActual - monto 
    // nuevo saldo se guarda en memoria local
    guardarSaldo(nuevoSaldo) 
    // registra el envío en el historial como un "gasto"
    registrarMovimiento(`Envío realizado a ${contacto}`, monto, "gasto")

    return true
}

// creación objeto de la transacción con signo (+/-), color y fecha
const registrarMovimiento = (detalle, monto, tipo) => {
    const historial = obtenerHistorial()
    
    // estructura de datos para últimos movimientos con formato peso chileno y color según es envío o depósito
    const nuevaTransaccion = {
        detalle: detalle,
        monto: `${tipo === "gasto" ? "-" : "+"}$${monto.toLocaleString("es-CL")}`,
        clase: tipo === "gasto" ? "text-danger" : "text-success",
        fecha: new Date().toLocaleString("es-CL")
    }
    // objeto queda de los primeros en la lista
    historial.unshift(nuevaTransaccion)
    // guarda últimos movimientos localmente con localstorage
    localStorage.setItem("historial", JSON.stringify(historial))
}

// validación contacto nuevo
const validarDatosContacto = (nombre, cbu, alias, banco) => {
    if (nombre === "" || cbu === "" || alias === "" || banco === "") {
        return false
    }
    if (isNaN(cbu) || cbu.length !== 9) {
        return false
    }
    
    return true
}

// buscador de contacto
const matchBusqueda = (elementoLi, palabraClave) => {
    const textoContacto = elementoLi.textContent.toLowerCase()
    const busqueda = palabraClave.toLowerCase()
    return textoContacto.includes(busqueda)
}

// obtiene el tipo de transaccion
const getTipoTransaccion = (tipo) => {
    if (tipo === "gasto") {
        return "Envío / Compra / Retiro"
    } else {
        return "Depósito / Transferencia"
    }
}

// filtrar historial por tipo de movimiento/transaccion
const filtrarHistorial = (historial, filtro) => {
    if (filtro === "todos") {
        return historial
    }
    
    return historial.filter(montoMovimiento => {
        if (filtro === "gasto") {
            return montoMovimiento.clase === "text-danger"
        } else {
            return montoMovimiento.clase === "text-success"
        }
    })
}

/*----------------------------------------------*/

/**
 * 4- manejo del DOM
 */

$(document).ready(function() {

    const animarSaldo = (selector) => {
        $(selector)
            .animate({fontSize: "2.5rem", opacity: 0.5 }, 500)
            .animate({fontSize: "2rem", opacity: 1 }, 500)
    }

    /* LOGIN */
    const formLogin = $("#loginForm")
    if (formLogin) { 
        formLogin.submit(function(e) {
            e.preventDefault()
            const email = $("#emailInput").val()
            const pass = $("#passwordInput").val()
            const esValido = intentarLogin(email, pass)

            if(esValido === true) {
                formLogin.before(`
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>¡Inicio de sesión realizado con éxito!</strong> Redirigiendo al menú...
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `)
                
                setTimeout(() => {
                    window.location.href = "menu.html"
                }, 1500)
            } else {
                formLogin.before(`
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> Correo o contraseña incorrectos. Intente nuevamente
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `)
            }
        })
    }

    /* VISUALIZACION SALDO */

    // muestra saldo actual al cargar la página menu.html
    const textoSaldo = $("#saldoMostrado")
    if (textoSaldo) {
        textoSaldo.text(`$${obtenerSaldo().toLocaleString("es-CL")} CLP`)
        animarSaldo("#saldoMostrado")
    }

    // muestra saldo actual al cargar la página deposit.html
    const saldoDeposito = $("#saldoDeposito")
    if (saldoDeposito) {
        saldoDeposito.text(`$${obtenerSaldo().toLocaleString("es-CL")} CLP`)
        
    }

    // muestra saldo inicial al cargar la página withdraw.html (retiro de fondos)
    const saldoRetiro = $("#saldoRetiro")
    if (saldoRetiro) {
        saldoRetiro.text(`$${obtenerSaldo().toLocaleString("es-CL")} CLP`)
    }

    /* DEPOSITO DE DINERO */

    // captura el monto ingresado para hacer depósito y ejecuta la función que realiza el deposito
    const formDepo = $("#formularioDeposito")
    if (formDepo) {
        formDepo.on("submit", function(e) {
            e.preventDefault()
            const monto = parseInt(limpiarPuntos($("#montoIngresado").val()))
            const resultadoMonto = realizarDeposito(monto)

            if (resultadoMonto) {
                $(".confirmacion-deposito").remove()
                formDepo.after(`
                    <div class="confirmacion-deposito mt-3 p-3 rounded text-center bg-dark text-white">
                        <strong>Confirmación:</strong> Has depositado exitosamente $${resultadoMonto.toLocaleString("es-CL")} CLP.
                    </div>
                `)
                
                $("#montoIngresado").val("")
                setTimeout(() => {
                    window.location.href = "menu.html"
                }, 2000)
            } else {
                console.error("Operación fallida")
            }
        })
    }

    /* RETIRO DE FONDOS */

    // formulario retiro de fondos
    const formRetiro = document.getElementById("formularioRetiro")
    if (formRetiro) {
        formRetiro.addEventListener("submit", function (e) {
            e.preventDefault()

            const inputMonto = document.getElementById("montoARetirar")
            const monto = parseInt(limpiarPuntos(inputMonto.value || "0"))

            if (realizarRetiro(monto)) {
                const nuevoSaldo = obtenerSaldo()
                saldoRetiro.text(`$${nuevoSaldo.toLocaleString("es-CL")}`)
                mostrarNotificacion("Retiro realizado con éxito")
                inputMonto.value = ""
            } else {
                console.error("Operación fallida")
            }
        })
    }

    /* ENVIO DE DINERO */

    // elegir un contacto de la lista para enviar dinero
    let contactoSeleccionado = ""
    const lista = document.getElementById("listaContactos")
    const btnEnviarDinero = document.getElementById("btnEnviarDinero")
    if (lista) {
        lista.addEventListener("click", function(e) {
            const item = e.target.closest(".list-group-item")
            if (item) {
                document.querySelectorAll(".list-group-item").forEach(li => li.classList.remove("bg-light", "border-primary", "border"))
                item.classList.add("bg-light", "border-primary", "border")
                contactoSeleccionado = item.querySelector(".fw-bold").innerText
                if (btnEnviarDinero) {
                    btnEnviarDinero.classList.remove("d-none")
                }
            }
        })
    }

    // guardar contacto nuevo que se agrega desde sendmoney.html
    const btnGuardarContacto = document.getElementById("btnGuardarContacto")
    if (btnGuardarContacto) {
        btnGuardarContacto.addEventListener("click", function () {
            const nombre = document.getElementById("nombreContacto").value
            const cbu = document.getElementById("cbuContacto").value
            const alias = document.getElementById("aliasContacto").value
            const banco = document.getElementById("bancoContacto").value

            if (validarDatosContacto(nombre, cbu, alias, banco)) {
                const lista = document.getElementById("listaContactos")
                const nuevoContacto = `
                        <li class="list-group-item">
                            <p class="fw-bold">${nombre}</p>
                            <p class="d-inline">CBU: ${cbu}</p> <span>|</span>
                            <p class="d-inline">Alias: ${alias}</p> <span>|</span>
                            <p class="d-inline">Banco: ${banco}</p>
                        </li>
                        `
                lista.innerHTML += nuevoContacto
                document.getElementById("formularioNuevoContacto").reset()
                bootstrap.Modal.getInstance(document.getElementById("modalAgregarContacto")).hide()
            } else {
                alert("Datos inválidos: Asegúrese de llenar todos los campos y que el CBU tenga 9 números.")
            }
        })
    }

    // captura el monto y el contacto para hacer el envío
    const btnEnviarFinal = document.getElementById("btnEnviarDinero")
    if (btnEnviarFinal) {
        btnEnviarFinal.addEventListener("click", function() {
            const monto = parseInt(limpiarPuntos(document.getElementById("montoAEnviar").value))
            const exito = realizarEnvio(monto, contactoSeleccionado)
            const inputMonto = document.getElementById("montoAEnviar")

            if (exito) {
                mostrarNotificacion(`¡Envío realizado con éxito!`)
                inputMonto.value = ""
                btnEnviarFinal.classList.add("d-none")
            }
        })
    }

    // match en buscador de contacto
    const formBusqueda = document.querySelector("form.mb-3")
    if (formBusqueda) {
        formBusqueda.addEventListener("submit", function(e) {
            e.preventDefault()
            const inputBusqueda = formBusqueda.querySelector('input[placeholder="Buscar contacto"]')
            const palabraClave = inputBusqueda.value
            const contactos = document.querySelectorAll("#listaContactos .list-group-item")

            contactos.forEach(contacto => {
                if (matchBusqueda(contacto, palabraClave)) {
                    contacto.style.display = "block"
                } else {
                    contacto.style.display = "none"
                }
            })
        })
    }

    // autocompletado buscador contactos
    $(document).on("keyup", "#buscarContacto", function() {
        const valorBusqueda = $(this).val().toLowerCase()
        
        $("#listaContactos .list-group-item").each(function() {
            const nombreContacto = $(this).text().toLowerCase()
            
            if (nombreContacto.includes(valorBusqueda) && valorBusqueda !== "") {
                $(this).addClass("bg-light").show()
            } else if (valorBusqueda === "") {
                $(this).removeClass("bg-light").show()
            } else {
                $(this).hide()
            }
        })
    })

    $(document).on("click", "#listaContactos .list-group-item", function() {
        const nombreSeleccionado = $(this).text().trim()   
        $("#buscarContacto").val(nombreSeleccionado)
        $("#btnEnviarDinero").removeClass("d-none")
    })

    /* ULTIMOS MOVIMIENTOS */

    // dibujar historial movimientos
    const renderizarListaMovimientos = (filtro) => {
        const contenedor = document.getElementById("contenedorMovimientos")
       
        if (contenedor) {
            const historialCompleto = obtenerHistorial()
            const historialFiltrado = filtrarHistorial(historialCompleto, filtro)

            if (historialFiltrado.length === 0) {
                contenedor.innerHTML = '<li class="list-group-item text-center">No hay movimientos registrados</li>'
            } else {
                let htmlFinal = ""

                historialFiltrado.forEach(item => {
                    let tipoOriginal = ""
                    if (item.clase === "text-danger") {
                        tipoOriginal = "gasto"
                    } else {
                        tipoOriginal = "ingreso"
                    }
                    
                    const tipoLegible = getTipoTransaccion(tipoOriginal)

                    htmlFinal += `
                        <li class="list-group-item">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <div class="fw-bold">${item.detalle}</div>
                                    <small class="text-muted">${tipoLegible} - ${item.fecha}</small>
                                </div>
                                <div class="col-4 text-end">
                                    <span class="${item.clase} fw-bold">${item.monto}</span>
                                </div>
                            </div>
                        </li>`
                })
                contenedor.innerHTML = htmlFinal
            }
        }
    }

    // filtro con jquery en ultimos movimientos
    const filtroSelect = $("#filtroTipo")
    if (filtroSelect.length > 0) {
        renderizarListaMovimientos("todos") 

        filtroSelect.on("change", function() {
            const valor = $(this).val()
            renderizarListaMovimientos(valor) 
        })
    }

    /* NOTIFICACIONES TOAST BOOTSTRAP */

    // notificaciones con toast de bootstrap
    const mostrarNotificacion = (mensaje) => {
        const toastElement = document.getElementById("liveToast")
        const toastBody = document.getElementById("toastMessage")

        toastBody.innerText = mensaje
        const toast = new bootstrap.Toast(toastElement)
        toast.show()
    }

    /* BOTONES DEPOSITAR, ENVIAR DINERO, RETIRAR FONDOS, ULTIMOS MOVIMIENTOS */

    // configuración botones redireccionando
    const btnDepositar = document.getElementById("btnDepositar")
    if (btnDepositar) {
        btnDepositar.addEventListener("click", () => {
            mostrarNotificacion("redirigiendo a Depositar")
            setTimeout(() => {
                window.location.href = "deposit.html"
            }, 1000)
        })
    }

    const btnEnviar = document.getElementById("btnEnviar")
    if (btnEnviar) {
        btnEnviar.addEventListener("click", () => {
            mostrarNotificacion("redirigiendo a Enviar Dinero")
            setTimeout(() => {
                window.location.href = "sendmoney.html"
            }, 1000)
        })
    }

    const btnRetirarFondos = document.getElementById("btnRetirar")
    if (btnRetirarFondos) {
        btnRetirarFondos.addEventListener("click", () => {
            mostrarNotificacion("redirigiendo a Retiro de fondos")
            setTimeout(() => {
                window.location.href = "withdraw.html"
            }, 1000)    
        })
    }

    const btnMovimientos = document.getElementById("btnMovimientos")
    if (btnMovimientos) {
        btnMovimientos.addEventListener("click", () => {
            mostrarNotificacion("redirigiendo a Últimos Movimientos")
            setTimeout(() => {
                window.location.href = "transactions.html"
            }, 1000)
        })
    }
})