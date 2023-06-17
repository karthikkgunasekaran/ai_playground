import Head from "next/head";
import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWrench } from "@fortawesome/free-solid-svg-icons";

import Complete from "./complete";
import FineTune from "./fineTune";
import Files from "./files";
import Settings from "./settings";
import indexStyles from "./index.module.css";

const pages = [
  { id: "complete", title: "Completions" },
  { id: "fine-tune", title: "Fine-tuned Models" },
  { id: "files", title: "Files" },
  { id: "settings", title: "Settings" }
];

export default function Home() {
  const [activePage, setActivePage] = useState(pages[0].id);
  const [apiKey, setApiKey] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem("auth-openai-apikey");
    setApiKey(storedApiKey);
    if (storedApiKey == undefined || storedApiKey == '') {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [activePage]);

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
  };

  return (
    <div className={indexStyles.wrapper}>
      <Head>
        <title>OpenAI Playground</title>
      </Head>
      <div className="container-fluid">
        <div className="row">
          <nav className={`${indexStyles.topNavBar} navbar`}>
            <div className="col-md-2">
              <a className={indexStyles.brand} href="#">
                <FontAwesomeIcon icon={faWrench}/>
                <span className="ms-2">Open AI Playground</span>
              </a>
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
        {showBanner && (
          <div className={`${indexStyles.banner} row bg-light d-flex align-items-center justify-content-center`}>
            <div className="col-md-11">
              <p className={`${indexStyles.bannerText} text-center text-danger`}>
                API Key is not configured, set your OpenAI API Key through Settings.
              </p>
            </div>
          </div>
        )}
        <div className="row" style={{ height: "100vh" }}>
          <div className={`${indexStyles.sidebar} col-md-2 d-flex flex-column`}>
            <ul className="nav flex-column flex-grow-1">
              {pages.map((page) => (
                <li className="nav-item" key={page.id}>
                  <a
                    className={`nav-link ${activePage === page.id ? indexStyles.activeLink : indexStyles.inactiveLink}`}
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
            {activePage === "settings" && (
              <Settings />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
