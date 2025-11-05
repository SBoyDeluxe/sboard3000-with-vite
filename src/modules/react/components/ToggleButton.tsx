import { type CSSProperties } from "react"
import { Button } from "./Button"
import React from "react"

export type ToggleButtonProp = {
    onClick: React.MouseEventHandler<HTMLButtonElement>,
    children?: React.ReactNode,
    cssClassName: string
    style: CSSProperties,
    isDisabled: boolean
}

export function ToggleButton({ cssClassName, style, children, onClick, isDisabled }: ToggleButtonProp) {




    return (

        <>
            <Button cssClassName={cssClassName} isDisabled={isDisabled} onClick={onClick} children={children} style={style} ></Button>
        </>
    )


}