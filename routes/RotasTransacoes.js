import { BD } from "../db.js";
import jwt from "jsonwebtoken";
const secretKey = "chave-secreta";

class RotasTransacoes {
  static async nova(req, res) {
    const {
      valor,
      descricao,
      data_transacao,
      data_vencimento,
      data_pagamento,
      tipo_transacao,
      id_local_transacao,
      id_categoria,
      id_subcategoria,
      id_usuario,
      num_parcelas,
      parcela_atual,
    } = req.body;
    try {
      const transacao = await BD.query(
        `INSERT INTO transacoes (valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_local_transacao, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [
          valor,
          descricao,
          data_transacao,
          data_vencimento,
          data_pagamento,
          tipo_transacao,
          id_local_transacao,
          id_categoria,
          id_subcategoria,
          id_usuario,
          num_parcelas,
          parcela_atual,
        ]
      );
      res.status(201).json("Transação criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar a transação:", error);
      res.status(500).json({ error: "Erro ao criar a transação" });
    }
  }
  static async listar(req, res) {
    try {
      const transacoes = await BD.query(`
    SELECT 
        t.id_transacao,
        t.valor,
        t.descricao,
        t.data_transacao,
        t.data_vencimento,
        t.data_pagamento,
        t.tipo_transacao,
        t.num_parcelas,
        t.parcela_atual,

        lt.nome AS nome_local_transacao,
        c.nome AS nome_categoria,
        sc.nome AS nome_subcategoria,
        u.nome AS nome_usuario

        FROM transacoes t
        LEFT JOIN local_transacao lt ON t.id_local_transacao = lt.id_local_transacao
        LEFT JOIN categorias c ON t.id_categoria = c.id_categoria
        LEFT JOIN subcategorias sc ON t.id_subcategoria = sc.id_subcategoria
        JOIN usuarios u ON t.id_usuario = u.id_usuario;`);
        res.status(200).json(transacoes.rows);
    } catch (error) {
      console.error("Erro ao listar as transações:", error);
      res.status(500).json({ error: "Erro ao listar as transações" });
    }
  }

  static async listarPorID(req,res){
    const { id_transacao } = req.params;
    try {
        const transacao = await BD.query(`SELECT 
        t.id_transacao,
        t.valor,
        t.descricao,
        t.data_transacao,
        t.data_vencimento,
        t.data_pagamento,
        t.tipo_transacao,
        t.num_parcelas,
        t.parcela_atual,

        lt.nome AS nome_local_transacao,
        c.nome AS nome_categoria,
        sc.nome AS nome_subcategoria,
        u.nome AS nome_usuario

        FROM transacoes t
        LEFT JOIN local_transacao lt ON t.id_local_transacao = lt.id_local_transacao
        LEFT JOIN categorias c ON t.id_categoria = c.id_categoria
        LEFT JOIN subcategorias sc ON t.id_subcategoria = sc.id_subcategoria
        JOIN usuarios u ON t.id_usuario = u.id_usuario
        ORDER BY t.id_transacao ASC;`)
    } catch (error) {
        console.error("Erro ao listar a transação:", error);
        res.status(500).json({ error: "Erro ao listar a transação" });
    }
  }

  static async atualizarTodos(req,res) {
    const { id_transacao } = req.params;
    const {
      valor,
      descricao,
      data_transacao,
      data_vencimento,
      data_pagamento,
      tipo_transacao,
      id_local_transacao,
      id_categoria,
      id_subcategoria,
      id_usuario,
      num_parcelas,
      parcela_atual,
    } = req.body;

    try {
      const transacao = await BD.query(
        `UPDATE transacoes SET valor = $1, descricao = $2, data_transacao = $3, data_vencimento = $4, data_pagamento = $5, tipo_transacao = $6, id_local_transacao = $7, id_categoria = $8, id_subcategoria = $9, id_usuario = $10, num_parcelas = $11, parcela_atual = $12 WHERE id_transacao = $13 RETURNING *`,
        [
          valor,
          descricao,
          data_transacao,
          data_vencimento,
          data_pagamento,
          tipo_transacao,
          id_local_transacao,
          id_categoria,
          id_subcategoria,
          id_usuario,
          num_parcelas,
          parcela_atual,
          id_transacao,
        ]
      );

      if (transacao.rows.length === 0) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }
      res.status(200).json("Transação atualizada com sucesso!");
    }
      catch(error){
        console.error("Erro ao atualizar a transação:", error);
        res.status(500).json({ error: "Erro ao atualizar a transação" });
      }
    }

    static async atualizar(req,res){
        const { id_transacao } = req.params;
        const {
            valor,
            descricao,
            data_transacao,
            data_vencimento,
            data_pagamento,
            tipo_transacao,
            id_local_transacao,
            id_categoria,
            id_subcategoria,
            id_usuario,
            num_parcelas,
            parcela_atual,
          } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (valor !== undefined) {
                campos.push(`valor = $${valores.length + 1}`)
                valores.push(valor);
            }

            if (descricao !== undefined) {
                campos.push(`descricao = $${valores.length + 1}`)
                valores.push(descricao);
            }

            if (data_transacao !== undefined) {
                campos.push(`data_transacao = $${valores.length + 1}`)
                valores.push(data_transacao);
            }

            if (data_vencimento !== undefined) {
                campos.push(`data_vencimento = $${valores.length + 1}`)
                valores.push(data_vencimento);
            }

            if (data_pagamento !== undefined) {
                campos.push(`data_pagamento = $${valores.length + 1}`)
                valores.push(data_pagamento);
            }

            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`)
                valores.push(tipo_transacao);
            }

            if (id_local_transacao !== undefined) {
                campos.push(`id_local_transacao = $${valores.length + 1}`)
                valores.push(id_local_transacao);
            }

            if (id_categoria !== undefined) {
                campos.push(`id_categoria = $${valores.length + 1}`)
                valores.push(id_categoria);
            }

            if (id_subcategoria !== undefined) {
                campos.push(`id_subcategoria = $${valores.length + 1}`)
                valores.push(id_subcategoria);
            }

            if (id_usuario !== undefined) {
                campos.push(`id_usuario = $${valores.length + 1}`)
                valores.push(id_usuario);
            }

            if (num_parcelas !== undefined) {
                campos.push(`num_parcelas = $${valores.length + 1}`)
                valores.push(num_parcelas);
            }

            if (parcela_atual !== undefined) {
                campos.push(`parcela_atual = $${valores.length + 1}`)
                valores.push(parcela_atual);
            }

            if (campos.length === 0) {
                return res.status(400).json({ error: "Nenhum campo para atualizar" });
            }
            const query = `UPDATE transacoes SET ${campos.join(", ")} WHERE id_transacao = ${id_transacao} RETURNING *`;
            const transacao = await BD.query(query, valores);

            if (transacao.rows.length === 0) {
                return res.status(404).json({ error: "Transação não encontrada" });
            }

            res.status(200).json("Transação atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar a transação:", error);
            res.status(500).json({ error: "Erro ao atualizar a transação" });
        }
    }

    static async deletar(req,res){
        const { id_transacao } = req.params;

        try {
            const transacao = await BD.query("DELETE FROM transacoes WHERE id_transacao = $1 RETURNING *", [id_transacao]);
            if (transacao.rows.length === 0) {
                return res.status(404).json({ error: "Transação não encontrada" });
            }
            res.status(200).json("Transação excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir a transação:", error);
            res.status(500).json({ error: "Erro ao excluir a transação" });
            
        }
    }
}
export function autenticarToken5(req, res, next){
    //extrair o token do cabeçalho da requisição
    const token = req.headers['authorization'] //bearer<token>

    //verificar se o token foi fornecido na requisição
    if (!token) return res.status(403).json({message: 'Token não fornecido'})

    //verificar se o token é válido
    jwt.verify(token.split(' ')[1], secretKey, (err, transacoes ) => {
        if(err) return res.status(403).json({mensagem: 'Token inválido'})

        //se o token é válido, adiciona os dados do usuario (decoficados no token)
        //tornando essas informações disponíveis nas rotas que precisam da autenticação
        req.transacoes = transacoes;
        next(); //continua para a próxima rota
    })
}

export default RotasTransacoes;
