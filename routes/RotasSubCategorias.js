import { BD } from "../db.js";
 
class RotasSubCategorias {
    static async novaSubCategoria(req, res) {
        const {nome, id_categoria, gasto_fixo, ativo } = req.body;
        try {
            const subcategoria = await BD.query(`INSERT INTO subcategorias (nome, id_categoria, gasto_fixo, ativo)
                VALUES ($1, $2, $3, $4) RETURNING *`, [nome, id_categoria, gasto_fixo, ativo]);
            res.status(201).json('Subcategoria criada com sucesso!');
        } catch (error) {
            console.error("Erro ao criar a subcategoria:", error);
            res.status(500).json({ error: "Erro ao criar a subcategoria" });
        }
    }

    static async listarSubCategorias(req, res) {
        try {
            const subcategorias = await BD.query(`SELECT * FROM subcategorias where ativo = true`);
            res.status(200).json(subcategorias.rows);
        } catch (error) {
            console.error("Erro ao listar as subcategorias:", error);
            res.status(500).json({ error: "Erro ao listar as subcategorias" });
        }
    }

    static async listarSubCategoriasPorId(req,res){
        const { id_subcategoria } = req.params;
        try {
            const subcategoria = await BD.query(`SELECT sc. *, c.nome AS nome FROM subCategorias AS sc
                    LEFT JOIN categorias c ON sc.id_categoria= c.id_categoria WHERE sc.id_categoria = 1
                ORDER BY sc.id_categoria`, [id_subcategoria]);
            if (subcategoria.rows.length === 0) {
                return res.status(404).json({ error: "Subcategoria não encontrado" });
            }
            res.status(200).json(subcategoria.rows[0]);
        } catch (error) {
            console.error("Erro ao listar a subcategoria:", error);
            res.status(500).json({ error: "Erro ao listar a subcategoria" });
        }
    }

    static async atualizarTodosCampos(req,res){
        const { id_subcategoria } = req.params;
        const { nome, id_categoria, gasto_fixo, ativo } = req.body;

        try {
            const categoria = await BD.query(`UPDATE subcategorias SET nome = $1, id_categoria = $2, gasto_fixo = $3, ativo = $4 WHERE id_categoria = $5 RETURNING *`, [nome, id_categoria, gasto_fixo, ativo, id_subcategoria]);
            if (categoria.rows.length === 0) {
                return res.status(404).json({ error: "subCategoria não encontrado" });
            }
            res.status(200).json(categoria.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar a subCategoria:", error);
            res.status(500).json({ error: "Erro ao atualizar a subCategoria" });
        }
    }

    static async atualizar(req,res){
        const { id_subcategoria } = req.params;
        const { nome, id_categoria, gasto_fixo, ativo } = req.body;

        try {
            const campos = [];
            const valores = [];

            if( nome !== undefined){
                campos.push(`nome = $${valores.length + 1}`);
                valores.push(nome);
            }
            if( id_categoria !== undefined){
                campos.push(`id_categoria = $${valores.length + 1}`);
                valores.push(id_categoria);
            }
            if( gasto_fixo !== undefined){
                campos.push(`gasto_fixo = $${valores.length + 1}`);
                valores.push(gasto_fixo);
            }
            if( ativo !== undefined){
                campos.push(`ativo = $${valores.length + 1}`);
                valores.push(ativo);
            }

            if(campos.length === 0){
                return res.status(400).json({ error: "Nenhum campo para atualizar foi fornecido" });
            }

            const query = `UPDATE subcategorias SET ${campos.join(', ')} WHERE id_subcategoria = $${id_subcategoria} RETURNING *`;
            const resultado = await BD.query(query, valores);

            if (resultado.rows.length === 0) {
                return res.status(404).json({ error: "Subcategoria não encontrado" });
            }
            res.status(200).json(resultado.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar a subCategoria:", error);
            res.status(500).json({ error: "Erro ao atualizar a subCategoria" });
            
        }
    }

    static async exclusao(req,res){
        const { id_subcategoria } = req.params;
        try {
            const resultado = await BD.query(`UPDATE subcategorias SET ativo = false WHERE id_categoria = ${id_subcategoria} RETURNING *`);
            if (resultado.rows.length === 0) {
                return res.status(404).json({ error: "Subcategoria não encontrado" });
            }
            res.status(200).json(resultado.rows[0]);
        } catch (error) {
            console.error("Erro ao excluir a subCategoria:", error);
            res.status(500).json({ error: "Erro ao excluir a subCategoria" });
        }
    }
}
export default RotasSubCategorias;