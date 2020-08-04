import React, { useRef } from "react";
import useSlider from "../../hooks/useSlider";


const Slider = () => {
    const slider = useRef();
    const [prev, next, mouseDown] = useSlider(slider);

    return (
        <section className={"l-section--slider"}>
            <div className={"l-container"}>
                <div className={"l-row"}>
                    <div className={"l-col-xs-12"}>
                        <div className={"c-slider__container"}>
                            <div className={"c-slider"}>
                                <button onClick={prev} className={"c-slider__button c-slider__button--prev"}>{"\u25EF"}</button>
                                <ul className={"c-slider__slides"} onMouseDown={mouseDown} onTouchStart={mouseDown} ref={slider}>
                                    <li className={"c-slider__slide"} data-rtg={"slider-1"}>
                                        <div className={"card"}>
                                            <h1> 1 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Complete
                                            </h5>
                                            <p>
                                                You should have a good plan
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"}>
                                        <div className={"card"}>
                                            <h1> 2 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Consistent
                                            </h5>
                                            <p>
                                                Don't change your style
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"}>
                                        <div className={"card"}>
                                            <h1> 3 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Precise
                                            </h5>
                                            <p>
                                                Keep eye on detail
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"}>
                                        <div className={"card"}>
                                            <h1> 4 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Unexpired
                                            </h5>
                                            <p>
                                                always keep it up to date
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"}>
                                        <div className={"card"}>
                                            <h1> 5 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Clear
                                            </h5>
                                            <p>
                                                your people will catch it
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"}>
                                        <div className={"card"}>
                                            <h1> 6 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Standardized
                                            </h5>
                                            <p>
                                                stick to the rules
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"}>
                                        <div className={"card"}>
                                            <h1> 7 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Complete
                                            </h5>
                                            <p>
                                                You should have a good plan
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"}>
                                        <div className={"card"}>
                                            <h1> 8 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Consistent
                                            </h5>
                                            <p>
                                                Don't change your style
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"}>
                                        <div className={"card"}>
                                            <h1> 9 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Precise
                                            </h5>
                                            <p>
                                                Keep eye on detail
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"}>
                                        <div className={"card"}>
                                            <h1> 10 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Unexpired
                                            </h5>
                                            <p>
                                                always keep it up to date
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"} data-rtg={"slider-10"}>
                                        <div className={"card"}>
                                            <h1> 11 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Clear
                                            </h5>
                                            <p>
                                                your people will catch it
                                            </p>
                                        </div>
                                    </li>
                                    <li className={"c-slider__slide"}>
                                        <div className={"card"}>
                                            <h1> 12 </h1>
                                            <h5 className={"card__title title--underscored"}>
                                                Standardized
                                            </h5>
                                            <p>
                                                stick to the rules
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                                <button onClick={next} className={"c-slider__button c-slider__button--next"}>{"\u25EF"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Slider;