import React from "react";


const Sources = () => {


    return (
        <section className={"horizontal__section horizontal__section--sources"}>
            <div className={"l-container"}>
                <div className={"l-row-g-xs-100 l-row-g-md-200"}>
                    <div className={"l-col-xs-12 l-col-md-6"}>
                        <h2>Check documentation on github or just go to npm and install last version</h2>
                    </div>
                </div>
                <div className={"l-row-g-xs-100"}>
                    <div className={"l-col-xs-12 l-col-md-6"}>
                        <div id={"sources"}>
                            <button className={"button button--dark"}><a href={"/"}> Git hub </a></button>
                            <button className={"button button--secondary"}><a href={"/"}> Npm </a></button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Sources;