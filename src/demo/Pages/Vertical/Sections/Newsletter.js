import React from "react"


const Newsletter = () =>{
    return (
        <section className={"l-container newsletter"}>
            <div className={"l-row"}>
                <div className={"l-col-xs-12 l-col-sm-10 l-col-xl-9"}>
                    <h2 className={"section__title title--underscored"} id="newsletter">
                        Tricky part - <span className={"light"}>your identity</span>
                    </h2>
                    <form className={"newsletter__form"} data-rtg={"newsletter"} onSubmit={e => e.preventDefault()}>
                        <label htmlFor={"email"}>Subscribe to the newsletter. Email:</label>
                        <div className={"newsletter__form__group"}>
                            <input id={"inputEmail"} type={"email"} name={"email"}/>
                            <button id={"btnSubmitEmail"} type={"submit"} className={"button button--dark"}>I want to be up to date</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Newsletter;