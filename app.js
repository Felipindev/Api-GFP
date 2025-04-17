import cors from 'cors'
import express from 'express'
import { testarConexao } from './db.js'
import RotasUsuarios, {autenticarToken} from './routes/RotasUsuarios.js'
import RotasCategorias, {autenticarToken2} from './routes/RotasCategorias.js'
import RotasSubCategorias, {autenticarToken3} from './routes/RotasSubCategorias.js'
import RotasLocalTransacao, {autenticarToken4} from './routes/RotasLocalTransacao.js'
import RotasTransacoes, {autenticarToken5} from './routes/RotasTransacoes.js'

const app = express() //criar uma instancia
testarConexao();

app.use(cors()); //habilitar o cors
app.use(express.json()); //habilitar o json no express

// app.use(RotasUsuarios);
app.get('/', (req, res) =>{
    res.send("API rodando!");
})

//rotas usuarios
app.post('/usuarios', autenticarToken, RotasUsuarios.novoUsuario); //criar um novo usuario
app.get('/usuarios', autenticarToken, RotasUsuarios.listarUsuarios); //listar todos os usuarios
app.post('/usuarios/login', RotasUsuarios.login); //fazer login
app.get('/usuarios/:id_usuario', RotasUsuarios.listarUsuariosPorId); //listar um usuario por id
app.put('/usuarios/:id_usuario', autenticarToken, RotasUsuarios.atualizarTodos); //atualizar todos os campos de um usuario
app.patch('/usuarios/id_usuario', autenticarToken, RotasUsuarios.atualizar); //atualizar campos especificos de um usuario
app.delete('/usuarios/:id_usuario', autenticarToken, RotasUsuarios.deletar); //excluir um usuario

//rotas categorias
app.post('/categorias', autenticarToken2, RotasCategorias.nova); //criar uma nova categoria
app.get('/categorias', RotasCategorias.listar); //listar todas as categorias
app.get('/categorias/:id_categoria', RotasCategorias.listarPorID); //listar uma categoria por id
app.put('/categorias/:id_categoria', autenticarToken2, RotasCategorias.atualizarTodos); //atualizar todos os campos de uma categoria
app.patch('/categorias/:id_categoria', autenticarToken2, RotasCategorias.atualizar); //atualizar campos especificos de uma categoria
app.delete('/categorias/:id_categoria', autenticarToken2, RotasCategorias.deletar); //excluir uma categoria

//rotas subcategorias
app.post('/subCategorias', autenticarToken3, RotasSubCategorias.nova); //criar uma nova subcategoria
app.get('/subCategorias', RotasSubCategorias.listar); //listar todas as subcategorias
app.get('/subCategorias/:id_subCategoria', RotasSubCategorias.listarPorID); //listar uma subcategoria por id
app.put('/subCategorias/:id_subCategoria', autenticarToken3, RotasSubCategorias.atualizarTodos); //atualizar todos os campos de uma subcategoria
app.patch('/subCategorias/id_subCategoria', autenticarToken3, RotasSubCategorias.atualizar); //atualizar campos especificos de uma subcategoria
app.delete('/subCategorias/:id_subCategoria', autenticarToken3, RotasSubCategorias.deletar); //excluir uma subcategoria

//rotas local transacao
app.post('/localTransacao', autenticarToken4, RotasLocalTransacao.nova); //criar uma nova local transacao
app.get('/localTransacao',  RotasLocalTransacao.listar); //listar todas as local transacao
app.get('/localTransacao/:id_localTransacao', RotasLocalTransacao.listarporID); //listar uma local transacao por id
app.put('/localTransacao/:id_localTransacao', autenticarToken4, RotasLocalTransacao.atualizarTodos); //atualizar todos os campos de uma local transacao
app.patch('/localTransacao/id_localTransacao', autenticarToken4, RotasLocalTransacao.atualizar); //atualizar campos especificos de uma local transacao
app.delete('/localTransacao/:id_localTransacao', autenticarToken4, RotasLocalTransacao.deletar); //excluir uma local transacao

//rotas transacoes
app.post('/transacao', autenticarToken5, RotasTransacoes.nova); //criar uma nova transacao
app.get('/transacao', RotasTransacoes.listar); //listar todas as transacoes
app.get('/transacao/:id_transacao', RotasTransacoes.listarPorID); //listar uma transacao por id
app.put('/transacao/:id_transacao', autenticarToken5, RotasTransacoes.atualizarTodos); //atualizar todos os campos de uma transacao
app.patch('/transacao/:id_transacao', autenticarToken5, RotasTransacoes.atualizar); //atualizar campos especificos de uma transacao
app.delete('/transacao/:id_transacao', autenticarToken5, RotasTransacoes.deletar); //excluir uma transacao

const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Api rodando no http://localhost:${PORT}`);
})