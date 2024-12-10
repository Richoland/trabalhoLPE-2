import { getJogoPorIdDB } from "@/componentes/bd/usecases/jogoUseCases";
import { notFound } from "next/navigation";
import Loading from "@/componentes/comuns/Loading";
import { Suspense } from "react";
import Link from "next/link";

const JogoDetalhe = async ({ params }) => {
  let jogo = null;
  try {
    jogo = await getJogoPorIdDB(params.jogoCodigo);
    console.log("Parametro recebido:", params.jogoCodigo);
  } catch (err) {
    return notFound();
  }

  if (!jogo) {
    return notFound();
  }

  return (
    <Suspense fallback={<Loading />}>
      <div style={{ padding: "20px" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-sm-3" key={jogo.id}>
              <div className="card mb-3 text-center">
                <div className="card-header">{jogo.nome}</div>
                <div className="card-body">
                  <h5 className="card-title">ID: {jogo.id}</h5>
                  <p className="card-text">{jogo.descricao}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Categoria: {jogo.categoria}
                    </small>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      Jogadores: {jogo.numeroJogadoresMin} -{" "}
                      {jogo.numeroJogadoresMax}
                    </small>
                  </p>
                </div>
                <div className="card-footer text-muted">
                  <Link className="btn btn-success" href={"/"}>
                    Voltar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default JogoDetalhe;
