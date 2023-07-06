class Usuario {
    constructor(id, nombre, username, pass) {
        this.id = id;
        this.nombre = nombre;
        this.username = username;
        this.pass = pass;
        this.activo = true;
        this.saldo = 0;
    }
}

// CARGA DATOS PARA PRUEBAS

let usuariosAlmacenados = JSON.parse(localStorage.getItem("listaUsr"));
//obtengo usrs almacenados en LS, si no hay creo datos de prueba...

if (!usuariosAlmacenados) {
    let usuarios = [];
    usuarios.push(new Usuario(0, "Pedro Sanchez", "pepe", "1234"));
    usuarios.push(new Usuario(1, "Juan Gomez", "juango", "abcd"));
    usuarios.push(new Usuario(2, "Carlos Torres", "carlos77", "0987"));
    usuarios.push(new Usuario(3, "Gonzalo Bueno", "bocha22", "hola"));
    usuarios.push(new Usuario(4, "Mark Zuckerberg", "jslover", "pepe"));
    localStorage.setItem("listaUsr", JSON.stringify(usuarios));
} else {
    console.log("usuarios ya persistidos de manera local");
}

// FIN CARGA DATOS

let intentos = 3;

// chequeo si es la pag LOGIN cargo eventos y form Login por defecto
if (document.title === "PuraSangre Fitcross - Log In") {
    cargarFormularioLogin();
}

// chequeo si el usuario esta cargado en session o local y modifico el DOM (info usuario)
if (document.title === "PuraSangre Fitcross - Inicio") {
    cargarUsuario();
}

if (document.title === "PuraSangre Fitcross - Renovar Pase") {
    cargarUsuario();
    cargarPlanes();
}

function cargarUsuario() {
    // capturo los elementos usuario
    let usrMenu = document.getElementById("usrNav");
    let usr;
    localStorage.getItem("usrLog") != null ? usr = JSON.parse(localStorage.getItem("usrLog")) : usr = JSON.parse(sessionStorage.getItem("usrLog"));

    // if (localStorage.getItem("usrLog") != null) {
    //     usr = JSON.parse(localStorage.getItem("usrLog"));
    // } else {
    //     usr = JSON.parse(sessionStorage.getItem("usrLog"));
    // }
    usrMenu.innerText = usr.username;
}

// cargo usuarios almacenados en storage y compruebo si existe ese usr...
function validarUsuario(username, pass) {
    let usuarios = JSON.parse(localStorage.getItem("listaUsr"));
    let usuario = usuarios.find((usr) => usr.username == username && usr.pass == pass);
    if (usuario != null) {
        console.log("usr encontrado " + usuario.username);
        return usuario;
    }
    console.log("usr NO encontrado")
    return null;
}

function logIn() {
    if (intentos > 0) {
        let username = document.getElementById("formEmail");
        let pass = document.getElementById("formPass");
        let recordar = document.getElementById("formRecordarme");

        // chequeo de campos vacios
        if (username.value != "" && pass.value != "") {

            let usr = validarUsuario(username.value, pass.value);
            if (usr != null) {

                // si está activado recordar guardo local sino session
                if (recordar.checked == true) {
                    localStorage.setItem("usrLog", JSON.stringify(usr));
                } else {
                    sessionStorage.setItem("usrLog", JSON.stringify(usr));
                }

                //redirecciono a menu principal
                window.open("./principal.html", "_self");

            } else {
                intentos = intentos - 1;
                Swal.fire({
                    icon: 'error',
                    title: 'PuraSangre Fitcross',
                    text: 'Usuario o contraseña incorrectas, le quedan ' + intentos + ' intentos',
                    confirmButtonColor: '#D7041B'
                })
                username.value = "";
                pass.value = "";
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: 'PuraSangre Fitcross',
                text: 'debe completar los campos email y contraseña',
                showConfirmButton: false,
                timer: 2500
            })
        }
    }
}

// carga el formulario con los componentes para Login
function cargarFormularioLogin() {
    if (document.getElementById("divNueva") != null) {
        console.log("cheqeando que este creada la div nueva cuando cargo form registro");
        let divBorrar = document.getElementById("divNueva");
        divBorrar.remove();
    }
    let form = document.getElementById("form");
    let divNueva = document.createElement("div");
    divNueva.id = ("divNueva");
    divNueva.innerHTML = `  <!-- Email input -->
                            <div class="form-outline mb-2">
                                <input type="email" id="formEmail" class="form-control" />
                                <label class="form-label" for="formEmail">Email</label>
                            </div>

                            <!-- Password input -->
                            <div class="form-outline mb-2">
                                <input type="password" id="formPass" class="form-control" />
                                <label class="form-label" for="formPass">Contraseña</label>
                            </div>

                            <!-- 2 column grid layout for inline styling -->
                            <div class="row mb-2">
                                <div class="col d-flex justify-content-center">
                                    <!-- Checkbox -->
                                    <div class="form-check">
                                        <label class="container">Recordarme
                                            <input id="formRecordarme" type="checkbox" checked="checked">
                                            <span class="checkmark"></span>
                                        </label>
                                    </div>
                                </div>

                                <div class="col d-flex justify-content-center">
                                    <!-- Simple link -->
                                    <a id="linkPass" class="linkForm" href="#">Olvidó su contraseña?</a>
                                </div>
                            </div>

                            <!-- Submit button -->
                            <button id="btnLogIn" type="button" class="text-center btn btnEnviar btn-block mb-2">Iniciar Sesión</button>

                            <!-- Register buttons -->
                            <div class="text-center">
                                <p>No estás registrado? <a id="linkRegistro" href="#" class="linkForm">Registrarme</a></p>
                            </div>`;
    form.append(divNueva);
    let btnLogIn = document.getElementById("btnLogIn");
    btnLogIn.addEventListener("click", logIn);
    let linkRegistro = document.getElementById("linkRegistro");
    linkRegistro.addEventListener("click", cargarFormularioRegistro);
    let linkPass = document.getElementById("linkPass");
    linkPass.addEventListener("click", cargarFormularioRecuperarPass);
}

// carga el formulario con los componentes para Registrar Usuario
function cargarFormularioRegistro() {
    let divBorrar = document.getElementById("divNueva");
    divBorrar.remove();
    let form = document.getElementById("form");
    let divNueva = document.createElement("div");
    divNueva.id = ("divNueva");
    divNueva.innerHTML = `  <!-- Nombre input -->
                            <div class="form-outline mb-2">
                                <input type="text" id="formNombre" class="form-control" />
                                <label class="form-label" for="formNombre">Nombre</label>
                            </div>
                            
                            <!-- Email input -->
                            <div class="form-outline mb-2">
                                <input type="email" id="formEmail" class="form-control" />
                                <label class="form-label" for="formEmail">Email</label>
                            </div>

                            <!-- Password input -->
                            <div class="form-outline mb-2">
                                <input type="password" id="formPass" class="form-control" />
                                <label class="form-label" for="formPass">Contraseña</label>
                            </div>

                            <!-- Repertir Password input -->
                            <div class="form-outline mb-2">
                                <input type="password" id="formRepePass" class="form-control" />
                                <label class="form-label" for="formRepePass"> Repetir Contraseña</label>
                            </div>

                            <!-- Submit button -->
                            <button id="btnRegistro" type="button" class="text-center btn btnEnviar btn-block mb-2">Registrarme</button>

                            <!-- Register buttons -->
                            <div class="text-center">
                                <p>Ya tenes cuenta? <a id="linkLogin" href="#" class="linkForm">Iniciar Sesión</a></p>
                            </div>`;
    form.append(divNueva);
    let btnRegistro = document.getElementById("btnRegistro");
    btnRegistro.addEventListener("click", realizarRegistro);
    let linkLogin = document.getElementById("linkLogin");
    linkLogin.addEventListener("click", cargarFormularioLogin);
}

// captura los campos ingresados y da de alta el nuevo usuario
function realizarRegistro() {
    let nombre = document.getElementById("formNombre");
    let email = document.getElementById("formEmail");
    let pass = document.getElementById("formPass");
    let repePass = document.getElementById("formRepePass");

    // chequeo campos vacios
    if (nombre.value != "" && email.value != "" && pass.value != "" && repePass.value != "") {
        // chequeo contraseñas iguales
        if (pass.value === repePass.value) {
            let usuarios = JSON.parse(localStorage.getItem("listaUsr"));
            // chequeo que el mail no se encuentre registrado...
            if (usuarios.find((usr) => usr.username == email.value) == null) {
                console.log("no encuentro usuario igual");
                let usuarios = JSON.parse(localStorage.getItem("listaUsr"));
                // console.log(usuarios.length + 1);
                let usr = new Usuario(usuarios.length, nombre.value, email.value, pass.value);
                usuarios.push(usr);
                localStorage.setItem("listaUsr", JSON.stringify(usuarios));
                Swal.fire({
                    icon: 'success',
                    title: 'PuraSangre Fitcross',
                    text: 'Usuario registrado correctamente',
                    confirmButtonColor: '#D7041B'
                });
                nombre.value = "";
                email.value = "";
                pass.value = "";
                repePass.value = "";
                cargarFormularioLogin();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'PuraSangre Fitcross',
                    text: 'El usuario ya se encuentra registrado',
                    confirmButtonColor: '#D7041B'
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'PuraSangre Fitcross',
                text: 'Las contraseñas ingresadas no coinciden',
                confirmButtonColor: '#D7041B'
            });
            pass.value = "";
            repePass.value = "";
        }
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'PuraSangre Fitcross',
            text: 'debe completar todos los campos',
            showConfirmButton: false,
            timer: 2500
        });
    }
}

// pensado para desarrollar a futuro de alguna manera segura...
function cargarFormularioRecuperarPass() {
    Swal.fire({
        icon: 'error',
        title: 'PuraSangre Fitcross',
        text: 'no se encuentra disponible esta función',
        showConfirmButton: false,
        timer: 2500
    });
}

// carga los planes de entrenamiento del archivo JSON local
async function cargarPlanes() {
    let contenedorPlanes = document.getElementById("contenedorPlanes");
    const resp = await fetch('./planes.json');
    const planes = await resp.json();
    planes.forEach(plan => {
        let contenedor = document.createElement("div");
        contenedor.innerHTML = `<div class="col mt-3">
                                    <div class="card bg-dark">
                                        <img src="./assets/img/logoBlanco.png" class="card-img-top" alt="logo PuraSangre">
                                        <div class="card-body">
                                            <h2 class="card-title">${plan.titulo}</h2>
                                            <p>$ ${plan.precio}</p>
                                            <a id="${plan.id}" href="#" class="btnComprar btn btn-danger btnCard">Comprar</a>
                                        </div>
                                    </div>
                                </div>`
        contenedorPlanes.append(contenedor);
    });

    // capturo todos los botones de las cards de compra de clases
    const botonesComprar = document.getElementsByClassName("btnComprar");

    // captura id de boton presionado y en func de eso asigna la cant de clases correspondientes...
    const botonPresionado = e => {
        let recarga = 0;
        switch (`${e.target.id}`) {
            case "1":
                recarga = 4;
                mensajeDeCompra("4");
                break;
            case "2":
                recarga = 8;
                mensajeDeCompra("8");
                break;
            case "3":
                recarga = 12;
                mensajeDeCompra("12");
                break;
            case "4":
                recarga = 16;
                mensajeDeCompra("16");
                break;
            case "5":
                recarga = 28;
                mensajeDeCompra("28");
                break;
            case "6":
                recarga = 28;
                mensajeDeCompra("28 clases plus");
                break;

        }

        let usuario;
        // chequeo donde esta almacenado el usuario logueado y le asigno la cant de clases compradas
        if (JSON.parse(localStorage.getItem("usrLog")) != null) {
            usuario = JSON.parse(localStorage.getItem("usrLog"));
            usuario.saldo += recarga;
            localStorage.setItem("usrLog", JSON.stringify(usuario));
        } else {
            usuario = JSON.parse(sessionStorage.getItem("usrLog"));
            usuario.saldo += recarga;
            sessionStorage.setItem("usrLog", JSON.stringify(usuario));
        }

    }

    // asigno el evento click a cada boton comprar de las card y le asigno botonPresionado...
    for (let boton of botonesComprar) {
        boton.addEventListener("click", botonPresionado);
    }
}

// funcion que muestra la cantidad de clases compradas recibida por parametro, para reutilizar codigo... 
function mensajeDeCompra(nroClases) {
    Swal.fire({
        icon: 'success',
        title: 'PuraSangre Fitcross',
        text: 'compra de ' + nroClases + ' clases efectuada con éxito',
        confirmButtonColor: '#D7041B'
    });
}
