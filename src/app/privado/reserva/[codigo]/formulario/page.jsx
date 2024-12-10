import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  getReservaPorIdDB,
  addReservaDB,
  updateReservaDB,
  getEmailsUsuariosDB,
} from "@/componentes/bd/usecases/reservaUseCases";
import { getNomesJogosDB } from "@/componentes/bd/usecases/jogoUseCases";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Suspense } from "react";
import Loading from "@/componentes/comuns/Loading";

const FormularioReservaPage = async ({ params }) => {
  let reserva = null;
  let emailsUsuarios = []; // Lista de e-mails dos usuários
  let nomesJogos = []; // Lista de nomes dos jogos

  // Carrega os e-mails dos usuários
  try {
    emailsUsuarios = await getEmailsUsuariosDB();
  } catch (err) {
    console.error("Erro ao carregar e-mails dos usuários:", err);
  }

  // Carrega os nomes dos jogos
  try {
    nomesJogos = await getNomesJogosDB();
  } catch (err) {
    console.error("Erro ao carregar nomes dos jogos:", err);
  }

  // Configura a reserva
  if (params.codigo == 0) {
    reserva = {
      id: 0,
      data_reserva: "",
      quantidade_pessoas: 1,
      usuario_email: "",
      jogo_id: "",
    };
  } else {
    try {
      reserva = await getReservaPorIdDB(params.codigo);
    } catch (err) {
      return notFound();
    }
  }

  const salvarReserva = async (formData) => {
    "use server";
    const objeto = {
      id: formData.get("id"),
      data_reserva: formData.get("data_reserva"),
      quantidade_pessoas: parseInt(formData.get("quantidade_pessoas")),
      usuario_email: formData.get("usuario_email"),
      jogo_id: parseInt(formData.get("jogo_id")),
    };
    try {
      if (objeto.id == 0) {
        await addReservaDB(objeto);
      } else {
        await updateReservaDB(objeto);
      }
    } catch (err) {
      throw new Error("Erro: " + err);
    }
    revalidatePath("/privado/reserva/");
    redirect("/privado/reserva");
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div style={{ textAlign: "center" }}>
          <h2>Reserva</h2>
        </div>
        <form action={salvarReserva}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6">
                <div>
                  <FloatingLabel
                    controlId="campoId"
                    label="ID"
                    className="mb-3"
                  >
                    <Form.Control
                      type="number"
                      defaultValue={reserva.id}
                      readOnly
                      name="id"
                    />
                  </FloatingLabel>
                </div>
                <div>
                  <FloatingLabel
                    controlId="campoDataReserva"
                    label="Data da Reserva"
                    className="mb-3"
                  >
                    <Form.Control
                      type="datetime-local"
                      defaultValue={reserva.data_reserva}
                      required
                      name="data_reserva"
                    />
                  </FloatingLabel>
                </div>
                <div>
                  <FloatingLabel
                    controlId="campoQuantidadePessoas"
                    label="Quantidade de Pessoas"
                    className="mb-3"
                  >
                    <Form.Control
                      type="number"
                      defaultValue={reserva.quantidade_pessoas}
                      required
                      name="quantidade_pessoas"
                    />
                  </FloatingLabel>
                </div>
                <div>
                  <FloatingLabel
                    controlId="campoUsuarioEmail"
                    label="E-mail do Usuário"
                    className="mb-3"
                  >
                    <Form.Select
                      name="usuario_email"
                      defaultValue={reserva.usuario_email}
                      required
                    >
                      <option value="">Selecione o e-mail</option>
                      {emailsUsuarios.map((email) => (
                        <option key={email} value={email}>
                          {email}
                        </option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </div>
                <div>
                  <FloatingLabel
                    controlId="campoJogoId"
                    label="Selecione o Jogo"
                    className="mb-3"
                  >
                    <Form.Select
                      name="jogo_id"
                      defaultValue={reserva.jogo_id}
                      required
                    >
                      <option value="">Selecione o jogo</option>
                      {nomesJogos.map((jogo) => (
                        <option key={jogo.id} value={jogo.id}>
                          {jogo.nome}
                        </option>
                      ))}
                    </Form.Select>
                  </FloatingLabel>
                </div>
                <div className="form-group text-center mt-3">
                  <button type="submit" className="btn btn-success">
                    Salvar <i className="bi bi-save"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Suspense>
    </>
  );
};

export default FormularioReservaPage;
