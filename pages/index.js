import Head from "next/head";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Complete from "./complete";
import FineTune from "./fineTune";
import Files from "./files";
import indexStyles from "./index.module.css";

const pages = [
  { id: "complete", title: "Completions" },
  { id: "fine-tune", title: "Fine-tuned Models" },
  { id: "files", title: "Files" }
];

export default function Home() {
  const [activePage, setActivePage] = useState(pages[0].id);

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
  };

  return (
    <div className={indexStyles.wrapper}>
      <Head>
        <title>OpenAI Play Ground</title>
      </Head>

      <div className="container-fluid">
        <div className="row">
          <nav className={`${indexStyles.topNavBar} navbar`}>
            <div className="col-md-2">
              <a className={indexStyles.brand} href="#">Open AI Playground</a>
            </div>
            <div className={`${indexStyles.currentPageTitle} col-md-10`}>
              {pages.map((page) => {
                if (activePage === page.id) {
                  return <span key={page.id}>{page.title}</span>;
                }
                return null;
              })}
            </div>
          </nav>
        </div>
        <div className="row">
          <div className={`${indexStyles.sidebar} col-md-2`}>
            <ul className="nav flex-column">
              {pages.map((page) => (
                <li className="nav-item" key={page.id}>
                  <a
                    className={`nav-link ${activePage === page.id ? "active" : ""}`}
                    href={`#${page.id}`}
                    onClick={() => handlePageChange(page.id)}
                  >
                    {page.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${indexStyles.main} col-md-10`}>
            {activePage === "complete" && (
              <Complete />
            )}
            {activePage === "fine-tune" && (
              <FineTune />
            )}
            {activePage === "files" && (
              <Files />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
