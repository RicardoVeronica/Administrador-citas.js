const formulario = document.getElementById("nueva-cita");
const mascotaInput = document.getElementById("mascota");
const propietarioInput = document.getElementById("propietario");
const telefonoInput = document.getElementById("telefono");
const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");
const sintomasInput = document.getElementById("sintomas");
const contenedorCitas = document.getElementById("citas");
let editando;

class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita];
  }

  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id);
  }

  editarCita(citaActualizada) {
    this.citas = this.citas.map((cita) =>
      cita.id === citaActualizada.id ? citaActualizada : cita
    );
  }
}

class UserInterface {
  imprimirAlerta(msj, tipo) {
    const divMsj = document.createElement("div");
    divMsj.classList.add("text-center", "alert", "d-block", "col-12");
    divMsj.textContent = msj;

    tipo === "error"
      ? divMsj.classList.add("alert-danger")
      : divMsj.classList.add("alert-success");

    document
      .getElementById("contenido")
      .insertBefore(divMsj, document.querySelector(".agregar-cita"));

    setTimeout(() => {
      divMsj.remove();
    }, 2500);
  }

  imprimirCitas({ citas }) {
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
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;
      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Telefono: </span> ${telefono}
      `;
      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span> ${fecha}
      `;
      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span> ${hora}
      `;
      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Sintomas: </span> ${sintomas}
      `;
      const btnDelete = document.createElement("button");
      btnDelete.textContent = "Eliminar";
      btnDelete.classList.add("btn", "btn-danger", "mr-2");
      btnDelete.onclick = () => eliminarCita(id);
      const btnPatch = document.createElement("button");
      btnPatch.textContent = "Editar";
      btnPatch.classList.add("btn", "btn-info");
      btnPatch.onclick = () => cargarEdicion(cita);

      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnDelete);
      divCita.appendChild(btnPatch);
      contenedorCitas.appendChild(divCita);
    });
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

// Instancias
const administrarCitas = new Citas();
const userInterface = new UserInterface();

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

// Objeto de cita
const citaObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

// Funciones
function datosCita(e) {
  e.preventDefault();
  citaObj[e.target.name] = e.target.value; // lee el atributo name del html
}

function nuevaCita(e) {
  // Valida fromulario para agregar citas
  e.preventDefault();

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
    userInterface.imprimirAlerta("Editado correctamente", "success");
    administrarCitas.editarCita({ ...citaObj });
    formulario.querySelector('button[type="submit"]').textContent =
      "Crear cita";
    editando = false;
  } else {
    citaObj.id = Date.now(); // agrega id
    administrarCitas.agregarCita({ ...citaObj }); // nueva cita en objeto
    userInterface.imprimirAlerta("Se agrego correctamente", "success");
  }

  reiniciarObjeto(); // reinicia objeto para validacion

  formulario.reset();

  userInterface.imprimirCitas(administrarCitas); // imprime citas en html
}

function reiniciarObjeto() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
}

function eliminarCita(id) {
  administrarCitas.eliminarCita(id);
  userInterface.imprimirAlerta("La cita se elimino correctamente", "success");
  userInterface.imprimirCitas(administrarCitas);
}

function cargarEdicion(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

  // llena inputs del formulario
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // llena objeto
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  // cambia texto de boton
  formulario.querySelector('button[type="submit"]').textContent =
    "Guardar cambios";

  editando = true;
}
