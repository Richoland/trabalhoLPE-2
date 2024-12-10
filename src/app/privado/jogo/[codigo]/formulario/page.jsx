import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  getJogoPorIdDB,
  addJogoDB,
  updateJogoDB,
} from "@/componentes/bd/usecases/jogoUseCases";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { Suspense } from "react";
import Loading from "@/componentes/comuns/Loading";

const FormularioPage = async ({ params }) => {
  let jogo = null;

  if (params.codigo == 0) {
    jogo = {
      id: 0,
      nome: "",
      descricao: "",
      categoria: "",
      numeroJogadoresMin: "",
      numeroJogadoresMax: "",
    };
  } else {
    try {
      jogo = await getJogoPorIdDB(params.codigo);
    } catch (err) {
      return notFound();
    }
  }

  const salvarJogo = async (formData) => {
    "use server";
    const objeto = {
      id: formData.get("id"),
      nome: formData.get("nome"),
      descricao: formData.get("descricao"),
      categoria: formData.get("categoria"),
      numeroJogadoresMin: parseInt(formData.get("numeroJogadoresMin")),
      numeroJogadoresMax: parseInt(formData.get("numeroJogadoresMax")),
    };
    try {
      if (objeto.id == 0) {
        await addJogoDB(objeto);
      } else {
        await updateJogoDB(objeto);
      }
    } catch (err) {
      throw new Error("Erro: " + err);
    }
    revalidatePath("/privado/jogo/");
    redirect("/privado/jogo");
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <div style={{ textAlign: "center" }}>
          <h2>Jogo</h2>
        </div>
        <form action={salvarJogo}>
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
                      defaultValue={jogo.id}
                      readOnly
                      name="id"
                    />
                  </FloatingLabel>
                </div>
                <div>
                  <FloatingLabel
                    controlId="campoNome"
                    label="Nome"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      defaultValue={jogo.nome}
                      required
                      name="nome"
                    />
                  </FloatingLabel>
                </div>
                <div>
                  <FloatingLabel
                    controlId="campoDescricao"
                    label="Descrição"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      defaultValue={jogo.descricao}
                      required
                      name="descricao"
                      as="textarea"
                      style={{ height: "100px" }}
                    />
                  </FloatingLabel>
                </div>
                <div>
                  <FloatingLabel
                    controlId="campoCategoria"
                    label="Categoria"
                    className="mb-3"
                  >
                    <Form.Control
                      type="text"
                      defaultValue={jogo.categoria}
                      required
                      name="categoria"
                    />
                  </FloatingLabel>
                </div>
                <div>
                  <FloatingLabel
                    controlId="campoJogadoresMin"
                    label="Número mínimo de jogadores"
                    className="mb-3"
                  >
                    <Form.Control
                      type="number"
                      defaultValue={jogo.numeroJogadoresMin}
                      required
                      name="numeroJogadoresMin"
                    />
                  </FloatingLabel>
                </div>
                <div>
                  <FloatingLabel
                    controlId="campoJogadoresMax"
                    label="Número máximo de jogadores"
                    className="mb-3"
                  >
                    <Form.Control
                      type="number"
                      defaultValue={jogo.numeroJogadoresMax}
                      required
                      name="numeroJogadoresMax"
                    />
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

export default FormularioPage;
