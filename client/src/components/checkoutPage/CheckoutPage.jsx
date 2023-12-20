import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import * as yup from 'yup';
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";

export default function CheckoutPage() {
  const [product, setProduct] = useState({});
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cep, setCep] = useState('');

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const productData = {
      id: queryParams.get("id"),
      nome: queryParams.get("nome"),
      preco: queryParams.get("preco"),
      descricao: queryParams.get("descricao"),
      imagem: queryParams.get("imagem"),
    };
    setProduct(productData);
  }, [location]);
  const validationCheckout = yup.object().shape({
    endereco: yup.string().required("Endereço de entrega necessário"),
    cidade: yup.string().required("Campo necessário"),
    estado: yup.string().required("Campo necessário"),
    cep: yup.string().min(8).required("Cep necessário")
  });
  const handleCompra = async (e) => {
    try {
      e.preventDefault();
  
      await validationCheckout.validate(
        { endereco, cidade, estado, cep },
        { abortEarly: false }
      );
  
      const email = localStorage.getItem("Email");
      const productData = {
        id: product.id, 
        nome: product.nome,
        preco: product.preco,
        descricao: product.descricao,
      };

      const requestBody = {
        email,     
        endereco,
        cidade,
        estado,
        cep,
        productData,
      };

      const response = await fetch('http://localhost:4000/payments/create_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.status === 200) {
        const paymentResponse = await response.json();
  
        if (paymentResponse.init_point) {
          window.location.href = paymentResponse.init_point;
        } else {
          console.error('Falha ao processar o pagamento.');
        }
      } else {
        console.error('Erro ao criar pagamento:', response.statusText);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Ocorreu um erro na validação dos dados do cartão");
      } else {
        console.error('Erro durante o processo de compra:', error);
      }
    }
  };  
    
  if (!product.id) {
    return <div>Carregando informações do produto...</div>;
  }

  return (
    <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
      <MDBContainer className="py-5 h-100">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol>
            <MDBCard>
              <MDBCardBody className="p-4">
                <MDBRow>
                  <MDBCol lg="7">
                    <MDBCard className="mb-3">
                      <MDBCardBody>
                        <div className="d-flex justify-content-between">
                          <div className="d-flex flex-row align-items-center">
                            <div>
                              <MDBCardImage
                                src={product.imagem}
                                fluid
                                className="rounded-3"
                                style={{ width: "65px" }}
                                alt="Shopping item"
                              />
                            </div>
                            <div className="ms-3">
                              <MDBTypography tag="h5">
                                {product.nome}
                              </MDBTypography>
                              <p className="small mb-0">{product.descricao}</p>
                            </div>
                          </div>
                          <div className="d-flex flex-row align-items-center">
                            <div style={{ width: "80px" }}>
                              <MDBTypography tag="h6" className="mb-0">
                                R${product.preco}
                              </MDBTypography>
                            </div>
                          </div>
                        </div>
                      </MDBCardBody>
                    </MDBCard>

                  </MDBCol>

                  <MDBCol lg="5">
                    <MDBCard className="bg-primary text-white rounded-3">
                      <MDBCardBody>
                        <MDBTypography tag="h5" className="mb-0">
                          Detalhes do Envio
                        </MDBTypography>

                        <form className="mt-4">
                          <MDBTypography tag="h5" className="mb-4 text-dark">
                            Endereço de Entrega
                          </MDBTypography>
                          <MDBInput
                            wrapperClass="mb-4"
                            labelClass="text-dark"
                            label="Endereço"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            id="typeAddress"
                            type="text"
                            contrast
                          />
                          <MDBInput
                            wrapperClass="mb-4"
                            labelClass="text-dark"
                            label="Cidade"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            id="typeCity"
                            type="text"
                            contrast
                          />
                          <MDBRow>
                            <MDBCol md="6">
                              <MDBInput
                                wrapperClass="mb-4"
                                labelClass="text-dark"
                                label="Estado"
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                id="typeState"
                                type="text"
                                contrast
                              />
                            </MDBCol>
                            <MDBCol md="6">
                              <MDBInput
                                wrapperClass="mb-4"
                                labelClass="text-dark"
                                label="CEP"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                id="typeZip"
                                type="text"
                                contrast
                              />
                            </MDBCol>
                          </MDBRow>

                          <button
                            type="button"
                            className="btn btn-lg btn-block text-light"
                            onClick={handleCompra}
                            style={{
                              backgroundColor: "#28a745", 
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              border: "none",
                              height: "50px",
                            }}
                          >
                            Finalizar Compra
                          </button>
                        </form>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
