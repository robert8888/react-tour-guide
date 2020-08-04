import React from "react";

const Roentgen = () => {

    return (
        <section className={"horizontal__section horizontal__section--roentgen"}>
            <div className={"l-container"}>
                <div className={"l-row-g-xs-20  l-row-g-md-150"}>
                    <div className={"l-col-xs-12 l-col-md-6"}>
                        <img src={"./person.png"} alt={"adf"}/>
                        <h1 className={"section__tittle"}>Wilhelm Conrad Röntgen</h1>

                    </div>
                    <div className={"l-col-xs-12 l-col-md-6"}>
                        <p id={"roentgenAbout"}>
                            Wilhelm Conrad Röntgen  27 March 1845 – 10 February 1923) was a German[1] mechanical engineer
                            and physicist, who, on 8 November 1895, produced and detected electromagnetic radiation
                            in a wavelength range known as X-rays or Röntgen rays, an achievement that earned him
                            the first Nobel Prize in Physics in 1901.[3] In honour of his accomplishments, in
                            2004 the International Union of Pure and Applied Chemistry (IUPAC) named element 111,
                            roentgenium, a radioactive element with multiple unstable isotopes, after him.
                        </p>
                    </div>
                </div>
                <div className={"l-row-g-xs-20 l-row-g-lg-20"}>
                    <div className={"l-col-xs-12 l-col-lg-9"}>
                        <h3> His honors include:</h3>
                        <ol>
                            <li>Rumford Medal (1896)</li>
                            <li>Matteucci Medal (1896)</li>
                            <li>Elliott Cresson Medal (1897)</li>
                            <li>Nobel Prize for Physics (1901)</li>
                            <li>In November 2004 IUPAC named element number 111 roentgenium (Rg) in his honour. IUPAP adopted the name in November 2011.</li>
                            <li>In 1907 he became a foreign member of the Royal Netherlands Academy of Arts and Sciences</li>
                        </ol>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Roentgen;