import React from "react";
import PropTypes from "prop-types";

const SquareSvg = () => {
    return (
        <svg aria-hidden="true" focusable="false"
         className="svg-inline--fa fas-square fa-w-14"
         role="img" xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 448 512">
            <path fill="currentColor"
                  d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-6
                   400H54c-3.3 0-6-2.7-6-6V86c0-3.3 2.7-6 6-6h340c3.3 0 6 2.7 6 6v340c0 3.3-2.7 6-6 6z"/>
        </svg>
    )
}

const SquareSolidSvg = ()=>{
    return (
        <svg aria-hidden="true" focusable="false"
             className="svg-inline--fa fa-square fa-w-14"
             role="img" xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 448 512">
            <path fill="currentColor"
                  d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"/>
        </svg>
    )
}

const propTypes = {
    isCurrentStep: PropTypes.bool, // is button indicates current step
    onClick: PropTypes.func, // handle for click event
    disable: PropTypes.bool, // is button disabled state
    content: PropTypes.oneOfType([ // content of button
        PropTypes.string,
        PropTypes.element,
    ]),
    className: PropTypes.string, // class name string
}

const Button = ({isCurrentStep, onClick, disabled, content, className}) => {
    return (
        <button onClick={onClick} disabled={disabled}
                className={"rtg__button rtg__button--selector " + ["", "rtg__button--current "][+!!isCurrentStep] + className}>
            {content ? content : (isCurrentStep ? <SquareSolidSvg/> : <SquareSvg/>)}
        </button>
    )
}

Button.propTypes = propTypes;

export default Button;