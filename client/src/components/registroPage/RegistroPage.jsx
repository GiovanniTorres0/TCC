// ./registroPage/RegistroPage.jsx
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import './RegistroStyles.css'

function Cadastro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [, setRepetirSenhaError] = useState('');

  const navigate = useNavigate(); 

  const validationRegistro = yup.object().shape({
    nome: yup.string().required('Este campo é obrigatório'),
    email: yup.string().email('Não é um email válido').required('Este campo é obrigatório'),
    senha: yup.string().required('Este campo é obrigatório'),
    repetirSenha: yup
      .string()
      .oneOf([yup.ref('senha')], 'As senhas não coincidem')
      .required('Este campo é obrigatório'),
    telefone: yup
      .string()
      .matches(/^\d{11}$/, 'O telefone deve ter 11 dígitos numéricos')
      .required('Este campo é obrigatório'),
  });

  const handleRegistro = async (e) => {
    e.preventDefault(); 
    try {
      await validationRegistro.validate({ nome, email, senha, repetirSenha, telefone }, { abortEarly: false });
      const response = await Axios.post('http://localhost:4000/register', {
        nome,
        email,
        senha,
        telefone,
      }, {withCredentials: true, });
      alert("Cadastro realizado com sucesso");
      console.log(response);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("E-mail já registrado");
      } else {
        console.log(error);
      }
    }
  };

  const handleFieldBlur = async (fieldName, fieldValue) => {
    try {
      await validationRegistro.validate({ [fieldName]: fieldValue }, { abortEarly: false });
      if (fieldName === 'repetirSenha') {
        if (fieldValue !== senha) {
          setRepetirSenhaError('As senhas não coincidem');
        } else {
          setRepetirSenhaError('');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <section className="vh-100" style={{ backgroundImage: "url('https://static.vecteezy.com/system/resources/previews/002/773/418/non_2x/gradient-calming-purple-tropical-background-free-vector.jpg')", backgroundSize: 'cover' }}>
      <div className="mask d-flex align-items-center h-100">
        <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100" style={{ overflow: 'hidden', marginLeft:10}}>
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: '15px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-5">Crie uma conta</h2>
                  <form onSubmit={handleRegistro}>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example1cg"
                        className={`form-control form-control-lg ${(nome && validationRegistro.fields.nome.error) ? 'is-invalid' : ''}`}
                        name="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        onBlur={() => handleFieldBlur('nome', nome)}
                      />
                      <label className="form-label" htmlFor="form3Example1cg">Seu Nome</label>
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="form3Example3cg"
                        className={`form-control form-control-lg ${email && validationRegistro.fields.email.error ? 'is-invalid' : ''}`}
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleFieldBlur('email', email)}
                      />
                      <label className="form-label" htmlFor="form3Example3cg">Seu Email</label>
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="form3Example4cg"
                        className={`form-control form-control-lg ${senha && validationRegistro.fields.senha.error ? 'is-invalid' : ''}`}
                        name="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        onBlur={() => handleFieldBlur('senha', senha)}
                      />
                      <label className="form-label" htmlFor="form3Example4cg">Senha</label>
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="password"
                        id="form3Example4cdg"
                        className={`form-control form-control-lg ${repetirSenha && validationRegistro.fields.repetirSenha.error ? 'is-invalid' : ''}`}
                        name="repetirSenha"
                        value={repetirSenha}
                        onChange={(e) => setRepetirSenha(e.target.value)}
                        onBlur={() => handleFieldBlur('repetirSenha', repetirSenha)}
                      />
                      <label className="form-label" htmlFor="form3Example4cdg">Repita a senha</label>
                    </div>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example7cg"
                        className={`form-control form-control-lg ${telefone && validationRegistro.fields.telefone.error ? 'is-invalid' : ''}`}
                        name="telefone"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        onBlur={() => handleFieldBlur('telefone', telefone)}
                      />
                      <label className="form-label" htmlFor="form3Example7cg">Telefone</label>
                    </div>
                    <div className="form-check d-flex justify-content-center mb-5">
                      <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3cg" />
                      <label className="form-check-label" htmlFor="form2Example3cg">
                        Concordo com todas as declarações em <a href="#!" className="text-body"><u>Termos de serviço</u></a>
                      </label>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button type="submit" className="btn btn-custom btn-lg">Cadastrar</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cadastro;
