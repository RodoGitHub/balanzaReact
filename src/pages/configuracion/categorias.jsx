import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from "../../components/Menu";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/categoria", {
        headers: { Authorization: `${token}` },
      });
      setCategorias(response.data.Categorias || []);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const handleAgregarCategoria = async () => {
    if (!nombreCategoria.trim()) {
      setMensaje("El nombre de la categoría no puede estar vacío.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:5000/categoria",
        { nombre: nombreCategoria },
        { headers: { Authorization: `${token}` } }
      );

      setMensaje("Categoría agregada correctamente.");
      setNombreCategoria("");
      fetchCategorias();
    } catch (error) {
      console.error("Error al agregar categoría:", error);
      setMensaje("Error al agregar categoría.");
    }
  };

  const handleEditarCategoria = async () => {
    if (!categoriaEditando || !nombreCategoria.trim()) {
      setMensaje("Seleccione una categoría válida para editar.");
      return;
    }

    try {
      await axios.post(
        `http://127.0.0.1:5000/categoria/${categoriaEditando.id}/editar`,
        { nombre: nombreCategoria },
        { headers: { Authorization: `${token}` } }
      );

      setMensaje("Categoría editada correctamente.");
      setCategoriaEditando(null);
      setNombreCategoria("");
      fetchCategorias();
    } catch (error) {
      console.error("Error al editar categoría:", error);
      setMensaje("Error al editar categoría.");
    }
  };

  // Eliminar categoría
  const handleEliminarCategoria = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:5000/categoria/${id}/delete`,
        {},
        { headers: { Authorization: `${token}` } }
      );

      setMensaje("Categoría eliminada correctamente.");
      fetchCategorias();
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      setMensaje("Error al eliminar categoría.");
    }
  };

  const resetFormularioCategoria = () => {
    setNombreCategoria("");
    setCategoriaEditando(null);
    setMensaje("");
  };

  return (
    <div>
      <Menu />
      <div className="container">
        <h1>Gestión de Categorías</h1>

        {/* Formulario para agregar/editar categorías */}
        <div className="mb-4">
          <h4>{categoriaEditando ? "Editar Categoría" : "Agregar Categoría"}</h4>
          <form>
            <div className="mb-3">
              <label className="form-label">Nombre de la Categoría</label>
              <input
                type="text"
                className="form-control"
                value={nombreCategoria}
                onChange={(e) => setNombreCategoria(e.target.value)}
              />
            </div>

            <button
              type="button"
              className={`btn ${categoriaEditando ? "btn-warning" : "btn-primary"} me-2`}
              onClick={categoriaEditando ? handleEditarCategoria : handleAgregarCategoria}
            >
              {categoriaEditando ? "Guardar Cambios" : "Agregar Categoría"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetFormularioCategoria}
            >
              Cancelar
            </button>
          </form>
        </div>

        {/* Listado de categorías */}
        <h4>Listado de Categorías</h4>
        <ul className="list-group">
          {categorias.map((categoria) => (
            <li
              key={categoria.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {categoria.nombre}
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => {
                    setCategoriaEditando(categoria);
                    setNombreCategoria(categoria.nombre);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleEliminarCategoria(categoria.id)}
                >
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>

        {mensaje && <p className="alert alert-info mt-3">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Categorias;