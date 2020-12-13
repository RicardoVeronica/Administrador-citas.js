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

  // Destructuring en parametro
  imprimirCitas({ citas }) {
    // Imprime citas en HTML
    this.limpiarHTML();

    citas.forEach((cita) => {
      const {
        mascota,
        propietario,
        telefono,
        fecha,
        hora,
        sintomas,
        id,
      } = cita;

      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;
      const mascotaParrafo = document.createElement("h2");
      mascotaParrafo.classList.add("card-title", "font-weight-bolder");
      mascotaParrafo.textContent = mascota;
      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span>${propietario}
      `;
      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span>${telefono}
      `;
      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span>${fecha}
      `;
      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span>${hora}
      `;
      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Sintomas: </span>${sintomas}
      `;

      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      contenedorCitas.appendChild(divCita);

      console.log(divCita);
    });
  }

  limpiarHTML() {
    // Limpia HTML para no duplicar citas
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
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

  // Imprime el HTML de las citas, pasando el objeto
  userInterface.imprimirCitas(administrarCitas);
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
