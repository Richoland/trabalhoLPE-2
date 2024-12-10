import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Loading from "@/componentes/comuns/Loading";
import { Suspense } from "react";
import { addUsuarioDB } from "@/componentes/bd/usecases/usuarioUseCases";
import { Button, Alert } from "react-bootstrap";

// Função para pegar query params
const getQueryParams = (search) => {
  const params = new URLSearchParams(search);
  return {
    success: params.get("success"),
    message: params.get("message"),
  };
};

const RegistroUsuarioPage = async ({ searchParams }) => {
  const { success, message } = getQueryParams(searchParams);

  const salvarUsuario = async (formData) => {
    "use server";

    const objeto = {
      email: formData.get("email"),
      senha: formData.get("senha"),
      tipo: "U",
      telefone: formData.get("telefone"),
      nome: formData.get("nome"),
    };

    try {
      await addUsuarioDB(objeto);
    } catch (err) {
      console.log(err);
      redirect(
        `/register?success=false&message=Erro ao adicionar usuário, tente novamente!`
      );
    }
    redirect("/register?success=true&message=Usuário registrado com sucesso!");
  };

  return (
    <Suspense fallback={<Loading />}>
      <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
          Registrar Usuário
        </h2>

        {message && (
          <Alert
            variant={success === "true" ? "success" : "danger"}
            style={{ marginBottom: "20px" }}
          >
            {message}
          </Alert>
        )}

        <form action={salvarUsuario}>
          <FloatingLabel
            controlId="campoNome"
            label="Nome"
            style={{ marginBottom: "15px" }}
          >
            <Form.Control type="text" required name="nome" placeholder="Nome" />
          </FloatingLabel>

          <FloatingLabel
            controlId="campoEmail"
            label="Email"
            style={{ marginBottom: "15px" }}
          >
            <Form.Control
              type="email"
              required
              name="email"
              placeholder="Email"
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="campoSenha"
            label="Senha"
            style={{ marginBottom: "15px" }}
          >
            <Form.Control
              type="password"
              required
              name="senha"
              placeholder="Senha"
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="campoTelefone"
            label="Telefone"
            style={{ marginBottom: "15px" }}
          >
            <Form.Control
              type="tel"
              required
              name="telefone"
              placeholder="Telefone"
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
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Registrar
            </Button>
          </div>
        </form>
      </div>
    </Suspense>
  );
};

export default RegistroUsuarioPage;
