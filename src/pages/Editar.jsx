import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function Editar() {
  const [orden, setOrden] = useState({ campo: "nombre", ascendente: true });

  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [nombreCategoria, setNombreCategoria] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const [productos, setProductos] = useState([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState("");
  const [porcentajeProducto, setPorcentajeProducto] = useState(60); 
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [activo_pantallaSeleccionado, setActivo_pantallaSeleccionado] = useState(true)
  const [aplica_descuentoProducto, setAplica_descuentoProducto] = useState(true)

  const productosFiltrados = productos.filter((producto) =>
    categoriaSeleccionada ? producto.categoria_id === parseInt(categoriaSeleccionada) : true
  );
  
  

  const token = localStorage.getItem("token");

    // Obtener Categorías
    useEffect(() => {
      fetchCategorias();
    }, []);
  
    const fetchCategorias = async () => {
      if (!token) {
        console.error("Token no encontrado. Inicie sesión nuevamente.");
        return;
      }
  
      try {
        const response = await axios.get("http://127.0.0.1:5000/categoria", {
          headers: { Authorization: `${token}` },
        });
  
        if (response.data && response.data.Categorias) {
          setCategorias(response.data.Categorias);
        } else {
          console.error("La respuesta no tiene el formato esperado:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

  // Obtener productos por categoría
  useEffect(() => {
    if (categoriaSeleccionada) {
      fetchProductos(categoriaSeleccionada);
    }
  }, [categoriaSeleccionada]);

  const fetchProductos = async (categoria_id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/producto?categoria_id=${categoria_id}`, {
        headers: { Authorization: `${token}` },
      });

      if (response.data && response.data.Producto) {
        setProductos(response.data.Producto);
      } else {
        setProductos([]);
        console.error("La respuesta no tiene el formato esperado:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Agregar nueva categoría
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

  // Editar categoría
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

   // Agregar producto

   

  useEffect(() => {
    fetchUnidadesMedida();
  }, []);

  const fetchUnidadesMedida = async () => {
    if (!token) {
      console.error("Token no encontrado. Inicie sesión nuevamente.");
      return;
    }
  
    try {
      const response = await axios.get("http://127.0.0.1:5000/um", {
        headers: { Authorization: `${token}` },
      });
  
      console.log("Respuesta del backend:", response.data); // 👀 Verificar qué devuelve la API
      if (response.data && response.data.um) {
        setUnidadesMedida(response.data.um);
      } else {
        console.error("Error: La respuesta no la esperada:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener unidades de medida:", error);
    }
  };
    

  useEffect(() => {
    fetchProductos();  // Llamar la función al montar el componente
  }, []);

  const handleChangePorcentaje = (event) => {
    setPorcentajeProducto(parseInt(event.target.value, 10)); // Convertir a número
  };
  
  const handleAgregarProducto = async () => {
    if (!nombreProducto.trim() || !precioProducto.trim() || !categoriaSeleccionada) {
      setMensaje("Debe llenar todos los campos.");
      return;
    }
  
    try {
      await axios.post(
        "http://127.0.0.1:5000/producto",
        { 
          nombre: nombreProducto, 
          precio: parseFloat(precioProducto), 
          porcentaje: porcentajeProducto,  // ✅ Enviar el número seleccionado
          unidad_medida_id: parseInt(unidadMedidaSeleccionada, 10),  
          categoria_id: parseInt(categoriaSeleccionada, 10),
          activo_pantalla: Boolean(activo_pantallaSeleccionado),
          aplica_descuento: Boolean(aplica_descuentoProducto),
        },
        { headers: { Authorization: `${token}` } }
      );
  
      setMensaje("Producto agregado correctamente.");
      setNombreProducto("");
      setPrecioProducto("");
      setPorcentajeProducto(60); 
      setUnidadMedidaSeleccionada("");
      setActivo_pantallaSeleccionado(true);
      setAplica_descuentoProducto(true);
      fetchProductos(categoriaSeleccionada);
    } catch (error) {
      console.error("Error al agregar producto:", error);
      setMensaje("Error al agregar producto.");
    }
  };

  // Editar producto
  const handleEditarProducto = async () => {
    if (!productoEditando) {
      setMensaje("Debe seleccionar un producto válido para editar.");
      return;
    }
  
    // Crear una copia del producto con los valores actualizados
    const productoActualizado = {
      nombre: nombreProducto,
      precio: parseFloat(precioProducto),
      porcentaje: parseInt(porcentajeProducto, 10),
      aplica_descuento: Boolean(aplica_descuentoProducto),
      unidad_medida_id: parseInt(unidadMedidaSeleccionada, 10),
      categoria_id: parseInt(categoriaSeleccionada, 10),
      activo_pantalla: Boolean(activo_pantallaSeleccionado),
    };
  
    try {
      await axios.post(
        `http://127.0.0.1:5000/producto/${productoEditando.id}/editar`,
        productoActualizado,
        { headers: { Authorization: `${token}` } }
      );
  
      setMensaje("Producto editado correctamente.");
  
      //Forzar la actualización del estado de edición a `null`
      setProductoEditando(null);
  
      //Resetear los valores después de editar
      setNombreProducto("");
      setPrecioProducto("");
      setPorcentajeProducto(60);
      setUnidadMedidaSeleccionada("");
      setCategoriaSeleccionada("");
      setActivo_pantallaSeleccionado(true);
      setAplica_descuentoProducto(true);
  
      //Recargar la lista de productos
      fetchProductos(categoriaSeleccionada);
    } catch (error) {
      console.error("Error al editar producto:", error);
      setMensaje("Error al editar producto.");
    }
  };
  

  // Eliminar producto
  const handleEliminarProducto = async (id) => {
    try {
      await axios.post(
        `http://127.0.0.1:5000/producto/${id}/delete`,
        {},
        { headers: { Authorization: `${token}` } }
      );

      setMensaje("Producto eliminado correctamente.");
      fetchProductos(categoriaSeleccionada);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setMensaje("Error al eliminar producto.");
    }
  };

  const ordenarProductos = (campo) => {
    const esAscendente = orden.campo === campo ? !orden.ascendente : true;
    
    const productosOrdenados = [...productos].sort((a, b) => {
      const valorA = campo.includes(".") ? a.categoria?.nombre || "" : a[campo];
      const valorB = campo.includes(".") ? b.categoria?.nombre || "" : b[campo];
  
      if (valorA < valorB) return esAscendente ? -1 : 1;
      if (valorA > valorB) return esAscendente ? 1 : -1;
      return 0;
    });
  
    setOrden({ campo, ascendente: esAscendente });
    setProductos(productosOrdenados);
  };
  

  return (
    <div className="container">
      <h2>Gestión de Categorías y Productos</h2>

      {/* Formulario para agregar/editar categoría */}
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombre de la categoría nueva, que desea agregar"
        value={nombreCategoria}
        onChange={(e) => setNombreCategoria(e.target.value)}
      />
      {categoriaEditando ? (
        <button className="btn btn-warning me-2" onClick={handleEditarCategoria}>
          Guardar Cambios
        </button>
      ) : (
        <button className="btn btn-primary me-2" onClick={handleAgregarCategoria}>
          Agregar Categoría
        </button>
      )}

      {/* Tabla de Categorías */}
      <h4 className="mt-4">Listado de Categorías</h4>
      <ul className="list-group">
        {categorias.map((categoria) => (
          <li key={categoria.id} className="list-group-item d-flex justify-content-between">
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
              <button className="btn btn-danger btn-sm" onClick={() => handleEliminarCategoria(categoria.id)}>
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>


      {/* Formulario para agregar productos */}
      <h4>Agregar Producto</h4>

      <label>Categoría:</label>
      <select
        className="form-control mb-3"
        value={categoriaSeleccionada}
        onChange={(e) => {
          setCategoriaSeleccionada(e.target.value);
          fetchProductos(e.target.value);
        }}
      >
        <option value="">Seleccione una categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </select>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nombre del producto"
        value={nombreProducto}
        onChange={(e) => setNombreProducto(e.target.value)}
      />
      <input
        type="number"
        className="form-control mb-2"
        placeholder="Precio"
        value={precioProducto}
        onChange={(e) => setPrecioProducto(e.target.value)}
      />

      <label htmlFor="porcentaje">Porcentaje de ganancia:</label>
      <select id="porcentaje" value={porcentajeProducto} onChange={handleChangePorcentaje} className="form-control">
        {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((valor) => (
          <option key={valor} value={valor}>
            {valor}%
          </option>
        ))}
      </select>
      
      <label>Unidad de Medida:</label>
      <select
        className="form-control mb-3"
        value={unidadMedidaSeleccionada}
        onChange={(e) => {
          setUnidadMedidaSeleccionada(e.target.value);
         
        }}
      >
        <option value="">Seleccione una unidad</option>
        {unidadesMedida.map((unidad) => (
          <option key={unidad.id} value={unidad.id}>
            {unidad.nombre}
          </option>
        ))}
      </select>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="aplica_descuento"
          checked={aplica_descuentoProducto}
          onChange={(e) => setAplica_descuentoProducto(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="aplica_descuento">
          ¿Aplica descuento?
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="activo_pantalla"
          checked={activo_pantallaSeleccionado}
          onChange={(e) => setActivo_pantallaSeleccionado(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="activo_pantalla">
          ¿Mostrar en pantalla?
        </label>
      </div>


        {productoEditando ? (
        <button className="btn btn-warning me-2" onClick={handleEditarProducto}>
          Guardar Cambios
        </button>
      ) : (
        <button className="btn btn-primary me-2" onClick={handleAgregarProducto}>
          Agregar Producto
        </button>
      )}

      {/* Tabla de Productos */}
      <h4 className="mt-4">Listado de Productos</h4>

      <label>Filtre categoría:</label>
      <select
        className="form-control mb-3"
        value={categoriaSeleccionada}
        onChange={(e) => {
          setCategoriaSeleccionada(e.target.value);
          fetchProductos(e.target.value);
        }}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </select>


      <table className="table table-bordered mt-3">
        
        <thead className="table-dark">
          <tr>
            <th onClick={() => ordenarProductos("nombre")} style={{ cursor: "pointer" }}>
              Producto {orden.campo === "nombre" ? (orden.ascendente ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => ordenarProductos("precio")} style={{ cursor: "pointer" }}>
              Precio {orden.campo === "precio" ? (orden.ascendente ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => ordenarProductos("porcentaje")} style={{ cursor: "pointer" }}>
              Porcentaje {orden.campo === "porcentaje" ? (orden.ascendente ? "▲" : "▼") : ""}
            </th>
            <th>Aplica Descuento</th>
            <th>Visible Pantalla</th>
            <th onClick={() => ordenarProductos("categoria.nombre")} style={{ cursor: "pointer" }}>
              Categoría {orden.campo === "categoria.nombre" ? (orden.ascendente ? "▲" : "▼") : ""}
            </th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>${producto.precio}</td>
              <td>{producto.porcentaje}%</td>
              <td>{producto.aplica_descuento ? "Sí" : "No"}</td>
              <td>{producto.activo_pantalla ? "Sí" : "No"}</td>
              <td>{producto.categoria ? producto.categoria.nombre : "Sin categoría"}</td>
              <td>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => {
                  setProductoEditando({ ...producto });
                  setNombreProducto(producto.nombre);
                  setPrecioProducto(producto.precio);
                  setPorcentajeProducto(producto.porcentaje);
                  setUnidadMedidaSeleccionada(producto.unidad_medida_id);
                  setCategoriaSeleccionada(producto.categoria_id);
                  setActivo_pantallaSeleccionado(producto.activo_pantalla); 
                  setAplica_descuentoProducto(producto.aplica_descuento); 
                }}
              >
                Editar
              </button>

                <button className="btn btn-danger btn-sm" onClick={() => handleEliminarProducto(producto.id)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mensaje && <p className="alert alert-info mt-3">{mensaje}</p>}
    </div>
  );
}

export default Editar;
