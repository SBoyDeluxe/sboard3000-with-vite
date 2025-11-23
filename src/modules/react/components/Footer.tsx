import { Background } from "./background"
import { type ReactNode } from "react";


export type FooterProps = {

    content? :React.ReactNode,

}

export function Footer({content}:FooterProps):ReactNode{

    return(
        <>
            <Background  cssClassName="page-footer" >
                                {content}
            </Background>
        </>

    )

}