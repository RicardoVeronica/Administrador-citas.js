import Citas from "../classes/citas";
import UserInterface from "../classes/userInterface";
import {
  mascotaInput,
  propietarioInput,
  telefonoInput,
  fechaInput,
  horaInput,
  sintomasInput,
  formulario,
} from "../selectores/selectores";

const userInterface = new UserInterface();
const administrarCitas = new Citas();

let editando;

const citaObj = {
  // Crea objeto literal con valores vacios
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

export function datosCita(e) {
  // Mete en los valores vacios de citaObj el value del input que escriba el user
  citaObj[e.target.name] = e.target.value;
}

export function nuevaCita(e) {
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

    formulario.querySelector("button[type='submit']").textContent =
      "Crear cita";

    editando = false;
  } else {
    // Agrega nuevo atributo id a citaObj
    citaObj.id = Date.now();

    /* Crear nueva cita con una copia de citaObj global, sino se pasa como copia
  hay problemas cuando se crea una nueva cita */
    administrarCitas.agregarCita({ ...citaObj });

    userInterface.imprimirAlerta("Se agrego correctamente");
  }

  // Reinicia el objeto citaObj para la validacion
  reiniciarObjeto();

  // Limpia formulario una vez que se agrega una cita
  formulario.reset();

  // Imprime el HTML de las citas, pasando el objeto
  userInterface.imprimirCitas(administrarCitas);
}

export function reiniciarObjeto() {
  // Limpia el objeto citaObj
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.fecha = "";
  citaObj.hora = "";
  citaObj.sintomas = "";
}

export function eliminarCita(id) {
  // Elimina cita
  administrarCitas.eliminarCita(id);

  // Imprime mensaje
  userInterface.imprimirAlerta("La cita se elimino correctamente");

  // Imprime citas
  userInterface.imprimirCitas(administrarCitas);
}

export function cargarEdicion(cita) {
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
