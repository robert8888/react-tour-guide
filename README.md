# About
The idea for this library was to create a trip component library that is created in react way rather than json config, while still keeping the style in a separate css file built in such way that they can be easily overwritten and customized.

### [Demo page](http://www.google.pl)

# TLTR
```
npm install react-rtg
```
#### Basic usage
```javascript
import "./../../node_modules/react_rtg/build/index.css"
import React, {useState} from "react";
import {Tour, Step} from "react-rtg";

const TourGuide = ({isOpen, setOpen}) => {
    return (
        <Tour isOpen={isOpen} onClose={setOpen.bind(null, false)} onOpen={setOpen.bind(null, true)}>
            <Step placement="top-center">
                <p>First step of tutorial placed on cenetr top of window</p>
            </Step>
            <Step selector="#buttonId" placement="bottom">
                <p>Second on is under selected target element</p>
            </Step>
        </Tour>
    )
};

const App = () => {
    const [isTourOpen, setIsTourOpen] = useState(false)
    return (
        <TourGuide isOpen={isTourOpen} setOpen={setIsTourOpen}/>
        <button id="buttonId" onClick={setIsTourOpen.bind(null, ture)}> Start Tour </button>
    )
}

```

#### with context

```javascript
import "./../../node_modules/react_rtg/build/index.css"
import React, {useState} from "react";
import {Tour, Step, TourRoot, useTour} from "react-rtg";

const TourGuide = ({isOpen, setOpen}) => {
    return (
        <Tour id="tourId">
            <Step placement="top-center">
                <p>First step of tutorial placed on cenetr top of window</p>
            </Step>
            <Step selector="#buttonId" placement="bottom">
                <p>Second on is under selected target element</p>
            </Step>
        </Tour>
    )
};

const Menu = () => {
    const [tour] = useTour("tourId")
    return (
        <ul>
            <li onClick={tour.next}> Go to next</li>
            <li onClick={tour.open}> Sart tour</li>
            <li onClick={tour.close}> Finish tour</li>
        </ul>
    )
}

const App = () => {
    const [tour] = useTour("tourId"); // if you don't pass id you still can use tour.get method 
    
    useEffect(()=>{
        const onNext = (current, next, lenght) => {
            console.log(`current step is ${current} next will be ${next}, is ${lenght} steps`)
        }
        tour.on("next", onNext);
        return () => tour.un("next", onNext);
    }, [tour])
    
    return (
        <TourRoot>
            <TourGuide/>
            <Menu/>
        </TourRoot>
    )
}
```

------
# Spec
## Tour component
```javascript
Tour.propTypes = {
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
    closeButtonClassName: PropTypes.string, 
    
    controls: PropTypes.func,// controls({set, prev, next, current, length, close, lock}) : rect.element
    // you can return your own step selector/paginator
    // which have set, prev, next function and current, length values to disposition
    
    controlButtonsContent: PropTypes.shape({
        // for each button you can set custom content
        prev: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        next: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        selector: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        selectorCurrent: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
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
```

## Step component
```
Step.propTypes = {
    className: PropTypes.string, // class name for step wrapper
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
            callback: PropTypes.func, // if return true then go to next step
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
}
```
## useTour(id | null)
```javascript
const [tour] = useTour(tourId);

//or
const [tour] = useTour();
const _tour = tour.get(tourId);

//or
const [tour] = useTour(someId);
const _tour2 = tour.get(otherId);
tour.open();
tour.isOpen// true
_tour2.isOpen // false
_tour2.open()
_tour2.isOpen()//ture

///------------------
tour.open();
tour.close(force: bool);//if the force is true, even if the pin mode is on a pin, it will not be displayed
tour.next();
tour.prev();
tour.set(index: number); // jump to step number index

tour.step.index // current index read onlny
tour.step.props // curretn step compoment props - read onlny
tour.step.target // current step target (html node)
tour.isOpen // boolean read onlny
tour.length // steps amount

function onClose(){
    console.log("RTG dialog closed")
    tour.un("close", onClose);
}

tour.on("close", onClose);
tour.on("beforeClose", () => console.log("before close dialog"));
tour.on("afterScroll", () => console.log("aftetr scrolling window to target position"));
```


#### hooks order:
- Open tour dialog first time
    - **onBeforeOpen** // *befre open process start - if it's return false then opening will be aborded*
    - **onNext** // *before next is evalued - onNext(current, next, length): index|null*
    - **onBeforeShow** (on Step component) - *called before given step is displayed - this can be onlny added to Step component*
    - **onOpen** // called in during opening process
    - **onChange** // after current displayed step is changed
    - **onAfterOpen** // called when step is visible all process of rendering are finished
- Next step 
    - **onNext** // *you can return index of next step*
    - **onLock**// *called while trying to chnage step index on locked one*
    - **onBeforeNext** (on Step component) - called before change given step on next one
    - **onChange** // called after step is changed with onChange(index, Step.props)
    - **onAfterScroll** // called when scrolling to target element is over
- Close tour dialog 
    - **onBeforeClose** // *on closing process start - if you return false then closing will be aborded*
    - **onClose** // *on closing but still before*
    - **onFinish** // *on close on last step*
    - **onAfterClose** // *dialog is closed*

## Styling
```scss
@import "../../node_modules/react-rtg/build/index.css"

.rtg__conatiner{
  --primary-color: #0b708b;
  --pin-color: #0fa9d0;
  --arrowSize: 15px;
} 
// you can change style of each step
.rtg__container--step-3 .rtg__modal{
  --arrowSize: 30px;
}
.my-class.rtg.__container{}

.rtg__modal{
    background: black;
    color: white;
    p {
      color:white;
    }
    max-width: 350px;
}
.rtg__modal--top-center:after {
    content: none // remove arrov indecates target under modal dialog
}

.rtg__button--close{}
.rtg__button--open{}
.rtg__button--next{}
.rtg__button--prev{}
.rtg__button--selector{}
.rtg__button--current{}

.rtg__badge{} // plate with current step info counter
.rtg__control {} // control button container
.rtg__pin {} // pin button after temporary closing modal
.rtg__backdrop{
    border-radius: 0px; // change backdrop hool border radius
}
```
### Customization button icons
```javascript
import React from "react"
import {Tour, Step} from "react-rtg"

const TourGuide = () => {
    return (
        <Tour id={"tourId"}
              closeButtonContent={<span>{"close"}</span>} 
              controlButtonsContent = {{
                  prev: "prev",
                  next: <span>{"next"}</span>
                  selector: "*"
                  current: "@"
              }}
              badge={(current, length) => current + " from " + length}
              lastStepControls={close => <button onClick={close.bind(null, true)}>Congratulations</button>}
              pin
              pinText="Clik heart to open tutorail agina"> 
            <Step placement={"center"}}>
                <p>
                    This tip is on center of screen <br/>
                </p>
            </Step>
        </Tour>
    )
}

export default TourGuide
```

### Full custom - control buttons component 
```javascript
import React, {useCallback} from "react";
import {Tour, Step} from "react-rtg";

const TourGuide = () => {
    const controls = useCallback(({prev, next, close, current, length})=>{
        return (
            <div className={"some-class__controls"}>
                <button onClick={close.bind(null, true)} className={"btn btn--skip"}> skip </button>
                {current !== 0 &&
                    <button onClick={prev} className={"btn btn--prev"}>
                        Prev
                    </button>
                }
                <button onClick={next} className={"btn btn--next"}>
                    { ((current === length - 1) ? "Last" : "Next") + ` ${current + 1} / ${length}`}
                </button>
            </div>
        )
    }, [])
    
    return (
        <Tour id={"tourId"}
              closeButton={false} 
              badge={false} 
              controls={controls} 
              closeOnBackdrop
              pin> 
            <Step placement={"center"}}>
                <p>
                    This tip is on center of screen <br/>
                    If you click on backdrop then modal will be closed.
                    Check it to see pin !!!
                </p>
            </Step>
        </Tour>
    )
}
```