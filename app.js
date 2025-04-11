import cors from 'cors'
import express from 'express'
import { testarConexao } from './db.js'
import RotasUsuarios, {autenticarToken} from './routes/RotasUsuarios.js'
import RotasCategorias from './routes/RotasCategorias.js'
import RotasSubCategorias from './routes/RotasSubCategorias.js'

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
app.get('/usuarios/:id_usuario', autenticarToken, RotasUsuarios.listarUsuariosPorId); //listar um usuario por id
app.put('/usuarios/:id_usuario', autenticarToken, RotasUsuarios.atualizarTodosCampos); //atualizar todos os campos de um usuario
app.patch('/usuarios/id_usuario', autenticarToken, RotasUsuarios.atualizar); //atualizar campos especificos de um usuario
app.delete('/usuarios/:id_usuario', autenticarToken, RotasUsuarios.deletar); //excluir um usuario

//rotas categorias
app.post('/categorias', RotasCategorias.novaCategoria); //criar uma nova categoria
app.get('/categorias', RotasCategorias.listarCategorias); //listar todas as categorias
app.get('/categorias/:id_categoria', RotasCategorias.listarCategoriasPorId); //listar uma categoria por id
app.put('/categorias/:id_categoria', RotasCategorias.atualizarTodosCampos); //atualizar todos os campos de uma categoria
app.patch('/categorias/:id_categoria', RotasCategorias.atualizar); //atualizar campos especificos de uma categoria
app.delete('/categorias/:id_categoria', RotasCategorias.exclusao); //excluir uma categoria

//rotas subcategorias
app.post('/subcategorias', RotasSubCategorias.novaSubCategoria); //criar uma nova subcategoria
app.get('/subcategorias', RotasSubCategorias.listarSubCategorias); //listar todas as subcategorias
app.get('/subcategorias/:id_subcategoria', RotasSubCategorias.listarSubCategoriasPorId); //listar uma subcategoria por id
app.put('/subcategorias/:id_subcategoria', RotasSubCategorias.atualizarTodosCampos); //atualizar todos os campos de uma subcategoria
app.patch('/subcategorias/id_subcategoria', RotasSubCategorias.atualizar); //atualizar campos especificos de uma subcategoria
app.delete('/subcategorias/:id_subcategoria', RotasSubCategorias.exclusao); //excluir uma subcategoria

const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Api rodando no http://localhost:${PORT}`);
})