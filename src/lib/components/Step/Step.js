import React, {useMemo} from "react";
import PropTypes from "prop-types";

const propTypes = {
    selector: PropTypes.string, // css selector if is not provided then it will be located in relation to window
    placement: PropTypes.oneOf([
        "center", // only in relation to window - in relation to selector it will cover object !!!
        "top", "bottom", "right", "left",
        "top-right", "top-left",
        "bottom-right", "bottom-left"
    ]),
    onBeforeShow: PropTypes.func, // called before show, you can prepare some action here
    onBeforeNext: PropTypes.func, // if return false block go to next step
    approve: PropTypes.oneOfType([
        PropTypes.bool, // if you pass just 'approve=true' by default it will take click event
        PropTypes.shape({
            event: PropTypes.string,
            target: PropTypes.string,
            callback:  PropTypes.func, // if callback return true then is approved
            promise: PropTypes.instanceOf(Promise), // if promise is resolved then is approved
            lock: PropTypes.bool, // lock go next step until task is not done
        })
    ]),
    closeOnBackdrop: PropTypes.bool, // close on backdrop click - eg. you can set it on last step
    backdropOffset: PropTypes.number, // if is not set will take default value 5
    backdropOffsetX: PropTypes.number, // similar lik in general case
    backdropOffsetY: PropTypes.number, // ..like in x
    scroll: PropTypes.bool, //if false then on this step page is not scrolled
    scrollOffset: PropTypes.number, // by default scroll to display element on center of screen
    scrollOffsetX: PropTypes.number, // from horizontal screen center
    scrollOffsetY: PropTypes.number, // from vertical screen center
    offset: PropTypes.number, // if is not set will take general default value 30
    offsetX: PropTypes.number, // by default not set so it hase general default 30
    offsetY: PropTypes.number, // ... similar like in x
    pinPlacement: PropTypes.oneOf([
        "center", // if is pin option on, and this is not set then it will take modal placement
        "top", "bottom", "right", "left",
        "top-right", "top-left",
        "bottom-right", "bottom-left"
    ]),
    pinOffset: PropTypes.number, // offset from pin placement by default 0;
    pinText: PropTypes.oneOfType([
        PropTypes.bool, // if false then tool tip text is hidden, if true or unset then default text will be shown
        PropTypes.string, // text over hover pin if you pass empty string then tool tip will disappear
    ]),
    className: PropTypes.string, // class name for step wrapper
}

const Step = ({children, className}) => {
    const classes = useMemo(() =>{
        return "rtg__step " + (className ? className : "");
    }, [className])

    return (
        <div className={classes}>
            {children}
        </div>
    )
}

Step.propTypes = propTypes;

export default Step;