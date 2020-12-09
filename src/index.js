const formulario = document.getElementById("nueva-cita");
const mascotaInput = document.getElementById("mascota");
const propietarioInput = document.getElementById("propietario");
const telefonoInput = document.getElementById("telefono");
const fechaInput = document.getElementById("fecha");
const horaInput = document.getElementById("hora");
const sintomasInput = document.getElementById("sintomas");
const contenedorCitas = document.getElementById("citas");

class Citas {
  constructor() {
    this.citas = [];
  }
}

class UserInterface {
  imprimirAlerta(msj, tipo) {
    const divMsj = document.createElement("div");
    divMsj.classList.add("text-center", "alert", "d-block", "col-12");
    divMsj.textContent = msj;

    tipo === "error"
      ? divMsj.classList.add("alert-danger")
      : divMsj.classList.add("alert-succes");

    document
      .getElementById("contenido")
      .insertBefore(divMsj, document.querySelector(".agregar-cita"));

    setTimeout(() => {
      divMsj.remove();
    }, 2500);
  }
}

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

const citaObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

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
  } else {
    console.log(true);
    return;
  }
}
