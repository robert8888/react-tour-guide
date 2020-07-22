import React, {useState, useMemo}from "react";
import Modal from "../Modal/Modal";

const Tour = (children, className) => {
    const [current, setCurrent] = useState(0);

    const currentStep = useMemo(()=>{
        console.log(children);
        return null;
    }, [])

    return (
        <div className={"tour__container " + className}>
            <Modal>
                {currentStep}
            </Modal>
        </div>
    )
}

export default Tour;