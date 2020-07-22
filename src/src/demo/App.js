import React from 'react';
import GuideTour from "./Tour/GuideTour";
import "./style/page.scss";

const App = () => (
  <div>
      <GuideTour/>
      <main className={"page"}>
        <section className={"intro"}>
            <div className={"intro__logo"}>
                <img src={"./react-tour-logo.png"}/>
                <h3>Interactive tutorial witch will guide users through your react app</h3>
                <button className={"intro__button"}>Make a tour</button>
                <button className={"intro__button"}>Check on github</button>
            </div>

        </section>
      </main>
  </div>
);

export default App;
