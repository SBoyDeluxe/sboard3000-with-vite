import type { State } from "./App";
import { Button } from "./Button";
import type { Details } from "./Details";
import { Input } from "./Input";
import type { ListElementOptions } from "./ListElementOptions";
import type { ClientInputData } from "./reducers/ParticipantInputReducer";

export type ClientsListElementProps = {

    onRemoveUser : (selectedUser : ClientInputData) => void,
    clientOptions : ListElementOptions,
    addedClients : ClientInputData[],
    selectedClientUsernameState : State<string>


}

export function ClientsListElement({selectedClientUsernameState,addedClients, clientOptions, onRemoveUser}:ClientsListElementProps){

function handleRemoveUserClick(e : React.MouseEvent<HTMLButtonElement>) {

            if(selectedClientUsernameState.stateVariable.trim()!==""){
        
                onRemoveUser(selectedUsername!);
             }
        
        
            }
    function handleOnRemoveUserClick(userInput: ClientInputData, setUserInput: React.Dispatch<React.SetStateAction<{ usernameInput: string; userTypeInput: string; }>>): React.MouseEventHandler<HTMLButtonElement> {
          
    
        }
    const listElement = (<Details cssClassName="" summaryContent={"Added Clients : "}>
        <label htmlFor="added-users-select">{"Selected Client :"}</label>

        {(addedClients[0])(<select value={selectedUsernameState.stateVariable} onChange={(e) => { e.stopPropagation(); (selectedUsernameState.setState(e.target.value)); selectedUser = participantInputDataList.filter((participant) => participant.username === e.target.value)[0]; }} id="added-users-select">

            
        </select>)}

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
    return listElement;}