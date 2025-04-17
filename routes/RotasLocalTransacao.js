import { BD } from "../db.js";
import jwt from "jsonwebtoken";
const secretKey = "chave-secreta";

class RotasLocalTransacao {
    static async nova(req, res) {
        const { nome, tipo_local, saldo, ativo } = req.body;
        try {
            const localTransacao = await BD.query(`INSERT INTO local_transacao (nome, tipo_local, saldo, ativo)
                VALUES ($1, $2, $3, $4) RETURNING *`, [nome, tipo_local, saldo, ativo]);
            res.status(201).json('Local de transação criado com sucesso!');
        } catch (error) {
            console.error("Erro ao criar o local de transação:", error);
            res.status(500).json({ error: "Erro ao criar o local de transação" });
        }
    }

    static async listar(req, res) {
        try {
            const localTransacao = await BD.query(`SELECT * FROM local_transacao where ativo = true`);
            res.status(200).json(localTransacao.rows);
        } catch (error) {
            console.error("Erro ao listar os locais de transação:", error);
            res.status(500).json({ error: "Erro ao listar os locais de transação" });
        }
    }

    static async listarporID(req,res){
        const { id_localTransacao } = req.params;
        try {
            const localTransacao = await BD.query(`SELECT * FROM local_transacao WHERE id_local_transacao = $1`, [id_localTransacao]);
            if (localTransacao.rows.length === 0) {
                return res.status(404).json({ error: "Local de transação não encontrado" });
            }
            res.status(200).json(localTransacao.rows[0]);
        } catch (error) {
            console.error("Erro ao listar o local de transação:", error);
            res.status(500).json({ error: "Erro ao listar o local de transação" });
        }
    }

    static async atualizarTodos(req,res) {
        const { id_localTransacao } = req.params;
        const { nome, tipo_local, saldo, ativo } = req.body;

        try {
            const local_transacao = await BD.query(`UPDATE local_transacao SET nome = $1, tipo_local = $2, saldo = $3, ativo = $4 WHERE id_local_transacao = $5 RETURNING *`, [nome, tipo_local, saldo, ativo, id_localTransacao]);
            if (local_transacao.rows.length === 0) {
                return res.status(404).json({ error: "Local de transação não encontrado" });
            }
            res.status(200).json(local_transacao.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar local de transação:", error);
            res.status(500).json({ error: "Erro ao atualizar o local de transação" });
        }
    }

    static async deletar(req,res){
        const { id_localTransacao } = req.params;
        try {
            const local_transacao = await BD.query(`UPDATE local_transacao SET ativo = false WHERE id_local_transacao = $1 RETURNING *`, [id_localTransacao]);
            if (local_transacao.rows.length === 0) {
                return res.status(404).json({ error: "Local de transação não encontrado" });
            }
            res.status(200).json(local_transacao.rows[0]);
        } catch (error) {
            console.error("Erro ao deletar o local de transação:", error);
            res.status(500).json({ error: "Erro ao deletar o local de transação" });
        }
    }

    static async atualizar(req,res){
        const { id_localTransacao } = req.params;
        const { nome, tipo_local, saldo, ativo } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`);
                valores.push(nome);
            }

            if (tipo_local !== undefined) {
                campos.push(`tipo_local = $${valores.length + 1}`);
                valores.push(tipo_local);
            }

            if (saldo !== undefined) {
                campos.push(`saldo = $${valores.length + 1}`);
                valores.push(saldo);
            }

            if (ativo !== undefined) {
                campos.push(`ativo = $${valores.length + 1}`);
                valores.push(ativo);
            }

            if (campos.length === 0) {
                return res.status(400).json({ error: "Nenhum campo para atualizar foi fornecido" });
            }

            const query = `UPDATE local_transacao SET ${campos.join(", ")} WHERE id_local_transacao = ${id_localTransacao} RETURNING *`;
            const local_transacao = await BD.query(query, valores);

            if (local_transacao.rows.length === 0) {
                return res.status(404).json({ error: "Local de transação não encontrado" });
            }

            res.status(200).json(local_transacao.rows[0]);

        } catch (error) {
            console.error("Erro ao atualizar o local de transação:", error);
            res.status(500).json({ error: "Erro ao atualizar o local de transação" });
        }
    }
}

export function autenticarToken4(req, res, next){
    //extrair o token do cabeçalho da requisição
    const token = req.headers['authorization'] //bearer<token>

    //verificar se o token foi fornecido na requisição
    if (!token) return res.status(403).json({message: 'Token não fornecido'})

    //verificar se o token é válido
    jwt.verify(token.split(' ')[1], secretKey, (err, local_transacao ) => {
        if(err) return res.status(403).json({mensagem: 'Token inválido'})

        //se o token é válido, adiciona os dados do usuario (decoficados no token)
        //tornando essas informações disponíveis nas rotas que precisam da autenticação
        req.local_transacao = local_transacao;
        next(); //continua para a próxima rota
    })
}

export default RotasLocalTransacao