// ./controllers/paymentController.js
const mercadopago = require('../config/mercadoPago');

exports.createPayment = async (req, res) => {
  const {
    email,
    endereco,
    cidade,
    estado,
    cep,
    productData
  } = req.body;

  // Verifica se os dados necessários foram recebidos
  if (
    !email ||
    !endereco ||
    !cidade ||
    !estado ||
    !cep ||
    !productData ||
    !productData.id ||
    !productData.nome ||
    !productData.preco ||
    !productData.descricao 
  ) {
    return res.status(400).send({ message: 'Dados incompletos para o pagamento.' });
  }

  console.log(email)

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).send({ message: 'Endereço de e-mail inválido.' });
  }
  const preferenceItems = [
    {
      id: productData.id,
      title: productData.nome,
      quantity: 1,
      currency_id: 'BRL',
      unit_price: parseFloat(productData.preco),
    },
  ];

  const preferencePayer = {
    email: email,
  };

  const additionalInfo = ` ${endereco}, ${cidade}, ${estado}, ${cep}`;

  const preference = {
    items: preferenceItems,
    payer: preferencePayer,
    additional_info: additionalInfo,
  };

  try {
    const response = await mercadopago.preferences.create(preference);

    if (response.body && response.body.init_point) {
      console.log('Resposta do Mercado Pago:', response);
      res.json({ init_point: response.body.init_point });
    } else {
      console.error('Resposta do Mercado Pago não possui init_point:', response.body);
      res.status(500).send({ message: 'Erro ao processar pagamento.' });
    }
  } catch (error) {
    console.error('Erro ao criar pagamento:', error);
    res.status(500).send({ message: 'Erro ao processar pagamento. ' + error.message });
  }
};
