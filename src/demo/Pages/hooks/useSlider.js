import {useState, useEffect, useCallback} from "react"

export default function useSlider(slider, minSlideWidth = 260){
    const [slideWidth, setSlideWidth] = useState(0);
    const [current, setCurrent] = useState(0);
    const [visibleSlides, setVisibleSlides]  = useState(0);

    const updatePosition = useCallback((current)=>{
        if(!slider.current) return;
        slider.current.parentElement.scrollTo({left: current * slideWidth, behavior: "smooth"});
    }, [slider, slideWidth])

    useEffect(()=>{
        if(!slideWidth) return ;
        updatePosition(current)
    }, [current, slideWidth, updatePosition])

    const updateSliderPosition = useCallback(()=>{
        const current = Math.round(slider.current.parentElement.scrollLeft / slideWidth);
        setCurrent(current);
        updatePosition(current)
    }, [slider, slideWidth, setCurrent, updatePosition])

    const move = useCallback((shift, startPosition, event)=>{
        const clientX = event.clientX || event.touches[0].clientX;
        slider.current.parentElement.scrollLeft =  startPosition - clientX + shift;
    },[slider])

    const mouseDown = useCallback((event)=>{
        const startPosition = slider.current.parentElement.scrollLeft;
        const shift = event.clientX || event.touches[0].clientX;
        const mm = move.bind(null, shift, startPosition);
        window.addEventListener("mousemove", mm);
        window.addEventListener("touchmove", mm);
        window.addEventListener("mouseup", function mouseup(){
            window.removeEventListener("mouseup", mouseup);
            window.removeEventListener("mousemove", mm);
            updateSliderPosition();
        })
        window.addEventListener("touchend", function touchEnd(){
            window.removeEventListener("touchend", touchEnd)
            window.removeEventListener("touchmove", mm);
            updateSliderPosition();
        })
    }, [slider, move, updateSliderPosition])

    const updateSlideWidth = useCallback(()=>{
        if(!slider.current) return;
        const rect = slider.current.parentElement.getBoundingClientRect();
        const visibleSlides = ~~(rect.width / minSlideWidth);
        setSlideWidth(rect.width / visibleSlides);
        setVisibleSlides(visibleSlides)
    }, [minSlideWidth, setSlideWidth,setVisibleSlides, slider]);

    useEffect(()=>{
        if(!slideWidth || !slider.current) return;
        Array.from(slider.current.children).forEach(slide => slide.style.width = slideWidth + "px");
        slider.current.style.width = slider.current.childNodes.length * slideWidth + "px";
    }, [slider, slideWidth])

    useEffect(()=>{
        updateSlideWidth();
        window.addEventListener('resize', updateSlideWidth);
        return () => {
            window.removeEventListener('resize', updateSlideWidth);
        }
    },[slider, updateSlideWidth])

    const next = useCallback(()=>{
        if(!slider.current) return;
        setCurrent(current => Math.min((current + 1), slider.current.childNodes.length - visibleSlides));
    }, [slider, visibleSlides, setCurrent])

    const prev = useCallback(()=>{
        if(!slider.current) return;
        setCurrent(current => Math.max((current - 1), 0));
    }, [slider, setCurrent])

    return [prev, next, mouseDown]
}