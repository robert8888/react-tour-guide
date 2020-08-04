import React from "react";


const List = () => {


    return (
        <section className={"list__section section"}>
            <div className={"l-container"}>
                <div className={"l-row"}>
                    <h2 className={"section__title title--underscored"}>Long list with scroll bars</h2>
                    <div className={"l-col-xs-12 l-col-lg-11"}>
                        <div className={"list__container"}>
                            <ol>
                                <li data-rtg={"list-1"}>All documents must be accurate and written in a manner that prevents
                                    errors and ensures consistency. If documents are to be used together,
                                    e.g. an SOP and a form, then each should reference the other.
                                    Ensure there is traceability between two or more documents/records
                                    using formal document numbers or record identification.
                                </li>
                                <li data-rtg={"list-2"}>
                                    All records must be filled out in indelible ink for long term legibility. Do
                                    not use pencil or ink that can be erased.
                                    Colour should be specified by the company GDP procedure; often this is
                                    limited to blue or black because historically copy/scanning technology
                                    was limited in reproduction quality. However, this is less of a factor
                                    with the advent of high resolution scanners and colour copiers.
                                </li>
                                <li data-rtg={"list-3"}>
                                    A document is unusable if it cannot be read, so care must be taken to
                                    ensure that handwriting is legible. All entries must be made at the time
                                    the tasks are performed and should be legibly signed and dated.
                                    The same is true of electronic documents and records – language
                                    should be clear and unambiguous
                                </li>
                                <li data-rtg={"list-4"}>
                                    Documents and records should be reviewed by someone who did not
                                    perform the task to ensure that the information is correct and
                                    accurate. A signature and date by the reviewer/approver confirms that
                                    a review has taken place.
                                </li>
                                <li data-rtg={"list-5"}>
                                    Handwritten signatures must be unique to the individual and listed
                                    within the site signature register to ensure that the signature is
                                    traceable to a member of staff (or contractor). Staff are not permitted
                                    to sign for another member of staff unless delegated. Signatures must
                                    never be forged.
                                    The management of the signature record should be governed by a
                                    procedure and routinely reviewed so that it remains current – new staff
                                    should sign the signature register during induction, the signature
                                    register must indicate the date staff exit the company. Electronic
                                    signatures must meet the same general documentation requirements
                                </li>
                            </ol>
                        </div>
                        <p className={"list__source"}>
                            This white paper describes the fundamental requirements of
                            Good Documentation Practice (GDP) routinely used within the
                            pharmaceutical industry – as best practice standards or as a
                            direct requirement of the Code of Good Manufacturing
                            Practice (GMP).
                        </p>
                    </div>
                </div>
            </div>

        </section>
    )
}

export  default List;