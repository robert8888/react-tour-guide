import React from "react";

const Documentation = () => {
    return (
        <section className={"l-container section content"}>
            <h2 className={"section__title title--underscored"} id="documentation">
                Awesome software is well documented
            </h2>
            <p className={"section__subtitle text"}>
                Every piece of code that is created to be reusable have to be well documented.
                Documentation is like business card, like your suit and manners - just creates the first impression
            </p>
            <div className={"l-row"}>
                <div className={"l-col-lg-6 l-col-xs-12"}>,
                    <div className={" content__image"}>
                        <img src={"./demo/completed.png"} alt={"documentary should be completed"}/>
                    </div>
                </div>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <h4 className={"content__title title--underscored title--underscored--left"} data-rtg={"completed"}>
                        Complete
                    </h4>
                    <p>
                        In order for the documentation to be good, the work should be properly planned from the very beginning.
                        Below is a list of steps you should take to create a decent text.
                    </p>
                    <ol>
                        <li>Create a documentation plan</li>
                        <li>Research</li>
                        <li>Writing according to a set plan</li>
                        <li>Verification of the created text</li>
                        <li>Fixes and filling gaps.</li>
                    </ol>
                </div>
            </div>
            <div className={"l-row"}>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <div className={" content__image"}>
                        <img src={"./demo/consistent.png"} alt={"documentary should be completed"}/>
                    </div>
                </div>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <h4 className={"content__title title--underscored title--underscored--left"}>
                        Consistent
                    </h4>
                    <p>
                        Consistent documentation is written in the same style. uses the same concepts and
                        language styles, is harmonious and constitutes a coherent whole.
                    </p>
                </div>
            </div>
            <div className={"l-row"}>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <div className={" content__image"}>
                        <img src={"./demo/accuracy.png"} alt={"documentary should be completed"}/>
                    </div>
                </div>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <h4 className={"content__title title--underscored title--underscored--left"}>
                        Precise
                    </h4>
                    <p>
                        It should be carefully written with attention to detail and relevant use cases.
                        It is good to describe the individual components and include the code with sample code.
                    </p>
                </div>
            </div>
            <div className={"l-row"}>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <div className={"content__image"}>
                        <img src={"./demo/correct.png"} alt={"documentary should be completed"}/>
                    </div>
                </div>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <h4 className={"content__title title--underscored title--underscored--left"}>
                        Correct and up to date
                    </h4>
                    <p>
                        There is nothing worse than outdated documentation. You do everything as instructed and the
                        program doesn't work. So you are constantly looking for a bug in your code while
                        the problem is that someone misled you. It's a crime.
                    </p>
                </div>
            </div>

            <div className={"l-row"}>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <div className={"content__image"}>
                        <img  src={"./demo/understable.png"} alt={"documentary should be completed"}/>
                    </div>
                </div>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <h4 className={"content__title title--underscored title--underscored--left"} id={"registration"}>
                        Understandable - <span className={"nowrap"}>adapted to the recipient</span>
                    </h4>
                    <p>
                        So that he is able to apply the described procedures.
                        According to which you should fill this form:
                    </p>
                    <form onSubmit={e => e.preventDefault()} id={"form"}>
                        <label htmlFor={"name"}>Name: </label>
                        <input id={"name"} name={"name"} type={"text"}/>
                        <label htmlFor={"email"}>Email: </label>
                        <input id={"email"} name={"email"} type={"text"}/>
                        <button type={"sumbit"} id={"btnSubmit"} className={"button--light"}>
                            Submit
                        </button>
                    </form>
                </div>
            </div>

            <div className={"l-row"}>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <div className={" content__image"}>
                        <img src={"./demo/rules.png"} alt={"documentary should be completed"}/>
                    </div>
                </div>
                <div className={"l-col-lg-6 l-col-xs-12"}>
                    <h4 className={"content__title title--underscored title--underscored--left"}>
                        Consistent with internal rules
                    </h4>
                    <p>
                        in accordance with the rules prevailing in the organization - written in accordance with
                        the style manual and guidelines or regulations that are imposed, for example, by the teem or and whole company's
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Documentation;