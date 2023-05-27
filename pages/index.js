import Head from "next/head";
import { useState } from "react";

import Playground from "./playground";
import FineTune from "./fineTune";
import indexStyles from "./index.module.css";

export default function Home() {

  const [activePage, setActivePage] = useState("playground");

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div>
      <Head>
        <title>Mr.Cool - OpenAI Fine-Tuning</title>
        <link rel="icon" href="/dhoni.png" />
      </Head>
      <main className={indexStyles.main}>
        <img src="/dhoni.png" className={indexStyles.icon} />
        <h3>OpenAI Playground</h3>
        <header className={indexStyles.header}>
          <nav className={indexStyles.nav}>
            <button
              className={activePage === "playground" ? indexStyles.active : ""}
              onClick={() => handlePageChange("playground")}>
              Playground
            </button>
            <button
              className={activePage === "fine-tune" ? indexStyles.active : ""}
              onClick={() => handlePageChange("fine-tune")}>
              Fine-tune
            </button>
          </nav>
        </header>
        {activePage === "playground" && (
          <Playground />
        )}

        {activePage === "fine-tune" && (
          <FineTune />
        )}

      </main>
    </div>
  );
}
