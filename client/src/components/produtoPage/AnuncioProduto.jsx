import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../menuPage/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';

function PublishProduct() {
 const [productName, setProductName] = useState('');
 const [productDescription, setProductDescription] = useState('');
 const [productPrice, setProductPrice] = useState('');
 const [productImages, setProductImages] = useState(Array(4).fill(null));

 const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...productImages];
      updatedImages[index] = file;
      setProductImages(updatedImages);
    }
 };

 const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nome', productName);
    formData.append('descricao', productDescription);
    formData.append('preco', productPrice);

    productImages.forEach((image, index) => {
      if (image) {
        formData.append('imagem', image); // Nome 'imagem' para compatibilidade com o backend
      }
    });

    try {
      await axios.post('http://localhost:4000/api/products', formData, {
        withCredentials: true,
      });

      alert('Produto adicionado com sucesso!');
    } catch (error) {
      if (error.response) {
        alert(`Erro: ${error.response.status} - ${error.response.data.message}`);
      } else {
        alert('Erro ao adicionar o produto');
      }
    }
 };
 return (
    <div className="container mt-5">
      <Navbar></Navbar>
      <h2 className="mb-5">Publicar Produto</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label" htmlFor="productName">Nome do Produto:</label>
          <input
            className="form-control"
            id="productName"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="productDescription">Descrição:</label>
          <textarea
            className="form-control"
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="productPrice">Preço:</label>
          <input
            className="form-control"
            id="productPrice"
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>
        {productImages.map((image, index) => (
          <div key={index} className="mb-3">
            <label className="form-label" htmlFor={`productImage${index}`}>Imagem Prova {index + 1}:</label>
            <input
              className="form-control"
              id={`productImage${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, index)}
            />
          </div>
        ))}
        <button type="submit" className="btn btn-custom">Publicar</button>
      </form>
    </div>
 );
}

export default PublishProduct;