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
let editando;
let DB;

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

  eliminarCita(id) {
    // Elimina cita por id
    this.citas = this.citas.filter((cita) => cita.id !== id);
  }

  editarCita(citaActualizada) {
    // Edita la cita
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
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

  imprimirCitas() {
    // Imprime citas en HTML

    // Limpia duplicados por appendChild
    this.limpiarHTML();

    // lee el contenido de indexedDB
    const objectStore = DB.transaction("citas").objectStore("citas");

    objectStore.openCursor().onsuccess = function (e) {
      const cursor = e.target.result;

      if (cursor) {
        const {
          mascota,
          propietario,
          telefono,
          fecha,
          hora,
          sintomas,
          id,
        } = cursor.value;

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
        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn", "btn-danger", "mr-2");
        btnEliminar.textContent = "Eliminar";
        btnEliminar.onclick = () => {
          eliminarCita(id);
        };
        const btnEditar = document.createElement("button");
        btnEditar.classList.add("btn", "btn-info", "mr-2");
        btnEditar.textContent = "Editar";
        const cita = cursor.value;
        btnEditar.onclick = () => cargarEdicion(cita);

        divCita.appendChild(mascotaParrafo);
        divCita.appendChild(propietarioParrafo);
        divCita.appendChild(telefonoParrafo);
        divCita.appendChild(fechaParrafo);
        divCita.appendChild(horaParrafo);
        divCita.appendChild(sintomasParrafo);
        divCita.appendChild(btnEliminar);
        divCita.appendChild(btnEditar);
        contenedorCitas.appendChild(divCita);

        // Itera siguiente elemento
        cursor.continue();
      }
    };
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
window.onload = () => {
  eventListeners();

  // Crea base de datos en IndexedDB
  crearDB();
};

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

  if (editando) {
    userInterface.imprimirAlerta("Editado correctamente");

    administrarCitas.editarCita({ ...citaObj });

    // Edita el indexedDB
    const transaction = DB.transaction(["citas"], "readwrite");
    const objectStore = transaction.objectStore("citas");

    objectStore.put(citaObj);

    transaction.oncomplete = () => {
      formulario.querySelector("button[type='submit']").textContent =
        "Crear cita";

      editando = false;
    };

    transaction.onerror = () => {
      console.log("Error al guardar la edicion de la cita en indexedDB");
    };
  } else {
    // Agrega nuevo atributo id a citaObj
    citaObj.id = Date.now();

    /* Crear nueva cita con una copia de citaObj global, sino se pasa como copia
  hay problemas cuando se crea una nueva cita */
    administrarCitas.agregarCita({ ...citaObj });

    // Inserta la nueva cita en IndexedDB
    const transaction = DB.transaction(["citas"], "readwrite");

    // Habilita base de datos citas
    const objectStore = transaction.objectStore("citas");

    // Agrega objeto cita a la DB
    objectStore.add(citaObj);

    transaction.oncomplete = () => {
      console.log("Cita agregada");

      // Imprime alerta de success
      userInterface.imprimirAlerta("Se agrego correctamente");
    };
  }

  // Reinicia el objeto citaObj para la validacion
  reiniciarObjeto();

  // Limpia formulario una vez que se agrega una cita
  formulario.reset();

  // Imprime el HTML de las citas, pasando el objeto
  userInterface.imprimirCitas();
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

function eliminarCita(id) {
  // Elimina cita
  administrarCitas.eliminarCita(id);

  // Imprime mensaje
  userInterface.imprimirAlerta("La cita se elimino correctamente");

  // Imprime citas
  userInterface.imprimirCitas();
}

function cargarEdicion(cita) {
  // Carga los datos de la cita y activa el modo edicion
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  // Llena el HTML
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // Llena el objeto cita
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  formulario.querySelector("button[type='submit']").textContent =
    "Guardar cambios";

  editando = true;
}

function crearDB() {
  // Crea base de datos en IndexedDB
  const crearDB = window.indexedDB.open("citas", 1);

  // Error
  crearDB.onerror = () => console.log("Error al crear indexedDB");

  // Success
  crearDB.onsuccess = () => {
    console.log("IndexedDB creada");
    DB = crearDB.result; // e.target.result

    // Mostrar citas, indexedDB ya esta listo
    userInterface.imprimirCitas();
  };

  // Definir schema
  crearDB.onupgradeneeded = (e) => {
    const db = e.target.result;
    const objectStore = db.createObjectStore("citas", {
      keyPath: "id", // primary key
      autoIncrement: true,
    });

    // Definir columnas
    objectStore.createIndex("mascota", "mascota", { unique: false });
    objectStore.createIndex("propietario", "propietario", { unique: false });
    objectStore.createIndex("telefono", "telefono", { unique: false });
    objectStore.createIndex("fecha", "fecha", { unique: false });
    objectStore.createIndex("hora", "hora", { unique: false });
    objectStore.createIndex("sintomas", "sintomas", { unique: false });
    objectStore.createIndex("id", "id", { unique: true });

    console.log("DB lista para hacer storage");
  };
}
