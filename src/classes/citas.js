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

export default Citas;
