import React, {useCallback} from "react";
import {Tour, Step} from "./../../lib/index";

const GuideTour = ()=>{

    const controls = useCallback(({prev, next, close, current, length})=>{
        return (
            <div className={"horizontal__controls"}>
                <button onClick={close.bind(null, true)} className={"btn btn--skip"}>skip</button>
                {current !== 0 &&
                    <button onClick={prev} className={"btn btn--prev"}>
                        Prev
                    </button>
                }
                <button onClick={next} className={"btn btn--next"}>
                    { ((current === length - 1) ? "Last" : "Next") + ` ${current + 1} / ${length}`}
                </button>
            </div>
        )
    }, [])

    return (
        <Tour id={"TourVertical"}
              scrollTarget={document.body}
              closeButton={false}
              badge={false}
              controls={controls}
              className={"horizontal"}
              pin={true}
              closeOnBackdrop>
            <Step placement={"center"} onBeforeNext={()=>console.log("onBeforeNext next step")} onBeforeShow={() => console.log("before step show")}>
                <p>
                    This tip is on center of screen <br/>
                    If you click on backdrop then modal will be closed.
                    Check it to see pin !!!
                </p>
            </Step>
            <Step selector={"#roentgenAbout"} placement={"left"} scrollOffsetX={-17}>
                <p>
                    Take a look on completely different system of navigation
                </p>
            </Step>
            <Step selector={"#sources"} placement={"top"}>
                <p>
                    The rest depends on you.
                </p>
            </Step>
        </Tour>
    )
}

export default GuideTour