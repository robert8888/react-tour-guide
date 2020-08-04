import React from "react";
import {
    Header,
    Intro,
    Documentation,
    Slider,
    Newsletter,
    List,
    Footer
} from "./Sections"

const Vertical = ({bus}) => {

    return (
    <>
        <Header/>
        <main className={"page"}>
            <Intro bus={bus}/>
            <Documentation/>
            <Slider/>
            <Newsletter/>
            <List/>
        </main>
        <Footer/>
    </>
    )
};

export default Vertical;