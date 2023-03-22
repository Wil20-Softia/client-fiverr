import React, { useState } from "react";
import newRequest from "../../utils/newRequest.js";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await newRequest.post("auth/login", { username, password });
      localStorage.setItem("currentUser", JSON.stringify(res.data)); //Guardando los datos del usuario en local
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <h1>Ingresar</h1>
        <label htmlFor="">Usuario</label>
        <input name="username" type="text" placeholder="wilsonweenoo" onChange={e=>setUsername(e.target.value)} />

        <label htmlFor="">Contraseña</label>
        <input name="password" type="password" onChange={e=>setPassword(e.target.value)}/>

        <button type="submit">Login</button>
      </form>
      { error && error }
    </div>
  )
}

export default Login