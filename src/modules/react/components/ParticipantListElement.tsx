import type { ReactNode } from "react";
import * as React from "react";
import type { State } from "./App";
import { Button } from "./Button";
import { Details } from "./Details";
import { Input } from "./Input";
import type { ListElementOptions } from "./ListElementOptions";
import type { ParticipantInputData, ClientInputData } from "./reducers/ParticipantInputReducer";

export function ParticipantListElement(selectedUsernameState: State<string>, selectedUser: ParticipantInputData, participantInputDataList: ParticipantInputData[] listEntries: ListElementOptions, handleRemoveUserClick: () => void, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void, userInput: ParticipantInputData, userTypeOptions: ReactNode, userTypeButtons: ReactNode) {
         
     function handleOnAddUserTypeClick(userInput: { usernameInput: string; userTypeInput: string; }, setUserInput: React.Dispatch<React.SetStateAction<{ usernameInput: string; userTypeInput: string; }>>): React.MouseEventHandler<HTMLButtonElement> {

        if (userInput.userTypeInput && userInput.usernameInput) {
            onAddUserType!(userInput.usernameInput, userInput.userTypeInput); resetInputFields(setUserInput, "userTypeInput");
        }

    }
    function handleRemoveUserClick() {
        
                onRemoveUser(selectedUsername!);
        
        
        
            }
    function handleOnRemoveUserTypeClick(userInput: { usernameInput: string; userTypeInput: string; }, setUserInput: React.Dispatch<React.SetStateAction<{ usernameInput: string; userTypeInput: string; }>>): React.MouseEventHandler<HTMLButtonElement> {
            if (userInput.userTypeInput && userInput.usernameInput) {
                onRemoveUserType!(userInput.usernameInput, userInput.userTypeInput);
                resetInputFields(setUserInput, "userTypeInput");
            }
    
        }
    const listElement = (<Details cssClassName="" summaryContent={"Added participants : "}>
        <label htmlFor="added-users-select">{"Selected user :"}</label>

        <select value={selectedUsernameState.stateVariable} onChange={(e) => { e.stopPropagation(); (selectedUsernameState.setState(e.target.value)); selectedUser = participantInputDataList.filter((participant) => participant.username === e.target.value)[0]; }} id="added-users-select">

            {listEntries}
        </select>

        <Button isDisabled={false} onClick={(e) => {
            e.preventDefault(); e.stopPropagation();

            handleRemoveUserClick();

        }} cssClassName="participant-input-button" children={(<p>{"Remove user with username from list"}</p>)} />
        {Object.keys(participantInputDataList[0]).length > 2 &&
            <>
                <Input list="selected-user-usertypes" onEvent={handleChange} onInput={handleInput} inputState={userInput.userTypeInput} inputType="text" name="userTypeInput" labelName="Add/remove user-type :" cssClassName="add-participant-usertype-input" />

                <datalist id="selected-user-usertypes">
                    {userTypeOptions}
                </datalist>
                {userTypeButtons}
            </>}
    </Details>);
    return listElement;
}
