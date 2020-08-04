import {useState, useRef, useEffect, useCallback} from "react";

export function useStateRef(initValue){
    const [state, setState] = useState(initValue);
    const currentValue = useRef(initValue);
    const _setState = useCallback(data => {
        if(typeof data === "function"){
            setState( current => {
                let s = data(current)
                currentValue.current = s;
                setState(s);
            })
        } else{
            currentValue.current = data;
            setState(data)
        }
    }, [setState, currentValue])
    return [state, _setState, currentValue];
}

export function useStateCallback(initValue){
    const [state, setState] = useState();
    const callback = useRef();
    const lastValue = useRef(initValue);

    const setCallback = useCallback( clb =>{
        callback.current = clb;
    }, [callback])

    useEffect(()=>{
        if(lastValue.current === state) {
            return ;
        }
        if(lastValue.current ===  undefined){
            lastValue.current = state;
            return;
        }

        lastValue.current = state;

        if(typeof callback.current !== "function") return;

        callback.current(state);
    }, [state]);

    return [state, setState, setCallback]
}

export function useStateRefCallback(initValue){
    const [state, setState, _currentValue] = useStateRef(initValue);
    const callback = useRef();
    const lastValue =  useRef(initValue);

    useEffect(()=>{
        if(lastValue.current === state) {
            return ;
        }
        if(lastValue.current ===  undefined){
            lastValue.current = state;
            return;
        }

        lastValue.current = state;

        if(typeof callback.current !== "function") return;

        callback.current(state);
    }, [state, lastValue, callback])

    const setCallback = useCallback(clb =>{
        callback.current = clb
    }, [callback])


    return [state, setState, _currentValue, setCallback]
}