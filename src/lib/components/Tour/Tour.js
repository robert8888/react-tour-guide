import React, {useState, useMemo, useCallback, useEffect, useLayoutEffect, useRef, useContext} from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Modal from "../Modal/Modal";
import Backdrop from "../Backdrop/Backdrop";
import Control from "../Control/Control";
import Badge from "../Badge/Badge";
import Pin from "../Pin/Pin";
import {Context as TourContext} from "../Context/Context";
import CloseButton from "../CloseButton/CloseButton";
import scrollToPosition from "./../utils/scrollTo";
import getScrollParent from "../utils/getOverflowedParent";
import firstOf from "../utils/firstOf";
import {offsetTop} from "../utils/offsetTop";
import isMounted from "../utils/isMounted";
import "./tour.scss";
import {useStateRefCallback, useStateRef} from "../utils/useStates";

const propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // tour id used in useTourControl
    children: PropTypes.arrayOf(PropTypes.element),
    className: PropTypes.string, // will add given class name to container and this className__content to content
    isOpen: PropTypes.bool,
    onBeforeClose: PropTypes.func, // before close if return falseable the cancel close
    onBeforeOpen: PropTypes.func, // before open if return falseable then cancel open
    onClose: PropTypes.func, // after close
    onOpen: PropTypes.func, // after open eg. from click in pin
    onAfterClose: PropTypes.func,// called when modal dialog is not visible
    onAfterOpen: PropTypes.func, // called when modal dialog is visible
    onNext: PropTypes.func,// called before change step with : onNext(current, next, length): next: number
    onChange: PropTypes.func, // fired on every step change, - before scroll animation start
    onAfterScroll: PropTypes.func, // fired on every step change, - after scroll animation is finished
    onFinish: PropTypes.func, // called onClose if is on last step
    onLock: PropTypes.func, // called when user try to navigate to lock steps
    startAt: PropTypes.number,
    closeOnBackdrop: PropTypes.bool, // if true then click on the backdrop mask will close tour
    offset: PropTypes.number, // offset of modal from target default 30
    offsetX: PropTypes.number, // by default not set, so it has general default 30
    offsetY: PropTypes.number, // ... similar like in x
    backdropOffset: PropTypes.number, // offset backdrop layer from target element
    backdropOffsetY: PropTypes.number, // vertical offset backdrop layer ....
    backdropOffsetX: PropTypes.number, // horizontal...

    pin: PropTypes.bool, // be default false, if true then after closing it shows pin button
    pinText: PropTypes.oneOfType([
        PropTypes.bool, // if is false then on hover don't show tool tip
        PropTypes.bool, // text on tool tip over pin button
    ]),
    pinOffset: PropTypes.number, // by default 0, offset from base placement of pin

    badge: PropTypes.oneOfType([
        PropTypes.bool, // if false then badge is hidden,
        PropTypes.func, // badge(current, length): string | customizing badge text
    ]),
    badgeClassName: PropTypes.string,

    closeButton: PropTypes.oneOfType([
        PropTypes.bool,// if false then closing button is hidden,
        PropTypes.func // closeButton(close : func) : react.element // function with close handle
    ]),
    closeButtonContent: PropTypes.oneOfType([
        PropTypes.string, // text content of button
        PropTypes.element, // react.element as content of button eg. svg element like fontawesome icon
    ]),
    closeButtonClassName: PropTypes.string, //

    controller: PropTypes.func,// export controlling functions : ({set, pre, next})

    controls: PropTypes.func,// controls({set, prev, next, current, length, close, lock}) : rect.element
    // you can return your own step selector/paginator which have set, prev, next function and
    // current, length values to disposition

    controlButtonsContent: PropTypes.shape({
        // for each button you can set custom content
        prev: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        next: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        selector: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        current: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    }),
    lastStepControls: PropTypes.oneOfType([
        PropTypes.func,// onFinishControls({close, prev, set}) : component
        PropTypes.element // react component
    ]),
    controlNumbers: PropTypes.bool, // if false hide number over 'step selector'

    modalRefreshTimeout: PropTypes.number, // advanced
    // If you change transition time on modal element from .8s to some bigger value
    // probably you have to increase as well refresh timeout.
    // By default value is 801 ms after this time Modal check to 'see' that
    // it have enough space or it have to change place, this is important on mobile device.
    scrollHiddenOverflow: PropTypes.bool, // by default true, if you pass false then if some content is overflowed
    // container and it will be out of visible box then container will not be scrolled
    scrollTarget: PropTypes.instanceOf(HTMLElement),//by default is window but you can set other element like body

}

const Tour = (
    {
        id,
        children,
        className,
        isOpen,


        onBeforeOpen,
        onOpen,
        onAfterOpen,
        onBeforeClose,
        onClose,
        onAfterClose,
        onNext,
        onChange,
        onAfterScroll,
        onFinish,
        onLock,

        startAt,
        closeOnBackdrop,
        offset,
        offsetX,
        offsetY,
        backdropOffset,
        backdropOffsetY,
        backdropOffsetX,

        pin: displayPin,
        pinText,
        pinOffset,

        badge,
        badgeClassName,

        closeButton,
        closeButtonContent,
        closeButtonClassName,

        controller,

        controls,
        controlButtonsContent,
        controlNumbers,
        lastStepControls,

        modalRefreshTimeout,
        scrollHiddenOverflow = true,
        scrollTarget = window,
    }
) => {
    const controlContext = useContext(TourContext);
    const [step, setStep, _step] = useStateRef(null);
    const [startFrom, setStartFrom] = useState(startAt);
    const [visible, setVisible, _visible, setOnVisibleChangeCallback] = useStateRefCallback(false);
    const [pin, setPin] = useState({
        visible: false,
        target: null,
        placement: "center",
        offset: pinOffset,
    })
    const [unlocked, setUnlocked] = useState([]);
    const lock = useRef();

    /**
     * set callback function fired after each value change of visibility state
     */
    useEffect(()=>{
        setOnVisibleChangeCallback(visible =>{
            setTimeout(()=>{
                if(visible){
                    typeof onAfterOpen === "function" && onAfterOpen();
                    controlContext && controlContext.fire(id, "afterOpen")
                } else {
                    typeof onAfterClose === "function" && onAfterClose();
                    controlContext && controlContext.fire(id, "afterClose")
                }
            }, 0)
        })
    }, [setOnVisibleChangeCallback, onAfterOpen, onAfterClose, id, controlContext])

    /**
     * binding scroll to scrolling target
     */
    const scrollTo = useMemo(()=> scrollToPosition.bind(null, scrollTarget), [scrollTarget])

    /**
     * tourLength - amount of steps in tour
     */
    const tourLength = useMemo(()=> {
        return children instanceof Array
            ? children.length
            : 1
    }, [children])

    /** get current step from [children] | children
     * @type {react.component}
     */
    const getStep = useCallback( (index) => {
        return children instanceof Array
            ? children[index]
            : children;
    }, [children])

    /** get step by step
     * function() : @yields {react.component}
     */
    const getSteps = useMemo(()=>{
        return function* (){
            if(children instanceof Array){
                for(let child of children){
                    yield child;
                }
            } else {
                yield children;
            }
        }
    },[children])

    /**
     * get current modal dialog content - (current step content)
     * function() : react.component
     */
    const currentContent = useMemo(() => {
        if (!step) return null;
        return getStep(step.index)
    }, [getStep, step]);

    /**
     * get backdrop horizontal offset - first no null and no undefined of values
     * function() : number
     */
    const bdOffsetX = useMemo(()=>{
        return firstOf([
            step && step.props.backdropOffsetX,
            step && step.props.backdropOffset,
            backdropOffsetX,
            backdropOffset,
            5
        ])
    }, [step, backdropOffset, backdropOffsetX]);

    /**
     * get backdrop vertical offset - first no null and no undefined of values
     * function() : number
     */
    const bdOffsetY = useMemo(()=>{
        return firstOf([
            step && step.props.backdropOffsetY,
            step && step.props.backdropOffset,
            backdropOffsetY,
            backdropOffset,
            5
        ])
    }, [step, backdropOffsetY, backdropOffset])

    /**
     * get modal dialog horizontal offset - first no null and no undefined of values
     * function() : number
     */
    const modalOffsetX = useMemo(()=>{
        return firstOf([
            step && step.props.offsetX,
            step && step.props.offset,
            offsetX,
            offset,
            30,
        ])
    }, [step, offsetX, offset])

    /**
     * get modal dialog vertical offset - first no null and no undefined of values
     * function() : number
     */
    const modalOffsetY = useMemo(()=>{
        return firstOf([
            step && step.props.offsetY,
            step && step.props.offset,
            offsetY,
            offset,
            30
        ])
    }, [step, offsetY, offset])

    /**
     * go through steps and build array of locks - (each step can lock go to next one)
     * @type {[number]}
     */
    const locks = useMemo(()=>{
        const _locks = [];
        let index = 0;
        for(let step of getSteps()){
            if(step.props.approve && step.props.approve.lock){
                _locks.push(index);
            }
            index++;
        }
        return _locks;
    }, [getSteps])

    /**
     * update current locked step - find first locked step that is not in unlocked list
     */
    useEffect(function updateCurrentLock(){
        lock.current = locks.find((lock, index) => lock !== unlocked[index])
    }, [locks, unlocked, lock])

    /**
     * unlock step -> add it index to unlocked list
     */
    const unlock = useCallback(()=>{
        setUnlocked( unlocked => [...unlocked, lock.current]);
        lock.current = locks[locks.indexOf(lock.current) + 1];
    }, [lock, locks, setUnlocked])


    /**
     * set current step - configuration of current step
     */
    const setCurrentStep = useCallback(index => {
        if(onNext && typeof onNext === "function"){
            index = onNext(((step && step.index) || startFrom || 0) , index, tourLength);
        }
        if(controlContext !== null){
            const nextIndex = controlContext.fire(id, "next", ((step && step.index) || startFrom || 0) , index, tourLength)[0]
            if(nextIndex !== undefined){
                index = nextIndex;
            }
        }

        index = Math.min(tourLength - 1, Math.max(0, index))

        if(lock.current !== null && lock.current !== undefined){
            if(index > lock.current) {
                onLock && typeof onLock === "function" && onLock(lock.current);
                if(controlContext !== null){
                    controlContext.fire(id, "lock", lock.current)
                }
                return;
            }
        }

        const _step = getStep(index);
        _step.props.onBeforeShow && _step.props.onBeforeShow();

        const target = document.querySelector(_step.props.selector);

        setStep( current => {
            if(current && current.props.onBeforeNext){
                 if(current.props.onBeforeNext() === false){
                     return current;
                 }
            }
            return {
                index,
                target,
                props: _step.props,
            }
        })

        displayPin && setPin({
            visible: false,
            target: target,
            placement: firstOf([
                _step.props.pinPlacement,
                _step.props.placement,
                "center"]
            ),
            offset : firstOf([
                _step.props.pinOffset,
                pinOffset,
                0
            ]),
            pinText: firstOf([_step.props.pinText, pinText])
        });
    }, [setStep, getStep, step, startFrom, tourLength, lock, onNext, onLock,
        displayPin, setPin, pinOffset, pinText, id , controlContext, currentContent])

    const next = useCallback(() => {
        setCurrentStep((step && (step.index + 1)) || 0);
    }, [step, setCurrentStep])

    const prev = useCallback(() => {
        setCurrentStep((step && (step.index - 1)) || 0);
    }, [step, setCurrentStep]);

    const set = useCallback((index)=>{
        setCurrentStep(index);
    }, [setCurrentStep]);

    const close = useCallback((skip) => {
        if(!_visible.current) return;
        if(onBeforeClose && onBeforeClose() === false){
            return;
        }
        if(controlContext && controlContext.fire(id, "beforeClose").some(response => response === false)){
            return;
        }
        onClose && onClose();
        controlContext && controlContext.fire(id, "close");

        setVisible(false);
        //if is pass skipp=true to close or is last step then pin will not be displayed
        displayPin && setPin( pin => ({...pin, visible: (step.index === tourLength - 1) ? false : !skip }));
        setStep( step => {
            setStartFrom(startFrom => step ? step.index : (startFrom || 0));
            if(step && (step.index === tourLength - 1)){
              onFinish && onFinish();
              controlContext && controlContext.fire(id, "finish");
            }
            return null;
        })
    }, [step, setStep, setStartFrom, _visible, setVisible, setPin,
             onFinish, onBeforeClose, onClose,  displayPin, tourLength,
             id, controlContext])

    const open = useCallback(()=> {
        if(_visible.current) return;
        if(onBeforeOpen && onBeforeOpen() === false){
            return;
        }
        if(controlContext && controlContext.fire(id, "beforeOpen").some(response => response === false)){
            return;
        }
        if(!step){
            const start = startFrom || 0;
            set(start);
        }
        onOpen && onOpen();
        controlContext && controlContext.fire(id, "open");

        setVisible(true);
        displayPin && setPin( current => ({...current, visible: false}))
    }, [onOpen, onBeforeOpen, startFrom, set, setVisible, _visible, displayPin, setPin, step, id, controlContext])


    /**
     * exporting control function to current context
     */
    const exportControlToContext = useCallback(()=>{
        controlContext.registerControl(id, {
            open,
            close,
            prev,
            next,
            set,
            get step() { return _step.current},
            get isOpen() { return _visible.current},
            get length() {return tourLength}
        })
    }, [_visible, _step, open, close, prev, next, set, id, controlContext, tourLength])

    useEffect(function exportControl(){
        if(!controlContext) return;
        exportControlToContext();
    },[controlContext, exportControlToContext])


    /**
     * export controlling functions
     */
    useEffect(()=>{
        if(!controller) return;
        controller({
            prev,
            next,
            set,
        })
    }, [prev, next, set, controller])

    /**
     * if current step is change then fire up scroll
     */
    useLayoutEffect(function scroll() {
        if(!step || (step && step.props.scroll === false)) return;
        if(!step.target){
            scrollTo({top: 0, left: 0}, () => {
                onAfterScroll && onAfterScroll(step.index)
                controlContext && controlContext.fire(id, "afterScroll", step.index)
            });
            return;
        }
        let top, left;
        const targetRect = step.target.getBoundingClientRect();

        let scrollParent = getScrollParent(step.target, scrollHiddenOverflow, ":not(html):not(body)");

        if(scrollParent){
            const parentRect = scrollParent.getBoundingClientRect();
            const diffY = targetRect.bottom - parentRect.bottom + bdOffsetY;
            const diffX = targetRect.left - parentRect.left + bdOffsetX;
            scrollParent.scrollBy(diffX, diffY);

            if(targetRect.width  > parentRect.width
                || targetRect.height  > parentRect.height){
                setStep({
                    ...step,
                    target : scrollParent,
                })
                return;
            }
        }

        switch(step.props.placement){
            case "left":
            case "right": {
                top = offsetTop(step.target, scrollTarget) - window.innerHeight / 2 + targetRect.height / 2;
                left = step.target.offsetLeft - window.innerWidth / 2;
                break;
            }
            case "bottom": {
                top = offsetTop(step.target, scrollTarget) - window.innerHeight / 2 + targetRect.height;
                left = step.target.offsetLeft - window.innerWidth / 2;
                break;
            }
            case "top":
            default : {
                top = offsetTop(step.target, scrollTarget) - window.innerHeight / 2 ;
                left = step.target.offsetLeft - window.innerWidth / 2;
            }
        }
        top += step.props.scrollOffsetY || step.props.scrollOffset || 0;
        left += step.props.scrollOffsetX || 0;

        scrollTo({top, left}, () => {
            onAfterScroll && onAfterScroll(step.index)
            controlContext && controlContext.fire(id, "afterScroll", step.index)
        })
    }, [scrollTo, step, setStep, bdOffsetX, bdOffsetY, scrollHiddenOverflow, onAfterScroll, scrollTarget, id , controlContext]);

    useEffect(function onStepChange(){
        if(onChange && step){
            onChange({
                index : step,
                props: step.props,
            })
        }
        step && controlContext && controlContext.fire(id, "change", {
            index : step,
            props: step.props,
        })
    }, [step, onChange, id, controlContext])

    /**
     * change visibility state in response to changing external state isOpen
     */
    useEffect(function onOpenStateChange(){
        if(isOpen === undefined || isOpen === null) return;
        if(isOpen ){
            open()
        } else{
            close()
        }
    }, [isOpen ,open, close])

    /**
     * each step can have approve object with event, target, lock and callback function
     * @param event: Event - is a event that approve step or fire callback function if is set. callback function have to return bool
     * @param target: CSSStyleDeclaration - target of event approving step - by default is click
     * @param callback: function - if is set then step will be approved if callback return trueable
     * @param lock: bool - if is true then until task is not done user can't go to next steps
     */
    useEffect(function applyApprove(){
         if(!step || !isOpen) return;
         const approve = step.props.approve;
         if(!approve) return;
         const approveEvent = approve.event || 'click';
         const approveTarget = (approve.target && document.querySelector(approve.target)) || step.target;
         if(!approveTarget) return;
         const approveCallback = (event) => {
             if(approve.callback){
                 if(!!approve.callback(event)){
                     unlock();
                     next();
                 }
             } else {
                 unlock();
                 next();
             }
         }
         approveTarget.addEventListener(approveEvent, approveCallback);
         if(approve.promise){
             approve.promise.then(() => {
                 unlock();
                 next();
             })
         }
         return () => {
             approveTarget.removeEventListener(approveEvent, approveCallback);
         }
    },[step, next, isOpen, unlock])

    /**
     * if backdrop layer is clicked then current step is closed
     */
    useEffect(function backdropClose(){
        if(!step || (step && (!step.props.closeOnBackdrop && !closeOnBackdrop))) return;
        const click = ({target}) => {
            if(!target.closest(step.props.selector+  " , .rtg__container") && isMounted(target)){
                close();
                window.removeEventListener("click", click);
            }
        }
        window.addEventListener("click", click);
        return () => {
            window.removeEventListener("click", click);
        }
    }, [step, close, closeOnBackdrop])

    /**
     * External closing button, or build in CloseButton component with default or custom button content
     * function() : react.component
     */
    const closingButton = useMemo(()=>{
        if(closeButton === false) return null;
        if(closeButton){
            return closeButton(close);
        }
        return (
            <CloseButton
                className={closeButtonClassName}
                content={closeButtonContent}
                onClick={close.bind(null, false)}/>
        )
    }, [closeButton, close, closeButtonClassName, closeButtonContent])

    /**
     * control react.component rendered on last step (if provided)
     */
    const finishControls = useMemo(()=>{
        if(!lastStepControls) return null;
        if(typeof lastStepControls === "function"){
            return lastStepControls({prev, set, close})
        }
        return lastStepControls
    },[lastStepControls, prev, set , close])

    /**
     * main container class name depends on
     *  - current step - if hidded then on last visible step
     *  - external provided className
     * @type {string}
     */
    const containerClassName = useMemo(()=>{
        return "rtg__container "
        + "rtg__container--step-" + ((step ? step.index + 1 : startFrom + 1 ) || 0 ) + " "
        + ( className || "") + " "
        + ((step && step.props.className ) || " ")
    }, [step, className, startFrom])

    /**
     * content container class name depend on current step prop className
     * and prop className passed to Tour component
     * @type {string}
     */
    const contentClassName = useMemo(()=>{
        return "rtg__modal__content "
        + (className ? className + "__content " : "") || ""
        + (step && step.props.className && step.props.className + "__content" ) || "";
    }, [step, className])

    return ReactDOM.createPortal((
        <div className={containerClassName}>
            <Backdrop
                visible={visible}
                target={step && step.target}
                offsetX={bdOffsetX}
                offsetY={bdOffsetY}
                scrollTarget={scrollTarget}/>
            <Modal
                visible={visible}
                target={step && step.target}
                placement={(step && step.props.placement) || "top"}
                offsetX = {modalOffsetX}
                offsetY = {modalOffsetY}
                scrollTarget={scrollTarget}
                refreshTimeout={modalRefreshTimeout}>
                <div className={contentClassName}>
                    {(badge !== false) &&
                        <Badge current={step && step.index}
                               length={tourLength}
                               transform={badge}
                               className={badgeClassName}/>}
                    {closingButton}
                    {currentContent}
                    { controls && controls({
                                    set, prev, next, close,
                                    current: step && step.index,
                                    length: tourLength,
                                    lock: lock.current})
                    }
                    { !controls &&
                        <Control next={next} prev={prev} set={set}
                                 length={tourLength}
                                 current={step && step.index}
                                 withNumber={controlNumbers}
                                 lock={lock.current}
                                 controlButtons={controlButtonsContent}
                                 finishControls={finishControls}/>
                    }
                </div>
            </Modal>
            {displayPin && pin.visible &&
            <Pin
                pinText={pin.pinText}
                target={pin.target}
                scrollTarget={scrollTarget}
                placement={pin.placement}
                onClick={ () => {open(); onOpen && onOpen()}}
                offset={pin.offset}/>
            }
        </div>
    ), document.body);
}

Tour.propTypes = propTypes;

export default Tour;