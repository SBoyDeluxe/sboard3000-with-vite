import { ReactNode, StyleHTMLAttributes, useState } from "react";

export type DetailsProps = {

    cssClassName : string,
    style? : StyleHTMLAttributes<HTMLDetailsElement>,
    summaryContent : ReactNode,
    children : ReactNode,

}

export function Details({children, cssClassName, style,summaryContent}:DetailsProps){

    const [isOpenState, setIsOpenState] = useState(false);

    return(
            <details open={isOpenState} onChange={(e)=>setIsOpenState((prev)=>!prev)}>
                <summary>{summaryContent}</summary>
                {children}
          </details>)
}