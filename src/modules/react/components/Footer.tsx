import { Background } from "./background"
import { themeContext } from "../context/ThemeContext"
import { useContext, type ReactNode } from "react";


export type FooterProps = {

    content? :React.ReactNode,

}

export function Footer({content}:FooterProps):ReactNode{
   const appThemeContext = useContext(themeContext);

    return(
        <>
            <Background key={()=>window.crypto.randomUUID} cssClassName="page-footer" >
                                {content}
            </Background>
        </>

    )

}