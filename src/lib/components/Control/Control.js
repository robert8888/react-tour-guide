import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import Selector from "./Selector/Selector";

const propTypes = {
    current : PropTypes.number, // index of current step
    length : PropTypes.number, // steps amount
    lock: PropTypes.number, // next lock step - from this step to end steps are locked
    set: PropTypes.func, // handle for set step index
    prev: PropTypes.func, // previous step
    next: PropTypes.func, // next step
    withNumber: PropTypes.bool, // with number over select buttons
    controlButtons: PropTypes.shape({ // content of control buttons
        prev : PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        next : PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        selector: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        selectorCurrent :PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    }),
    finishControls: PropTypes.element, // react component which will be rendered as last step control element
}

const Control = ({current, length, set, next, prev, lock, withNumber, controlButtons, finishControls}) => {

    return (
        <div className={"rtg__control"}>
            {(!finishControls || current !== length - 1) &&
                <>
                    <Button type={"prev"}
                         onClick={prev}
                         disabled={current === 0}
                         content={controlButtons && controlButtons.prev}/>
                    <Selector set={set} length={length}
                        current={current}
                        lock={lock}
                        withNumber={withNumber}
                        content={controlButtons && controlButtons.selector}
                        contentCurrent={controlButtons && controlButtons.current}/>
                    <Button type={"next"}
                        onClick={next}
                        disabled={current === length - 1 || current === lock}
                        content={controlButtons && controlButtons.next}/>
                </>
            }
            {(finishControls && current === length - 1) && finishControls}
        </div>
    )
}

Control.propTypes = propTypes;

export default Control;