import { useContext, type CSSProperties, type ReactNode } from "react";
import infosvg from '/src/assets/info-circle-svgrepo-com.svg';
import { Button } from "./Button";
import { themeContext } from "../context/ThemeContext";
import type { State } from "./App";




export function InfoToggleButton({toggleState }:{toggleState : State<boolean>}) : ReactNode{

    const appThemeContext = useContext(themeContext);

     function setButtonStyle(toggleState: boolean): CSSProperties {
        return (toggleState) ? {
          backgroundColor: appThemeContext.focusedContentColor,
          
          color: appThemeContext.focusedContrastColor,
          textDecoration: `double underline ${appThemeContext.focusedBackgroundColor}`
        } : {
          backgroundColor: appThemeContext.focusedBackgroundColor,
                    
          color: appThemeContext.focusedContrastColor,
        };
      }

      const style = setButtonStyle(toggleState.stateVariable);

    return(<Button style={style} cssClassName="info-toggle-button" isDisabled={false} onClick={()=>{
        toggleState.setState((prev)=>!prev);
        setButtonStyle(toggleState.stateVariable);}} >
<svg className="info-svg" width="15%" height="15%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle opacity="0.5" cx="12" cy="12" r="10" stroke={appThemeContext.focusedContrastColor} strokeWidth="1.5"/>
<path d="M12 17V11" stroke={appThemeContext.focusedContrastColor} strokeWidth="1.5" strokeLinecap="round"/>
<circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 11 9)" fill={appThemeContext.focusedBackgroundColor}/>
</svg></Button>);

}