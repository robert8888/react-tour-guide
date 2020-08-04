import React, {useMemo, useState, useEffect, useCallback} from "react";
import placementToObj from "../utils/placementToObj";
import throttle from "../utils/throttle";
import "./pin.scss";

const Pin = ({onClick, pinText, target, visible, scrollTarget, placement, offset  = 0})=>{
    const [pinStyle, setPinStyle] = useState({})
    /**
     * transform string placement to object
     * @type {{x: string, y: string}}
     * @private
     */
    const _placement = useMemo(()=>{
        return placementToObj(placement);
    }, [placement])

    /**
     * return class names for pin button
     * @type {string}
     */
    const classes = useMemo(()=>{
        return "rtg__pin "
        + ["rtg__pin--hidden", "rtg__pin--visible"][+!!visible]
        + ` rtg__pin--${_placement.y}-${_placement.x}`
    }, [_placement, visible])

    /**
     * return top position coordinates relative to BoundingBox
     * @type {function(string:'top'|'bottom'|'center', HtmlBoundingBox): number}
     */
    const getTopToElement = useCallback((placement, tRect) => {
        let top = scrollTarget.scrollY || scrollTarget.scrollTop || 0;
        top += tRect.top;
        switch (placement){
            case "top": {
                top -= offset;
                break;
            }
            case "bottom":{
                top += tRect.height + offset;
                break;
            }
            case "center":
            default :{
                top += tRect.height / 2;
                break;
            }
        }
        return top;
    },[scrollTarget, offset])

    /**
     * return left position coordinates relative to BoundingBox
     * @type {function(string:'left'|'right'|'center', HtmlBoundingBox): number}
     */
    const getLeftToElement = useCallback((placement, tRect) => {
        let left = scrollTarget.scrollX || scrollTarget.scrollLeft || 0;
        left += tRect.left;
        switch (placement){
            case "left": {
                left -= offset;
                break;
            }
            case "right":{
                left += tRect.width + offset;
                break;
            }
            case "center":
            default :{
                left += tRect.width / 2;
                break;
            }
        }
        return left;
    },[scrollTarget, offset])

    /**
     * return position relative to HtmlBoundingBox
     * @type {function({x:'left' | 'right' | 'center', y: 'top' | 'left' | 'center'}, HtmlBoundingBox)
     * : {top: number, left: number}}
     */
    const getPositionToElement = useCallback((placement, tRect)=>{
        return {
            top: getTopToElement(placement.y, tRect),
            left: getLeftToElement(placement.x, tRect)
        }
    }, [getTopToElement, getLeftToElement])

    /**
     * return top position coordinates relative to window
     * @type {function(string:'top'|'bottom'|'center'): number}
     */
    const getTopToWindow = useCallback((placement)=>{
        let top = 0;
        switch (placement){
            case "top": {
                top += 50 + offset;
                break;
            }
            case "bottom":{
                top += window.innerHeight - 50 - offset;
                break;
            }
            case "center":
            default :{
                top += window.innerHeight / 2;
                break;
            }
        }
        return top;
    }, [offset])

    /**
     * return top position coordinates relative to window
     * @type {function(string:'left'|'right'|'center'): number}
     */
    const getLeftToWindow = useCallback((placement)=>{
        let left = 0;
        switch (placement){
            case "left": {
                left += 50 + offset;
                break;
            }
            case "right":{
                left += window.innerWidth - 50 - offset;
                break;
            }
            case "center":
            default :{
                left += window.innerWidth / 2;
                break;
            }
        }
        return left;
    },[offset])

    /**
     * return position coordinates relative to window
     * @type {function({x:'left' | 'right' | 'center', y: 'top' | 'left' | 'center'}): {top: number, left: number}}
     */
    const getPositionToWindow = useCallback((placement) => {
        return {
            top: getTopToWindow(placement.y),
            left: getLeftToWindow(placement.x)
        }
    }, [getTopToWindow, getLeftToWindow])
    /**
     * update style positioning of pin button
     * @type {function() : void}
     */
    const updateStyle = useCallback(()=>{
        let position;
        if(!target) {
            position = getPositionToWindow(_placement);
        } else {
            let tRect = target.getBoundingClientRect();
            position = getPositionToElement(_placement, tRect);
        }
        setPinStyle({left: position.left + "px", top : position.top + "px"})
    }, [target, _placement, setPinStyle, getPositionToWindow, getPositionToElement])

    /**
     * update position in response on change target
     */
    useEffect(function update(){
        updateStyle();
    }, [target, updateStyle])

    /**
     * update position in response on window resize
     */
    useEffect(()=>{
        const update = throttle(updateStyle, 100);
        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    })

    return (
        <button style={pinStyle} onClick={onClick} className={classes}>
            {pinText !== false &&
                <span>
                    {(pinText && typeof pinText === "string" ? pinText : "Open tutorial")}
                </span>
            }
        </button>
    )
}

export default Pin