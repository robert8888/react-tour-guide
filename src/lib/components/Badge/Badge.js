import React, {useMemo} from "react";
import PropTypes from "prop-types";
import "./badge.scss";

const propTypes = {
    current: PropTypes.number, // current step index
    length: PropTypes.number, // length of tour, step amount
    transform: PropTypes.func, // function which can transform displayed value, translate it or whatever
    className: PropTypes.string, // class names added to badge component
}

const Badge = ({current ,length, transform, className}) =>{

    const text = useMemo(()=>{
        if(current === undefined || length === undefined) {
            return null;
        }
        if(typeof transform === "function"){
            return transform(current, length);
        }
        return `${current + 1} of ${length}`;
    }, [transform, length, current])


    return(
        <div className={"rtg__badge " + (className || "")}>
            <span> {text} </span>
        </div>
    )
}

Badge.protoType = propTypes;

export default Badge;