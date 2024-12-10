"use client";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

function Menu() {
  const { data: session } = useSession();

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Link className="navbar-brand" href={"/"}>
          Paradise RPG
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="nav-link" href={"/"}>
              Home
            </Link>
            {session?.user?.tipo === "A" && (
              <NavDropdown title="Manutenções" id="basic-nav-dropdown">
                <Link className="dropdown-item" href={"/privado/reserva"}>
                  Reservas
                </Link>
                <Link className="dropdown-item" href={"/privado/jogo"}>
                  Jogos
                </Link>
              </NavDropdown>
            )}
            <NavDropdown
              title={session == null ? "Login" : session.user.name}
              id="basic-nav-dropdown"
            >
              {session == null && (
                <form action={() => signIn()}>
                  <button type="submit" className="dropdown-item">
                    Login
                  </button>
                </form>
              )}
              {session != null && (
                <>
                  <Link className="dropdown-item" href={"/user"}>
                    Dados do usuário
                  </Link>
                  <form action={() => signOut({ callbackUrl: "/" })}>
                    <button type="submit" className="dropdown-item">
                      Logout
                    </button>
                  </form>
                </>
              )}
            </NavDropdown>
            <Link className="nav-link active" href={"/reservas"}>
              Reserve Aqui!
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;
