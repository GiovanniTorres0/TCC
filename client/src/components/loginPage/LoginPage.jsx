// ./loginPage/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import * as yup from 'yup';
import Axios from 'axios';
import './LoginStyles.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailBlur, setEmailBlur] = useState(false);
  const [senhaBlur, setSenhaBlur] = useState(false);

  const validationLogin = yup.object().shape({
    email: yup
      .string()
      .email('Não é um email válido')
      .required('Este campo é obrigatório'),
    senha: yup
      .string()
      .required('Este campo é obrigatório'),
  });

  const handleLogin = async () => {
    const values = { email, senha }; 
    try {
        await validationLogin.validate(values, { abortEarly: false });
        const response = await Axios.post("http://localhost:4000/login", values, { withCredentials: true });
        if (response.data.error) {
            alert(response.data.error);
        } else if (response.data.usuario) {
            alert("Logado com sucesso");
            localStorage.setItem("Email", email);
            localStorage.setItem("userName", email);
            navigate("/chat");
        } else {
            alert("Erro no login. Tente novamente.");
        }
    } catch (error) {
      console.error("Erro na requisição:", error);
      if (error.response) {
          alert(`Erro na requisição: ${error.response.status} ${error.response.statusText}`);
      } else if (error.request) {
          alert("Nenhuma resposta recebida do servidor");
      } else {
          alert("Erro ao fazer a requisição");
      }
  }
}

  const handleBlur = async (field) => {
    if (field === 'email') {
      setEmailBlur(true);
    } else if (field === 'senha') {
      setSenhaBlur(true);
    }
  };

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img src="/images/undraw_remotely_2j6y.svg" className="img-fluid" alt="img-login" />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}>
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form3Example3"
                  className={`form-control form-control-lg ${emailBlur && validationLogin.fields.email.error ? 'is-invalid' : ''}`}
                  placeholder="Digite um endereço de e-mail válido"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                />
                <label className="form-label" htmlFor="form3Example3">
                  Endereço de e-mail
                </label>
                {emailBlur && validationLogin.fields.email.error && (
                  <div className="invalid-feedback">{validationLogin.fields.email.error[0]}</div>
                )}
              </div>

              <div className="form-outline mb-3">
                <input
                  type="password"
                  id="form3Example4"
                  className={`form-control form-control-lg ${senhaBlur && validationLogin.fields.senha.error ? 'is-invalid' : ''}`}
                  placeholder="Digite a senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onBlur={() => handleBlur('senha')}
                />
                <label className="form-label" htmlFor="form3Example4">
                  Senha
                </label>
                {senhaBlur && validationLogin.fields.senha.error && (
                  <div className="invalid-feedback">{validationLogin.fields.senha.error[0]}</div>
                )}
              </div>

              <div className="d-flex justify-content between align-items-center">
                <div className="form-check mb-0">
                  <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                  <label className="form-check-label" htmlFor="form2Example3">
                    Lembrar-me
                  </label>
                </div>
                <a href="#!" className="text-body">
                  Esqueceu a senha?
                </a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button type="submit" className="btn btn-custom btn-lg" style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
                  Entrar
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Não tem uma conta? <a href="/registro" className="link-danger">
                    Registrar
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
