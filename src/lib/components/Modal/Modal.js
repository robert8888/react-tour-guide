import React, {useMemo, useRef, useState, useEffect, useCallback} from "react";
import PropTypes from "prop-types"
import "./modal.scss"
import toRange from "../utils/toRange";
import placementToObj from "../utils/placementToObj";
import throttle from "../utils/throttle";

const propTypes = {
    children: PropTypes.element,
    target : PropTypes.instanceOf(HTMLElement), // target element to position modal dialog
    placement: PropTypes.string, // placement in relative to target element
    offsetY: PropTypes.number, // offset from initial destination placement
    offsetX: PropTypes.number,
    visible: PropTypes.bool, // is visible state
    refreshTimeout: PropTypes.number, // time after transition end to refresh position - in some case browser can change size
    // dialog and then recalculation can update position - usually on mobile device when is not enough space
    scrollTarget: PropTypes.oneOfType([
        PropTypes.instanceOf(Window),
        PropTypes.instanceOf(HTMLElement)
    ])
}

const Modal = ({children, target, placement, offsetX, offsetY, visible, refreshTimeout = 801, scrollTarget= window}) => {
    const container = useRef();
    const [modalStyles , setModalStyles] = useState({});
    const [finalPlacement, setFinalPlacement] = useState();

    /**
     * return top position coordinates relative to target Bbox
     * @type {function(HtmlBoundingBox,  HtmlBoundingBox, string:'top'|'bottom'|'center'): number}
     */
    const getTopToElement = useCallback((tRect, cRect, placement) => {
        let top = scrollTarget.scrollY || scrollTarget.scrollTop || 0;
        switch (placement){
            case "top":{
                top += tRect.top  - (cRect.height / 2) - offsetY
                break ;
            }
            case "center":{
                top += tRect.top + tRect.height / 2;
                break;
            }
            case "bottom":
            default : {
                top += tRect.bottom + (cRect.height / 2) + offsetY;
            }
        }
        return top;
    }, [offsetY, scrollTarget])
    /**
     * return left position coordinates relative to BBox
     * @type {function(HtmlBoundingBox, HtmlBoundingBox, string:'left'|'right'|'center'): number}
     */
    const getLeftToElement = useCallback((tRect, cRect, placement) => {
        let left = scrollTarget.scrollX || scrollTarget.scrollLeft || 0;
        switch(placement){
            case "left": {
                left += tRect.left - (cRect.width / 2) - offsetX;
                break;
            }
            case "right":{
                left += tRect.right + (cRect.width / 2)   + offsetX;
                break;
            }
            case "center":
            default: {
                left += tRect.left + (tRect.width / 2)
            }
        }
        return left;
    }, [offsetX, scrollTarget])

    /**
     * return position relative to target BBox
     * @type {function(HtmlBoundingBox, HtmlBoundingBox, {x:'left' | 'right' | 'center', y: 'top' | 'left' | 'center'})
     * : {top: number, left: number}}
     */
    const getPositionToElement = useCallback((tRect, cRect, placement) => {
        return {
            top : getTopToElement(tRect, cRect, placement.y),
            left : getLeftToElement(tRect, cRect, placement.x),
        }
    }, [getLeftToElement, getTopToElement])

    /**
     * return top position coordinates relative to window
     * @type {function(HtmlBoundingBox, string:'top'|'bottom'|'center'): number}
     */
    const getTopToWindow = useCallback((cRect, placement) => {
        switch(placement){
            case "top":{
                console.log("offste",placement,  cRect , offsetY)
                return cRect.height / 2 + offsetY;
            }
            case "bottom": {
                return window.innerHeight - cRect.height / 2 - offsetY;
            }
            case "center":
            default: {
               return window.innerHeight / 2;
            }
        }
    },[offsetY])

    /**
     * return left position coordinates relative to window
     * @type {function(HtmlBoundingBox, string:'left'|'right'|'center'): number}
     */
    const getLeftToWindow = useCallback((cRect, placement)=>{
        switch (placement){
            case "left":{
                return cRect.width / 2 + offsetX;
            }
            case "right":{
                return window.innerWidth - cRect.width / 2 - offsetX;
            }
            case "center":
            default:{
                return window.innerWidth / 2;
            }
        }
    }, [offsetX])

    /**
     * return position coordinates relative to window
     * @type {function(HtmlBoundingBox, {x:'left' | 'right' | 'center', y: 'top' | 'left' | 'center'}): {top: number, left: number}}
     */
    const getPositionToWindow = useCallback((cRect, placement) =>{
        return {
            top: getTopToWindow(cRect, placement.y),
            left: getLeftToWindow(cRect, placement.x)
        }
    }, [getTopToWindow, getLeftToWindow])

    /**
     * update modal dialog position based on target bbox coordinates
     * @type {function(): void}
     */
    const updatePosition = useCallback(()=>{
        if(!container.current) return ;

        const _placement = placementToObj(placement);
        const cRect = container.current.getBoundingClientRect();
        // if there is no target - window is target
        if(!target)  {
            let position = getPositionToWindow(cRect, _placement);
            setModalStyles({top: position.top + "px", left: position.left + "px"});
            setFinalPlacement(`window-${_placement.y}-${_placement.x}`);
            return ;
        }
        // in relation to target bbox
        const tRect = target.getBoundingClientRect();
        const get = getPositionToElement.bind(null, tRect, cRect);

        let calls = 0;
        function tryGetPosition(placement) {
            let position = get(placement);
            calls++;
            if(calls > 7){ // limit to stop calling if there is no optimal position - it is not happening but just in case
                setFinalPlacement(`${placement.y}-${placement.x}`);
                return position;
            }

            // out of bottom of screen
            if((position.top > document.body.scrollHeight)) {
                return tryGetPosition({...placement, y : "top"})
            }
            // out of top screen
            if((position.top < cRect.height / 2)){
                return tryGetPosition({...placement, y: "bottom"})
            }
            //if is not enough space on left side
            if(placement.x === "left" &&
               (position.left - cRect.width / 2  < 10
             || position.left - cRect.width / 2  < scrollTarget.scrollLeft)){
                return tryGetPosition({x: "center", y: "top"});
            }
            // if is not enough space on right side
            if(placement.x === "right" &&
              (position.left + (cRect.width / 2) > document.body.scrollWidth - 10
            || position.left + cRect.width /2 > scrollTarget.scrollLeft + window.innerWidth)) {
                return tryGetPosition({x: "center", y: "top"})
            }

            //
            if((placement.x === "center" && placement.y === "bottom")
            && position.top + cRect.height / 2  + offsetY > window.scrollY + window.innerHeight){
                return tryGetPosition({x: "center", y: "top"})
            }

            position.left = toRange(position.left,
                cRect.width / 2 + 5,
                document.body.scrollWidth - (cRect.width / 2) - 5)

            setFinalPlacement(`${placement.y}-${placement.x}`);
            return position;
        }

        let position = tryGetPosition(_placement);

        setModalStyles({top: position.top + "px", left: position.left + "px"})
    }, [target, placement, setModalStyles, getPositionToElement,
        getPositionToWindow, setFinalPlacement, offsetY, scrollTarget])

    /**
     * invoke update modal dialog position in response on change target and visibility
     * after refresh threshold time position is once again updated to eventually
     * change it if is not enough space after updating modal dialog size in the initial target destination
     */
    useEffect(()=>{
       if(!visible) return ;
       setTimeout(() => window.requestAnimationFrame(()=> {
           updatePosition()
       }),0);
       setTimeout(() => updatePosition(), refreshTimeout)
    }, [target, updatePosition, visible, refreshTimeout])

    /**
     * update modal dialog position in response on change window size - thresholded
     */
    useEffect(()=>{
        const update = throttle(updatePosition, 100);
        window.addEventListener("resize", update);
        return () =>{
           window.removeEventListener("resize", update);
        }
    }, [updatePosition])

    /**
     * modal div container class names depended on visible and placement
     * @type {string}
     */
    const modalClasses = useMemo(()=>{
        return `rtg__modal `
             +['rtg__modal--hidden ', 'rtg__modal--visible '][+!!visible]
             + (finalPlacement ? `rtg__modal--` + finalPlacement : "");
    }, [visible, finalPlacement])

    return (
        <div ref={container} className={modalClasses} style={modalStyles}>
            {children}
        </div>
    )
}

Modal.propTypes = propTypes;

export default Modal;