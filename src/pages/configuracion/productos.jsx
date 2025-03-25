import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Menu from "../../components/Menu";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [nombreProducto, setNombreProducto] = useState("");
  const [precioProducto, setPrecioProducto] = useState("");
  const [porcentajeProducto, setPorcentajeProducto] = useState(60);
  const [unidadMedidaSeleccionada, setUnidadMedidaSeleccionada] = useState("");
  const [productoEditando, setProductoEditando] = useState(null);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [activo_pantallaSeleccionado, setActivo_pantallaSeleccionado] = useState(true);
  const [aplica_descuentoProducto, setAplica_descuentoProducto] = useState(true);
  const [imagenProducto, setImagenProducto] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [categorias, setCategorias] = useState([]);
  const inputImagenRef = useRef(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchUnidadesMedida();
  }, []);

  const fetchProductos = async (categoria_id) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/producto?categoria_id=${categoria_id || ""}`,
        { headers: { Authorization: `${token}` } }
      );
      setProductos(response.data.Producto || []);
    } catch (error) {
      console.error("Error al obtener productos:", error);
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

    const handleEditarProducto = async () => {
        if (!productoEditando) {
          setMensaje("Debe seleccionar un producto válido para editar.");
          return;
        }
    
        try {
          // Usar FormData para enviar archivos
          const formData = new FormData();
          formData.append("nombre", nombreProducto);
          formData.append("precio", precioProducto);
          formData.append("porcentaje", porcentajeProducto);
          formData.append("unidad_medida_id", unidadMedidaSeleccionada);
          formData.append("categoria_id", categoriaSeleccionada);
          formData.append("activo_pantalla", activo_pantallaSeleccionado);
          formData.append("aplica_descuento", aplica_descuentoProducto);
          
          // Agregar la imagen solo si ha cambiado
          if (imagenProducto) {
            formData.append("imagen", imagenProducto);
          }
    
          await axios.post(
            `http://127.0.0.1:5000/producto/${productoEditando.id}/editar`,
            formData,
            { 
              headers: { 
                Authorization: `${token}`,
                "Content-Type": "multipart/form-data" 
              } 
            }
          );
    
          setMensaje("Producto editado correctamente.");
          setProductoEditando(null);
          resetFormularioProducto();
          fetchProductos(categoriaSeleccionada);
        } catch (error) {
          console.error("Error al editar producto:", error);
          setMensaje("Error al editar producto.");
        }
      };

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

  const fetchUnidadesMedida = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/um", {
        headers: { Authorization: `${token}` },
      });
      setUnidadesMedida(response.data.um || []);
    } catch (error) {
      console.error("Error al obtener unidades de medida:", error);
    }
  };

  const handleAgregarProducto = async () => {
    if (!nombreProducto.trim() || !precioProducto.trim() || !categoriaSeleccionada) {
      setMensaje("Debe llenar todos los campos.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre", nombreProducto);
      formData.append("precio", precioProducto);
      formData.append("porcentaje", porcentajeProducto);
      formData.append("unidad_medida_id", unidadMedidaSeleccionada);
      formData.append("categoria_id", categoriaSeleccionada);
      formData.append("activo_pantalla", activo_pantallaSeleccionado);
      formData.append("aplica_descuento", aplica_descuentoProducto);

      if (imagenProducto) {
        formData.append("imagen", imagenProducto);
      }

      await axios.post("http://127.0.0.1:5000/producto", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMensaje("Producto agregado correctamente.");
      resetFormularioProducto();
      fetchProductos(categoriaSeleccionada);
    } catch (error) {
      console.error("Error al agregar producto:", error);
      setMensaje("Error al agregar producto.");
    }
  };

  const resetFormularioProducto = () => {
    setNombreProducto("");
    setPrecioProducto("");
    setPorcentajeProducto(60);
    setUnidadMedidaSeleccionada("");
    setActivo_pantallaSeleccionado(true);
    setAplica_descuentoProducto(true);
    setImagenProducto(null);
    setPreviewImagen(null);
    if (inputImagenRef.current) {
      inputImagenRef.current.value = null;
    }
  };

  return (
    <div>
      <Menu />
      <div className="container">
        <h1>Gestión de Productos</h1>
  
        {/* Formulario para agregar/editar productos */}
        <div className="mb-4">
          <h4>{productoEditando ? "Editar Producto" : "Agregar Producto"}</h4>
          <form>
            <div className="mb-3">
              <label className="form-label">Nombre del Producto</label>
              <input
                type="text"
                className="form-control"
                value={nombreProducto}
                onChange={(e) => setNombreProducto(e.target.value)}
              />
            </div>
  
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <input
                type="number"
                className="form-control"
                value={precioProducto}
                onChange={(e) => setPrecioProducto(e.target.value)}
              />
            </div>
  
            <div className="mb-3">
              <label className="form-label">Porcentaje de Ganancia</label>
              <select
                className="form-control"
                value={porcentajeProducto}
                onChange={(e) => setPorcentajeProducto(parseInt(e.target.value, 10))}
              >
                {Array.from({ length: 10 }, (_, i) => (i + 1) * 10).map((valor) => (
                  <option key={valor} value={valor}>
                    {valor}%
                  </option>
                ))}
              </select>
            </div>
  
            <div className="mb-3">
              <label className="form-label">Unidad de Medida</label>
              <select
                className="form-control"
                value={unidadMedidaSeleccionada}
                onChange={(e) => setUnidadMedidaSeleccionada(e.target.value)}
              >
                <option value="">Seleccione una unidad</option>
                {unidadesMedida.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>
                    {unidad.nombre}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select
                className="form-control"
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
  
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
  
            <div className="mb-3">
              <label className="form-label">Imagen del Producto</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImagenProducto(e.target.files[0])}
                ref={inputImagenRef}
              />
              {previewImagen && (
                <div className="mt-2">
                  <img
                    src={previewImagen}
                    alt="Vista previa"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                    className="img-thumbnail"
                  />
                </div>
              )}
            </div>
  
            <button
              type="button"
              className={`btn ${productoEditando ? "btn-warning" : "btn-primary"} me-2`}
              onClick={productoEditando ? handleEditarProducto : handleAgregarProducto}
            >
              {productoEditando ? "Guardar Cambios" : "Agregar Producto"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetFormularioProducto}
            >
              Cancelar
            </button>
          </form>
        </div>
  
        {/* Tabla de productos */}
        <h4>Listado de Productos</h4>
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Porcentaje</th>
              <th>Aplica Descuento</th>
              <th>Visible Pantalla</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>
                  <img
                    src={`http://127.0.0.1:5000${producto.imagen_url}`}
                    alt={producto.nombre}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </td>
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
                      setProductoEditando(producto);
                      setNombreProducto(producto.nombre);
                      setPrecioProducto(producto.precio);
                      setPorcentajeProducto(producto.porcentaje);
                      setUnidadMedidaSeleccionada(producto.unidad_medida_id);
                      setCategoriaSeleccionada(producto.categoria_id);
                      setActivo_pantallaSeleccionado(producto.activo_pantalla);
                      setAplica_descuentoProducto(producto.aplica_descuento);
                      setPreviewImagen(`http://127.0.0.1:5000${producto.imagen_url}`);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminarProducto(producto.id)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {mensaje && <p className="alert alert-info mt-3">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Productos;