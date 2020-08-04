import React from "react";

const Intro = ({bus}) => {


    return (
        <section className={"l-container section intro"}>
            <div className={"intro__logo"}>
                <img src={"./logo.png"} alt={"logo"}/>
            </div>
            <div className={"intro__content"}>
                <h3 className={"section__title intro__title"}>Interactive tutorial witch will guide users through your react app</h3>
                <button className={"intro__button button--dark"}
                        onClick={() => bus.start()}>
                    Make a tour
                </button>
                <button className={"intro__button button--light"}>Check on github</button>
            </div>
        </section>
    )
}

export default Intro;