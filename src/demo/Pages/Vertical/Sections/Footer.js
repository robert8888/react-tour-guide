import React from "react";


const Footer = () => {

    return (
        <footer>
            <div className={"l-container"}>
                <div className={"l-row"}>
                    <div className={"l-col-lg-6 l-col-xs-12"}>
                        <h2 className={"section__title"}>About</h2>
                        <p>The idea for this library was to create a trip component library that is created in react way
                            rather than json config, while still keeping the style in a separate css file built in such
                            way that they can be easily overwritten and customized.</p>

                    </div>
                    <div className={"l-col-lg-6 l-col-xs-12"}>
                        <h2 className={"section__title"}>Sources</h2>

                        <span className={"code"}>
                                <pre >npm install react-rtg</pre>
                        </span>
                        <span className={"code"}>
                                <pre>yard add react-rtg</pre>
                        </span>

                        <button className={"button--white"} id={"buttonGithub"}><a href={"www.google.com"}>Github</a></button>
                        <button className={"button--white"}>Npm</button>
                    </div>
                </div>
                <div className={"l-row l-row--bottom"} data-rtg={"footer"}>
                    <div className={"l-col-xs-12"}>
                        @made by Robert Kamińśki <a href={"mailto:robert.kami@gmail.com"}>robert.kami88@gmail.com</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;