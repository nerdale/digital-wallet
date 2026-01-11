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

/**
 * 3- procesamiento de transacciones
 */

// calcula el aumento de saldo del depósito, registra movimiento y valida que sea un monto "válido"
const realizarDeposito = (monto) => {

    if (isNaN(monto) || monto <= 0) {
        alert("Ingrese un monto válido")
        return
    }

    const nuevoSaldo = obtenerSaldo() + monto
    // nuevo saldo se guarda en memoria local
    guardarSaldo(nuevoSaldo) 
    // registra el depósito en el historial como un "ingreso"
    registrarMovimiento("Depósito realizado", monto, "ingreso")
    return monto
    alert("¡Depósito realizado con éxito!")
    
    //window.location.href = "menu.html"
}

// obtiene saldo inicial, valida contacto y monto de envío, registra saldo final post envío
const realizarEnvio = (monto, contacto) => {
    const saldoActual = obtenerSaldo() 

    if (!contacto) {
        alert("Debe seleccionar un contacto de la lista")
        return
    }
    
    if (isNaN(monto) || monto <= 0) {
        return alert("Monto no válido") 
    }

    if (monto > saldoActual) {
        return alert("Saldo insuficiente para realizar envío") 
    }

    const nuevoSaldo = saldoActual - monto 
    // nuevo saldo se guarda en memoria local
    guardarSaldo(nuevoSaldo) 
    // registra el envío en el historial como un "gasto"
    registrarMovimiento(`Envío realizado a ${contacto}`, monto, "gasto")
    alert("¡Envío realizado con éxito!")

    window.location.href = "menu.html"
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

/**
 * 4- manejo del DOM
 */

$(document).ready(function() {

    // login: escucha el formulario de inicio de sesión y obtiene datos de los inputs y se lo pasa a la función que valida el login
    const formLogin = $("#loginForm")
    if (formLogin.length) { 
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

    // muestra saldo actual al cargar la página menu.html
    const textoSaldo = document.getElementById("saldoMostrado")
    if (textoSaldo) {
        textoSaldo.innerText = `$${obtenerSaldo().toLocaleString("es-CL")} CLP`
    }

    // muestra saldo actual al cargar la página deposit.html
    const saldoDeposito = $("#saldoDeposito")
    if (saldoDeposito.length > 0) {
        saldoDeposito.text(`$${obtenerSaldo().toLocaleString("es-CL")} CLP`)
    }

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
            }
        })
    }


    // elegir un contacto de la lista para enviar dinero
    let contactoSeleccionado = ""
    const lista = document.getElementById("listaContactos")
    if (lista) {
        lista.addEventListener("click", function(e) {
            const item = e.target.closest(".list-group-item")
            if (item) {
                document.querySelectorAll(".list-group-item").forEach(li => li.classList.remove("bg-light", "border-primary", "border"))
                item.classList.add("bg-light", "border-primary", "border")
                contactoSeleccionado = item.querySelector(".fw-bold").innerText
            }
        })
    }

    // captura el monto y el contacto para hacer el envío
    const btnEnviarFinal = document.getElementById("btnEnviarDinero")
    if (btnEnviarFinal) {
        btnEnviarFinal.addEventListener("click", function() {
            const monto = parseInt(limpiarPuntos(document.getElementById("montoAEnviar").value))
            realizarEnvio(monto, contactoSeleccionado)
        })
    }

    // dibuja la lista de últimos movimientos en HTML
    const contenedor = document.getElementById("contenedorMovimientos")
    if (contenedor) {
        const historial = obtenerHistorial()
        if (historial.length === 0) {
            contenedor.innerHTML = '<li class="list-group-item text-center">No hay movimientos registrados</li>'
        } else {
            let htmlFinal = ""
            historial.forEach(item => {
                htmlFinal += `
                    <li class="list-group-item">
                        <div class="row align-items-center">
                            <div class="col-8">
                                <div class="fw-bold">${item.detalle}</div>
                                <small class="text-muted">${item.fecha}</small>
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

    const mostrarNotificacion = (mensaje) => {
        const toastElement = document.getElementById("liveToast")
        const toastBody = document.getElementById("toastMessage")

        toastBody.innerText = mensaje
        const toast = new bootstrap.Toast(toastElement)
        toast.show()
    }

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
            mostrarNotificacion("redirigiendo a Depositar")
            setTimeout(() => {
                window.location.href = "deposit.html"
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