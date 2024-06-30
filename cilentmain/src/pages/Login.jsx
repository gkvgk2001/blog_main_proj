import React, { useContext } from "react";
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",

    password: "",
  });

  const navigate = useNavigate();

  const [err, setError] = useState(null);

  const { currentUser, login } = useContext(AuthContext);

  console.log(currentUser);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);

      navigate("/");
      console.log(res);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="auth">
      <h1>Login</h1>

      <form action="">
        <input
          required
          type="text"
          name="username"
          placeholder="username"
          onChange={handleChange}
        />

        <input
          required
          type="password"
          name="password"
          placeholder="password"
          onChange={handleChange}
        />

        <button onClick={handleSubmit}>Login</button>
        {err && <p>{err}</p>}

        <span>
          Don't you have an account ? <Link to="/register">Register</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
