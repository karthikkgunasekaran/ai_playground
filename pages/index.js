import Head from "next/head";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Navbar, Nav } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

import Playground from "./playground";
import FineTune from "./fineTune";
import indexStyles from "./index.module.css";

export default function Home() {

  const [activePage, setActivePage] = useState("playground");
  const [collapsed, setCollapsed] = useState(true);

  const handlePageChange = (page) => {
    setActivePage(page);
    setCollapsed(true);
  };

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={indexStyles.wrapper}>
      <Head>
        <title>OpenAI Play Ground</title>
      </Head>
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">OpenAI Playground</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="ms-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link
                href="#playground"
                active={activePage === "playground"}
                onClick={() => handlePageChange("playground")}
              >
                Playground
              </Nav.Link>
              <Nav.Link
                href="#fine-tune"
                active={activePage === "fine-tune"}
                onClick={() => handlePageChange("fine-tune")}
              >
                Fine-tune
              </Nav.Link>
            </Nav>
            <Button variant="outline-success" className="me-2">
              <FontAwesomeIcon icon={faCog} />
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container-fluid">
        <div className="row">
          <div className={`${indexStyles.main} offset-1 col-md-10`}>
            {activePage === "playground" && (
              <Playground />
            )}

            {activePage === "fine-tune" && (
              <FineTune />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

