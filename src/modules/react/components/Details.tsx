import { type ReactNode, type StyleHTMLAttributes, useState } from "react";

export type DetailsProps = {

    cssClassName : string,
    style? : StyleHTMLAttributes<HTMLDetailsElement>,
    summaryContent : ReactNode,
    children : ReactNode,

}

export function Details({children, cssClassName,summaryContent}:DetailsProps){

    const [isOpenState, setIsOpenState] = useState(false);

    return(
            <details  className={cssClassName}  open={isOpenState} onChange={()=>setIsOpenState((prev)=>!prev)}>
                <summary>{summaryContent}</summary>
                {children}
          </details>)
}