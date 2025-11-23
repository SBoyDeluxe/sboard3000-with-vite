import { type HeaderProps } from "./Header"
import { type TabRowProps } from "./TabRow"
import type { State } from "./App"


export type TabPageProps = {

    /**
     * 
     * @type {TabRowProps} The props specifying the TabRow to be displayed on the TabPage
     */
    tabRowProps? : TabRowProps,
    /**
     * A function representing the contents of a specific tab with a specific tab number
     * 
     * @param number The activeTabNumber as seen in TabRowProps
     * @returns The contents of the tab to be displayed when the tab specified by the activeTabNumber is selected
     */
    tabs : (tabstate: number)=>React.ReactNode,

    headerProps : HeaderProps,

    activeTabState : State<number>

}


export function TabPage({ activeTabState, tabs}:TabPageProps){



    return(
        
                                    <>        
                                    {tabs(activeTabState.stateVariable)}
                                </>
    )
}