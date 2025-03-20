import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Pizarron.css";

const Pizarron = () => {
  const [productos, setProductos] = useState([]); // Productos visibles
  const [categorias, setCategorias] = useState([]); // Lista de categorías
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]); // Categorías seleccionadas

  // Obtener productos desde la API
  useEffect(() => {
    fetchProductos();
    
    const interval = setInterval(() => {
      fetchProductos();
    }, 5000); 
  
    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, [categoriasSeleccionadas]);
  

    const fetchProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/producto", {
        headers: { Authorization: `${token}` },
      });

      if (response.data && response.data.Producto) {
        // Filtrar productos visibles y por categorías seleccionadas
        const productosVisibles = response.data.Producto.filter(producto => 
          producto.activo_pantalla &&
            (categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(producto.categoria_id.toString()))
        )
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
        

        setProductos(productosVisibles);
      } else {
        console.error("La respuesta no tiene el formato esperado:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Obtener categorías desde la API
  const fetchCategorias = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:5000/categoria", {
        headers: { Authorization: `${token}` },
      });

      if (response.data && response.data.Categorias) {
        setCategorias(response.data.Categorias);
      } else {
        console.error("Error al obtener categorías:", response.data);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [categoriasSeleccionadas]); // Se ejecuta cada vez que cambia la selección de categorías

  // Función para manejar el cambio de checkboxes
  const handleCheckboxChange = (categoriaId) => {
    setCategoriasSeleccionadas(prevSeleccionadas => {
      if (prevSeleccionadas.includes(categoriaId)) {
        return prevSeleccionadas.filter(id => id !== categoriaId); // Quitar categoría si ya estaba seleccionada
      } else {
        return [...prevSeleccionadas, categoriaId]; // Agregar categoría si no estaba seleccionada
      }
    });
  };

  // Función para dividir productos en columnas
  const dividirEnColumnas = (items, columnas) => {
    const resultado = Array.from({ length: columnas }, () => []);
    items.forEach((item, index) => resultado[index % columnas].push(item));
    return resultado;
  };

  // Dividir productos en 3 columnas
  const columnas = dividirEnColumnas(productos, 3);

  return (
    <div className="pizarron-page">
    
      <div className="pizarron">
        <div className="marco">

          <h1 className="titulo">Lista de Precios</h1>

          <div className="contenedor-listas">
            {columnas.map((columna, i) => (
              <ul key={i} className="columna">
                {columna.map((producto, index) => (
                <li key={index}>
                  <span className="nombre">
                    {new Date(producto.fecha_actualizacion).toDateString() === new Date().toDateString()
                      ? `* ${producto.nombre}`
                      : producto.nombre}
                  </span>
                  <span className="precio">
                    ${ (producto.precio + (producto.precio * producto.porcentaje / 100)).toLocaleString("es-AR") }
                  </span>
                </li>
                
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      {/* Checkboxes de categorías */}
      <div className="categoria-checkboxes">
        {categorias.map((categoria, index) => (
          <span key={categoria.id} className="categoria-item">
            <label className="form-check-label text-white"> {/* Agregamos text-white aquí */}
              <input
                type="checkbox"
                className="form-check-input"
                value={categoria.id}
                checked={categoriasSeleccionadas.includes(categoria.id.toString())}
                onChange={() => handleCheckboxChange(categoria.id.toString())}
              />
              -{categoria.nombre}
            </label>
            {/* Agregar guion medio solo entre elementos, no al final */}
            {index < categorias.length - 1 && <span className="separador text-white">  </span>}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Pizarron;
