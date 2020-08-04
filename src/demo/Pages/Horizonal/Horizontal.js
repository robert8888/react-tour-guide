import React, {useRef, useEffect} from "react";
import {
    Intro,
    Roentgen,
    Sources
} from "./Sections";
import useFullPageSlider from "../hooks/useFullPageSlider";
import {useTour} from "../../../lib";


const Horizontal = () => {
    const slider = useRef();
    const [tour] = useTour("TourVertical")

    const [prev, next, pointerStart, update] = useFullPageSlider(slider);

    useEffect(()=>{
        tour.on("afterScroll", update);
    },[update, tour])

    return (
        <main className={"page__horizontal"}>
            <div className={"page__horizontal__slider"} >
                <div className={"c-fp-slider__controls"}>
                    <button onClick={prev} className={"c-fp-slider__button c-fp-slider__button--prev"}>{"<"}</button>
                    <button onClick={next} className={"c-fp-slider__button c-fp-slider__button--next"}>{">"}</button>
                </div>
                <ul className={"c-fp-slider"} ref={slider} onMouseDown={pointerStart} onTouchStart={pointerStart}>
                    <li className={"c-fp-slider__slide"}><Intro/></li>
                    <li className={"c-fp-slider__slide"}><Roentgen/></li>
                    <li className={"c-fp-slider__slide"}><Sources/></li>
                </ul>
            </div>
        </main>
    )
}

export default Horizontal;