// ./produtoPage/ProdutoPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Navbar from '../menuPage/NavBar';
import './ProductPage.css';

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const { id } = useParams();


  const handleBuyProduct = () => {
    const query = new URLSearchParams({
      id: product.id,
      nome: product.nome,
      preco: product.preco,
      descricao: product.descricao,
      imagem: product.imagem_1 
    }).toString();
  
    window.location.href = `/checkout?${query}`;
  };
  


  useEffect(() => {
    axios.get(`http://localhost:4000/api/products/${id}`, { withCredentials: true })
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar produto:', error);
      });
  }, [id]);

  if (!product) {
    return <div>Carregando...</div>;
  }

  const imageUrls = [
    product.imagem_1,
    product.imagem_2,
    product.imagem_3,
    product.imagem_4,
  ].filter(url => url);

  return (
    <>
      <Navbar />
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="row gx-4 gx-lg-5 align-items-center">
            <div className="col-md-6">
              <div id="imageCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  {imageUrls.map((imageUrl, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                      <img
                        src={imageUrl}
                        className="d-block w-100 carousel-image"
                        alt={`Imagem ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Anterior</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Próximo</span>
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="small mb-1">CODE: {product.code}</div>
              <h1 className="display-5 fw-bolder">{product.nome}</h1>
              <div className="fs-5 mb-5">
                <span className="text-decoration-line-through">R{product.precoAntigo}</span>
                <span>${product.preco}</span>
              </div>
              <p className="lead">{product.descricao}</p>
              <div className="d-flex">
                <input className="form-control text-center me-3" id="inputQuantity" type="number" value="1" readOnly style={{ maxWidth: '3rem' }} />
                <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={handleBuyProduct}>
                  <i className="bi-cart-fill me-1"></i>
                  Comprar Produto
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-5 bg-dark">
        <div className="container"><p className="m-0 text-center text-white">Copyright &copy; O Negociador 2023</p></div>
      </footer>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    </>
  );
};

export default ProductPage;
