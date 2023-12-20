// ./controllers/productController.js
const db = require('../config/db');
const dbx = require('../config/dropboxConfig');

exports.addProduct = async (req, res) => {
  const { nome, descricao, preco } = req.body;
  const usuarioId = req.user.id;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Por favor, forneça as imagens necessárias" });
  }

  try {
    const [existingProduct] = await db.promise().query(
      "SELECT * FROM produtos WHERE nome = ?",
      [nome]
    );

    if (existingProduct.length > 0) {
      return res.status(400).json({ error: "Produto já existe" });
    }

    const imageUploadPromises = req.files.map(file => 
      dbx.filesUpload({ path: `/imagens/${Date.now()}-${file.originalname}`, contents: file.buffer })
    );

    const uploadResults = await Promise.all(imageUploadPromises);
    const imagePaths = uploadResults.map(result => result.result.path_lower);

    const query = "INSERT INTO produtos (nome, descricao, preco, usuario_id, imagem_1, imagem_2, imagem_3, imagem_4) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const result = await db.promise().query(query, [nome, descricao, preco, usuarioId, ...imagePaths]);

    res.status(201).json({ message: "Produto adicionado com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar produto no banco de dados:", error);
    res.status(500).json({ error: "Erro ao adicionar produto no banco de dados" });
  }
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT p.id, p.nome, p.descricao, p.preco, p.imagem_1, p.imagem_2, p.imagem_3, p.imagem_4, u.nome as nomeUsuario, u.email FROM produtos p JOIN usuarios u ON p.usuario_id = u.idusuarios WHERE p.id = ?;";
    const [product] = await db.promise().query(query, [id]);

    if (product.length === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const productData = product[0];
    const imageLinks = {};

    for (let i = 1; i <= 4; i++) {
      const imagePath = productData[`imagem_${i}`];
      if (imagePath) {
        if (!imageLinks[imagePath]) {
          try {
            const sharedLinkResponse = await dbx.sharingCreateSharedLinkWithSettings({ path: imagePath });
            imageLinks[imagePath] = sharedLinkResponse.result.url.replace('dl=0', 'raw=1');
          } catch (dbxError) {
            if (dbxError.error && dbxError.error.error_summary.startsWith('shared_link_already_exists/')) {
              const existingLinksResponse = await dbx.sharingListSharedLinks({ path: imagePath });
              const existingLinks = existingLinksResponse.result.links;
              if (existingLinks && existingLinks.length > 0) {
                imageLinks[imagePath] = existingLinks[0].url.replace('dl=0', 'raw=1');
              } else {
                throw new Error('Não foi possível obter o link compartilhável existente.');
              }
            } else {
              throw dbxError;
            }
          }
        }
        productData[`imagem_${i}`] = imageLinks[imagePath];
      }
    }

    res.status(200).json(productData);
  } catch (error) {
    console.error("Erro ao buscar produto no banco de dados:", error);
    res.status(500).json({ error: "Erro ao buscar produto no banco de dados" });
  }
};
