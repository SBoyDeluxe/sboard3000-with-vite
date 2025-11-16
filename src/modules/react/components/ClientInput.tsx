import React from "react";
import { Input } from "./Input";
import type { ClientInputData, ParticipantInputData } from "./reducers/ParticipantInputReducer";
import { UserStore, useUserStore } from "../store/UserStore";
import { Button } from "./Button";
import type { State } from "./App";
import { ListElementOptions } from "./ListElementOptions";


export type ClientInputProp = {
    onSubmitClient: (username: string, userId: number) => void,
    onRemoveClient: (userId: number) => void,
    participantState: State<{
        projectManagers: ParticipantInputData[];
        projectDevelopers: ParticipantInputData[];
        projectClients: ClientInputData[];
    }>
}


/**
 * Outputs a client-add input text field before clients have been added to the project, 
 * then it produces both that as well as a ListElement above where a user can see the added clients and remove them with a button
 * @param param0 
 * @returns 
 */
export function ClientInput({onRemoveClient, onSubmitClient, participantState }: ClientInputProp) {

        

    //Used to target people from list
        const [selectedUsername, setSelectedUsername] = React.useState({
                                selectedUsername : "",
        });
    
    const initInputState = { usernameInput: "" };
        const [userInput, setUserInput] = React.useState(initInputState);

       function handleUsernameInputChange(e: React.ChangeEvent<HTMLInputElement>){
                e.stopPropagation();
                setUserInput(()=>{
                    return(
                        {usernameInput : e.target.value}
                    )
                });
        }
    function resetInputFields() {
        setUserInput(initInputState);
    }


    const listOptions = ListElementOptions(participantState.stateVariable.projectClients);
    ClientsListElement

    return (
        <>
            {}
        <Input inputState={userInput.usernameInput} onEvent={handleUsernameInputChange}inputType="text" name="usernameInput" labelName="Enter username :" cssClassName="client-username-input">
        </Input>
        <Button isDisabled={false} onClick={submitInputData() } id={"submit-user-button"} cssClassName="participant-input-button">
                <p>{"Add :"}</p>
            </Button></>
    );


    function submitInputData(): React.MouseEventHandler<HTMLButtonElement> {
        return (e) => {
            e.preventDefault();
            e.stopPropagation();
            const inputNotEmpty = userInput.usernameInput.trim() !== "";
            const usernameNotAlreadyInList = participantState.projectClients.filter((client) => client.username === userInput.usernameInput).length == 0;
            if (inputNotEmpty && usernameNotAlreadyInList) {
                //check username-existence
                UserStore.getUserId(userInput.usernameInput).then((userId) => {

                    const isSuccess = (userId !== null);

                    if (isSuccess) {
                        onSubmitClient(userInput.usernameInput, userId);
                        setSelectedUsername({ selectedUsername: userInput.usernameInput });
                    }
                    else {
                        alert(`${userInput.usernameInput} was not found in our database, please try again!`);
                    }
                }).catch((error: Error) => {
                    alert(error);
                }).finally(() => resetInputFields());
            }
            else {
                if (!inputNotEmpty) {
                    alert("Username can not be empty, please try again!");
                }
                else {
                    //username not in list
                    alert("User already exists in your client-list, please try another");

                }
            }
        };
    }

   

}