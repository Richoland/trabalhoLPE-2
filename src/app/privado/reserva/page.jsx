import { Table } from "react-bootstrap";
import { Button } from "react-bootstrap";
import {
  getReservasDB,
  deleteReservaDB,
} from "@/componentes/bd/usecases/reservaUseCases";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "@/componentes/comuns/Loading";

const deleteReserva = async (id) => {
  "use server";
  try {
    await deleteReservaDB(id);
  } catch (err) {
    console.log("Erro: " + err);
    throw new Error("Erro: " + err);
  }
  revalidatePath("/privado/reserva/");
  redirect("/privado/reserva/");
};

export default async function Reserva() {
  revalidatePath("/privado/reserva/");

  const reservas = await getReservasDB();

  return (
    <Suspense fallback={<Loading />}>
      <div style={{ padding: "20px" }}>
        <Link
          href={`/privado/reserva/${0}/formulario`}
          className="btn btn-primary"
        >
          <i className="bi bi-file-earmark-plus"></i> Novo
        </Link>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ textAlign: "center" }}>Ações</th>
              <th>ID</th>
              <th>Data da Reserva</th>
              <th>Quantidade de Pessoas</th>
              <th>E-mail do Usuário</th>
              <th>Nome do Jogo</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td align="center">
                  <Link
                    className="btn btn-info"
                    title="Editar"
                    href={`/privado/reserva/${reserva.id}/formulario`}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </Link>
                  <form
                    action={deleteReserva.bind(null, reserva.id)}
                    className="d-inline"
                  >
                    <Button
                      className="btn btn-danger"
                      title="Excluir"
                      type="submit"
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </form>
                </td>
                <td>{reserva.id}</td>
                <td>{new Date(reserva.data_reserva).toLocaleString()}</td>
                <td>{reserva.quantidade_pessoas}</td>
                <td>{reserva.usuario_email}</td>
                <td>{reserva.jogo_nome}</td> {/* Exibe o nome do jogo */}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Suspense>
  );
}
