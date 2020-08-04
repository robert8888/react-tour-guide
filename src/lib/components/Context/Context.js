import React, {useMemo, useRef} from "react"

export const Context = React.createContext(null);

const TourRoot = ({children}) => {
    const _controls = useRef({});
    const _hooks = useRef({});

    const value = useMemo(() => ({
        registerControl : (id, controls) => {
            _controls.current[id] = controls
        },
        fire: (id, event, ...args) => {
            const callbacks = (_hooks.current && _hooks.current[id] && _hooks.current[id].get(event)) || [];
            const response = []
            for(let callback of callbacks){
                response.push(callback(...args));
            }
            return response;
        },
        tour: function tour(...args){
            const id = args[args.length - 1];
            return new Proxy({
                on : (event, callback) => {
                    if(!_hooks.current[id]) _hooks.current[id] = new Map();
                    if(_hooks.current[id].has(event)){
                        _hooks.current[id].set(event, [..._hooks.current[id].get(event), callback])
                    } else{
                        _hooks.current[id].set(event, [callback])
                    }
                },
                un: (event, callback) => {
                    if(!_hooks.current[id] || !_hooks.current[id].has(event)) return;
                    _hooks.current[id].set(event, [..._hooks.current[id].get(event).filter( clb => clb !== callback)])
                },
            }, {
                get(target, prop, receiver) {
                    if(prop === 'get'){
                        return tour;
                    }
                    if(Reflect.has(_controls.current[id] || {}, prop)){
                        return Reflect.get(_controls.current[id], prop, receiver)
                    } else if(Reflect.has(target, prop)){
                        return Reflect.get(target, prop, receiver); // (1)
                    } else {
                        return () => {
                            throw new ReferenceError(`Given prop: '${prop}' or tourId : '${id}' doesn't exist`)
                        }
                    }

                },

            })
        }
    }), [_controls, _hooks])

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    )
}

export default TourRoot;