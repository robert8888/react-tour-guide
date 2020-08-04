import React, {useEffect} from "react";
import {useTour} from "../../../../lib";


const Intro = () => {
    let [tour] = useTour("TourVertical");

    useEffect(()=>{
        tour.on("close", () => console.log("onClose"));
        tour.on("beforeClose", () => console.log("onBeforeClose"));
        tour.on("afterClose", () => console.log("onAfterClose"));

        tour.on("beforeOpen", () => console.log("onBeforeOpen"));
        tour.on("open", () => console.log("open"));
        tour.on("afterOpen", () => {console.log("onAfterOpen", tour.step.index, tour.isOpen)});

        tour.on("next", (...args) => {
            console.log("next", args);
            console.log("tour length", tour.length)
        });
        tour.on("change", (...args) => console.log("change", args));
        tour.on("afterScroll", () => console.log("onAfterScroll"));
        tour.on("finish", () => console.log("finish"))
    }, [tour])

    return (
        <section className={"horizontal__section horizontal__section--intro"}>
            <div className={"l-container"}>
                <div className={"l-row-g-xs-20  l-row-g-md-200"}>
                    <div className={"l-col-xs-12 l-col-md-6"}>
                        <img className={"horizontal__intro__logo"} src="/rtg-logo-white.png" alt={"logo rtg"}/>
                    </div>
                    <div className={"l-col-xs-12 l-col-md-6"}>
                        <div>
                            <h2 className={"section__title"}> R - react </h2>
                            <h2 className={"section__title"}> T - tour </h2>
                            <h2 className={"section__title"}> G - guide </h2>
                        </div>
                    </div>
                </div>
                <div className={"l-row-g-xs-20 l-row-g-lg-100"}>
                    <div className={"l-col-xs-12"}>
                        <h3 className={"section__title intro__title"}>Interactive tutorial witch will guide users through your react app</h3>
                        <button onClick={() => tour.get("TourVertical").open()}>Start tour</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Intro;