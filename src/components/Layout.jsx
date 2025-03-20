import { Link, Outlet } from "react-router-dom";



function Layout() {
  return (
    <div>
      <hr />
      <ul className="nav nav-pills">
        <li className="nav-item">
          <Link to="/" className="nav-link" >Inicio</Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link" >Sobre Nosotros</Link>
        </li>
        <li className="nav-item">
          <Link to="/productos" className="nav-link">Productos</Link>
        </li>
        <li className="nav-item">
          <Link to="/editar" className="nav-link">Editar</Link>
        </li>
        <li className="nav-item">
          <Link to="/pizarron" className="nav-link">Pizarron 1</Link>
        </li>
        <li className="nav-item">
          <Link to="/pizarronB" className="nav-link">Pizarron 2</Link>
        </li>
        
      </ul>
      <hr />
      <Outlet />
    </div>
  );
}

export default Layout;