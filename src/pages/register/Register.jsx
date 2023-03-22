import React, { useState } from "react";
import newRequest from "../../utils/newRequest.js";
import upload from "../../utils/upload.js";
import { useNavigate } from "react-router-dom";
import "./Register.scss"

function Register() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    img: "",
    country: "",
    phone: "",
    desc: "",
    isSeller: false
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleSeller = (e) => {
    setUser((prev) => {
      return { ...prev, isSeller: e.target.checked }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = await upload(file);
    try {
      await newRequest.post("auth/register", {
        ...user,
        img:url
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="register">
      <form onSubmit={handleSubmit}>
        <div className="left">
          <h1>Crear nueva cuenta</h1>
          <label htmlFor="">Usario</label>
          <input
            name="username"
            type="text"
            placeholder="wilsonweenoo"
            onChange={handleChange}
          />
          <label htmlFor="">Correo</label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
          <label htmlFor="">Contraseña</label>
          <input name="password" type="password" onChange={handleChange} />
          <label htmlFor="">Foto de Perfil</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <label htmlFor="">Country</label>
          <input
            name="country"
            type="text"
            placeholder="Usa"
            onChange={handleChange}
          />
          <button type="submit">Registrarse</button>
        </div>
        <div className="right">
          <h1>Quiero ser un vendedor</h1>
          <div className="toggle">
            <label htmlFor="">Activar la cuenta vendedor</label>
            <label className="switch">
              <input type="checkbox" onChange={handleSeller} />
              <span className="slider round"></span>
            </label>
          </div>
          <label htmlFor="">Número de Telefóno</label>
          <input
            name="phone"
            type="text"
            placeholder="+1 234 567 89"
            onChange={handleChange}
          />
          <label htmlFor="">Descripción</label>
          <textarea
            placeholder="Una corta descripción de ti"
            name="desc"
            id=""
            cols="30"
            rows="10"
            onChange={handleChange}
          ></textarea>
        </div>
      </form>
    </div>
  )
}

export default Register;