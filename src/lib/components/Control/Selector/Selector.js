import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";

const propTypes = {
    current: PropTypes.number, // index of current step
    length : PropTypes.number, // steps amount
    lock: PropTypes.number, // from witch step steps are locked
    content: PropTypes.oneOfType(
        [PropTypes.string, PropTypes.element]// content of selector button
    ),
    contentCurrent: PropTypes.oneOfType(
        [PropTypes.string, PropTypes.element]// content of selector button representing current step
    ),
    withNumber: PropTypes.bool, // with step number over selector buttons or not
}

const Selector = ({length, current, lock, set,  content, withNumber, contentCurrent}) => {
    return (
        <>
            {Array(length).fill(1).map(( _, index)=> (
                <Button key={"select-button-" + index}
                        isCurrentStep={index === current}
                        onClick={set.bind(null, index)}
                        disabled={(lock !== undefined) && (index > lock)}
                        className={((withNumber === false) && "rtg__button--hide-before") || ""}
                        content={(index === current) ? contentCurrent : content}/>
            ))}
        </>
    )
}

Selector.propType = propTypes;

export default Selector;