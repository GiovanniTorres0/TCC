// ./App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatPage from "./components/chatingPage/ChatPage";
import Login from "./components/loginPage/LoginPage";
import Cadastro from "./components/registroPage/RegistroPage";
import PublishProduct from './components/produtoPage/AnuncioProduto';
import ProductPage from './components/produtoPage/ProdutoPage';
import CheckoutPage from './components/checkoutPage/CheckoutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/registro' element={<Cadastro />} />
        <Route path='/publicar' element={<PublishProduct />} />
        <Route path='/produto/:id' element={<ProductPage />} />
        <Route path='/checkout' element={<CheckoutPage />} />
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
