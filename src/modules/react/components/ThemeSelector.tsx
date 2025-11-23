import Color from 'colorjs.io';
import { Theme, ThemeValues } from "../../theme";
import type { State } from "./App";
import { useState } from "react";
import { Background } from "./background";
import { Input } from "./Input";
import { Form } from './Form';
export type ThemeSelectorProps = {


    themeState: State<ThemeValues>


};
/*
/*
 * Draws a theme selector, where one can generate their own theme or pick one of three standard ones.
 * 
 */
export function ThemeSelector({ themeState }: ThemeSelectorProps) {
   // const appThemeContext = useContext(themeContext);
    //let themeVal : string = useMemo(()=>appThemeContext.primaryBackgroundColor, [themeState.stateVariable]);



    const [genStratSelect, setGenstrat] = useState(0);
    const [lightnessPreferenceSelect, setLightnessPreference] = useState(0);
    const [themeInputState, setThemeInputState] = useState(themeState.stateVariable.primaryBackgroundColor);


    // function handleChange(event: (React.ChangeEvent<HTMLInputElement>)) {
    //     event.stopPropagation();
    //     event.preventDefault();




    //     console.log(event.currentTarget.value);
    //     setThemeInputState(event.target.value);
    //     const themeVals = Theme.generateTheme([new Color(event.currentTarget.value)], genStratSelect, lightnessPreferenceSelect);
    //     themeState.setState(themeVals);


    //     //
    // };



    return (


        <Background backgroundColor={themeState.stateVariable.tertiaryBackgroundColor} cssClassName="theme-selector-container" >
            <Form onSubmit={() => console.log("sub")} cssClassName={''}>
                <label htmlFor="generation-strategy-select">Theme-generation settings:</label>
                <select onChange={(e) =>{setGenstrat(+e.currentTarget.value)}} value={genStratSelect} title="Color-selection for theme" name="generation-strategy-select" id="generation-strategy-select">
                    <option value="0">Mono-chromatic</option>
                    <option value="1">Analagous</option>
                    <option value="2">Complementary</option>
                    <option value="3">Triadic</option>
                    <option value="4">Compound</option>
                </select>
                <label htmlFor="lightness-preference-select">Theme-lightness settings:</label>
                <select value={lightnessPreferenceSelect} onChange={(e) => {setLightnessPreference(+e.currentTarget.value)}} title="Lightness-setting-selection for theme" name="lightness-setting-select" id="lightness-preference-select">
                    <option value="0">Dark</option>
                    <option value="1">Medium </option>
                    <option value="2">Light</option>
                </select>

                <Input inputState={themeInputState} name="color-selection"  cssClassName="color-select" inputType="color" labelName="Color-selection" onEvent={(e)=>{
                    e.stopPropagation();
                   
                    setThemeInputState(e.target.value);
                    themeState.setState(Theme.generateTheme([new Color(e.target.value)], genStratSelect, lightnessPreferenceSelect))
                }}  ></Input>

            </Form>
        </Background>

    );


}
