import {useEffect, useCallback, useState} from "react";

export default function useFullPageSlider(slider){
    const [current, setCurrent] = useState(0);
    const [slideWidth, setSlideWidth] = useState(0);

    const updateScrollPosition = useCallback((slide)=>{
        document.body.scrollTo({left : slideWidth  * slide, behavior: "smooth"});
    }, [slideWidth])

    useEffect(function updatePosition(){
        updateScrollPosition(current)
    }, [current, updateScrollPosition])

    useEffect(function updateSliderWidth(){
        if(!slider.current) return;
        slider.current.style.width = slider.current.childNodes.length * slideWidth + "px";
        Array.from(slider.current.children).forEach(slide => {
            slide.style.width =  slideWidth + "px";
        })
    }, [slider, slideWidth])

    const updateSize = useCallback(() => {
        setSlideWidth(window.innerWidth);
        updateScrollPosition(current)
    }, [current , setSlideWidth, updateScrollPosition]);

    const quantizeSlide = useCallback(()=>{
        const slide = Math.round(document.body.scrollLeft / slideWidth);
        setCurrent(slide)
        updateScrollPosition(slide)
    }, [slideWidth, setCurrent, updateScrollPosition])

    const next = useCallback(() =>
            setCurrent(current => Math.min(current + 1, slider.current.childNodes.length - 1)),
        [setCurrent, slider]);

    const prev = useCallback(() =>
            setCurrent(current => Math.max(current - 1, 0))
        ,[setCurrent]);

    const pointerMove = useCallback((shiftX, {clientX, touches})=>{
        const cx = (touches && touches[0].clientX) || clientX;
        document.body.scrollLeft = shiftX - cx;
    }, [])

    const pointerStart = useCallback(({clientX, touches})=>{
        const cx = (touches && touches[0].clientX) || clientX;
        const scrollLeft = document.body.scrollLeft;
        const shiftX = scrollLeft + cx;
        const pm = pointerMove.bind(null, shiftX);
        window.addEventListener("mousemove", pm)
        window.addEventListener("touchmove", pm);

        const mouseUp = () => {
            window.removeEventListener("mousemove", pm)
            window.removeEventListener("touchmove", pm)
            window.removeEventListener("mouseup", mouseUp)
            window.removeEventListener("touchend", mouseUp);
            quantizeSlide();
        }
        window.addEventListener("mouseup", mouseUp)
        window.addEventListener("touchend", mouseUp)

    }, [pointerMove, quantizeSlide])

    useEffect(()=>{
        updateSize();
        window.addEventListener("resize", updateSize);
        return ()=> {
            window.removeEventListener("resize", updateSize);
        }
    }, [updateSize])

    useEffect(()=>{
        document.body.style.overflowX = "hidden";
        return () => document.body.style.overflowX = "unset";
    }, [])

    return [prev, next, pointerStart, quantizeSlide];
}