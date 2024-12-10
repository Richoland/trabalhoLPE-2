import { Suspense } from "react";
import { Alert, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Loading from "@/componentes/comuns/Loading";
import { redirect } from "next/navigation";
import {
  getUsuarioPorEmailDB,
  updateUsuarioDB,
} from "@/componentes/bd/usecases/usuarioUseCases";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth"; // Ajuste o caminho conforme sua estrutura de pastas

// Server Action para atualizar usuário
const atualizarUsuario = async (formData) => {
  "use server";

  const objeto = {
    id: formData.get("id"),
    nome: formData.get("nome"),
    email: formData.get("email"),
    telefone: formData.get("telefone"),
    senha: formData.get("senha"),
  };

  try {
    await updateUsuarioDB(objeto);
  } catch (err) {
    console.log(err);
    redirect(
      `/user?success=false&message=Erro ao atualizar usuário, tente novamente!`
    );
  }

  redirect(`/user?success=true&message=Dados atualizados com sucesso!`);
};

export default async function UserPage({ searchParams }) {
  // Obtém a sessão do usuário autenticado
  const session = await getServerSession(authOptions);

  // Verifica se o usuário está autenticado e extrai o email
  const email = session?.user?.email;

  let user;
  let userNotFound = false;

  if (!email) {
    // Se não houver email, o usuário não está autenticado
    userNotFound = true;
  } else {
    try {
      user = await getUsuarioPorEmailDB({ email });
    } catch (err) {
      console.error(err);
      userNotFound = true;
    }
  }

  const { success, message } = searchParams || {};

  return (
    <Suspense fallback={<Loading />}>
      <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
        <h1>Usuário autenticado</h1>

        {message && (
          <Alert
            variant={success === "true" ? "success" : "danger"}
            style={{ marginBottom: "20px" }}
          >
            {message}
          </Alert>
        )}

        {userNotFound ? (
          <Alert variant="danger">
            Usuário não encontrado ou não autenticado. Verifique suas
            credenciais.
          </Alert>
        ) : (
          <form action={atualizarUsuario}>
            <input type="hidden" name="id" defaultValue={user.id} />

            <FloatingLabel
              controlId="campoNome"
              label="Nome"
              style={{ marginBottom: "15px" }}
            >
              <Form.Control
                type="text"
                name="nome"
                defaultValue={user.nome}
                required
                placeholder="Nome"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="campoEmail"
              label="Email"
              style={{ marginBottom: "15px" }}
            >
              <Form.Control
                type="email"
                name="email"
                defaultValue={user.email}
                required
                placeholder="Email"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="campoTelefone"
              label="Telefone"
              style={{ marginBottom: "15px" }}
            >
              <Form.Control
                type="tel"
                name="telefone"
                defaultValue={user.telefone}
                required
                placeholder="Telefone"
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="campoSenha"
              label="Senha"
              style={{ marginBottom: "15px" }}
            >
              <Form.Control
                type="password"
                name="senha"
                placeholder="Nova senha"
              />
            </FloatingLabel>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Button variant="secondary" href={`/`}>
                Voltar
              </Button>
              <Button variant="primary" type="submit">
                Atualizar
              </Button>
            </div>
          </form>
        )}
      </div>
    </Suspense>
  );
}
