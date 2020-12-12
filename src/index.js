/*
 * Variables
 * */
const mascotaInput = document.getElementById("mascota");
const propietarioInput = document.getElementById("propietario");
const telefonoInput = document.getElementById("telefono");
const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");
const sintomasInput = document.getElementById("sintomas");
const formulario = document.getElementById("nueva-cita");
const contenedorCitas = document.getElementById("citas");

/*
 * Clases
 * */
class Citas {
  // Crea en un arreglo las citas
  constructor() {
    this.citas = [];
  }

  agregarCita(cita) {
    // Agrega nueva cita al arreglo citas, por medio de citaObj
    this.citas = [...this.citas, cita];
  }
}

class UserInterface {
  // Crea HTML dinamico
  imprimirAlerta(mensaje, tipo) {
    // Imprime alerta en HTML, creando un nuevo div con clases de bootstrap
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");
    divMensaje.textContent = mensaje;

    if (tipo === "error") divMensaje.classList.add("alert-danger");
    else divMensaje.classList.add("alert-success");

    document
      .getElementById("contenido")
      .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

    setTimeout(() => {
      divMensaje.remove();
    }, 2500);
  }
}

/*
 * Instancias
 * */
const userInterface = new UserInterface();
const administrarCitas = new Citas();

/*
 * Eventos
 * */
eventListeners();
function eventListeners() {
  mascotaInput.addEventListener("input", datosCita);
  propietarioInput.addEventListener("input", datosCita);
  telefonoInput.addEventListener("input", datosCita);
  fechaInput.addEventListener("input", datosCita);
  horaInput.addEventListener("input", datosCita);
  sintomasInput.addEventListener("input", datosCita);
  formulario.addEventListener("submit", nuevaCita);
}

/*
 * Objetos literales
 * */
const citaObj = {
  // Crea objeto literal con valores vacios
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

/*
 * Funciones
 * */
function datosCita(e) {
  // Mete en los valores vacios de citaObj el value del input que escriba el user
  citaObj[e.target.name] = e.target.value;
}

function nuevaCita(e) {
  // Valida y agrega una nueva cita en la clase Citas
  e.preventDefault();

  // Extrae informacion de citaObj y la valida
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  if (
    mascota === "" ||
    propietario === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    userInterface.imprimirAlerta("Todos los campos son obligatorios", "error");
    return;
  }

  // Agrega nuevo atributo id a citaObj
  citaObj.id = Date.now();

  /* Crear nueva cita con una copia de citaObj global, sino se pasa como copia
  hay problemas cuando se crea una nueva cita */
  administrarCitas.agregarCita({ ...citaObj });

  // Reinicia el objeto citaObj para la validacion
  reiniciarObjeto();

  // Limpia formulario una vez que se agrega una cita
  formulario.reset();
}

function reiniciarObjeto() {
  // Limpia el objeto citaObj
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
}
