import React, {useRef, useMemo, useCallback, useState, useEffect} from "react";
import PropType from "prop-types";
import throttle from "../utils/throttle";
import "./backdrop.scss";

const propTypes = {
    target: PropType.instanceOf(HTMLElement), // target html node element
    visible: PropType.bool, //
    offsetX: PropType.number, // offset backdrop mask from border of bbox around target
    offsetY: PropType.number, //
    scrollTarget: PropType.oneOfType([ // scrolled target element - main scroll usually and by default window
        PropType.instanceOf(Window),
        PropType.instanceOf(HTMLElement)
    ])
}

const Backdrop = ({target, visible, offsetX, offsetY, scrollTarget}) =>{
    const layer = useRef();
    const [layerStyle, setLayerStyle] = useState(null);

    /**
     * update backdrop layer position in relation to target bbox coordinates
     * @type {function(target: HTMLElement): void}
     */
    const updatePosition = useCallback((target)=>{
        if(!target) {
            //hidden out of screen but shadow will cover it
            setLayerStyle({top: -50, left: -50, width: 10, height: 10,})
            return ;
        }
        let tRect = target.getBoundingClientRect();
        const scrollY = scrollTarget.scrollY || scrollTarget.scrollTop || 0;
        const scrollX = scrollTarget.scrollX || scrollTarget.scrollLeft || 0 ;

        setLayerStyle({
            top: tRect.top + scrollY - offsetY + "px",
            left: tRect.left + scrollX - offsetX +"px",
            width: tRect.width + (2 * offsetX)  + "px",
            height: tRect.height + ( 2 * offsetY) +"px",
        })
    }, [setLayerStyle, offsetX, offsetY, scrollTarget])

    /**
     * call update layer position in response on change target html node element
     */
    useEffect(()=>{
        updatePosition(target);
    }, [updatePosition, target])

    /**
     * call update layer position in response on change window size
     */
    useEffect(()=>{
        let update = throttle(updatePosition.bind(null, target), 100);
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("resize", update);
        }
    }, [target, updatePosition])

    /**
     * update backdrop layer class name depends on visibility state
     * @type {string}
     */
    const layerClasses = useMemo(()=>{
        return `rtg__backdrop ` + [`rtg__backdrop--hidden`, `rtg__backdrop--visible`][+!!visible];
    }, [visible])

    return (
        <div ref={layer} style={layerStyle} className={layerClasses}/>
    )
}

Backdrop.propTypes = propTypes;

export default Backdrop;