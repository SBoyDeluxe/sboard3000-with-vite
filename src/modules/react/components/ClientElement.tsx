import React, { type ReactNode } from "react";
import { Input } from "./Input";
import type { ClientInputData } from "./reducers/ParticipantInputReducer";
import { UserStore } from "../store/UserStore";
import { Button } from "./Button";
import { getKeysForList } from "./ProjectsTab";


export type ClientInputProp = {
    onSubmitClient: (username: string, userId: number) => void,
    onRemoveClient: (username : string,userId: number) => void,
    clientInputList : ClientInputData[]
}


/**
 * Outputs a client-add input text field before clients have been added to the project, 
 * then it produces both that as well as a ListElement above where a user can see the added clients and remove them with a button
 * @param param0 
 * @returns 
 */
export function ClientElement({ onRemoveClient, onSubmitClient, clientInputList }: ClientInputProp) {


    const participantListEmpty = clientInputList[0].userId == -1;



    //Used to target people from list
    const [selectedUsername, setSelectedUsername] = React.useState("");


    const initInputState = { usernameInput: "" };
    const [userInput, setUserInput] = React.useState(initInputState);

    function handleUsernameInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();
        setUserInput(() => {
            return (
                { usernameInput: e.target.value }
            )
        });
    }
    function resetInputFields() {
        setUserInput(initInputState);
    }
    //The list of users, also where we select a user for : Adding usertype to or removing
    let userList: ReactNode = (<></>);



    if (!participantListEmpty) {

        const keys = getKeysForList(clientInputList);
        const userOptions: ReactNode = clientInputList.map((participant: ClientInputData, index: number) => {


            return (<option key={keys[index]} value={participant.username}>{participant.username}</option>)
        });
        userList = (<><select value={selectedUsername} onChange={handleSelectedUserListChange}>{userOptions}</select>
            <Button cssClassName="remove-user-button" isDisabled={false} onClick={handleRemoveUserClick} children={<p>Remove User:</p>}/>
        </>
        );
    }

    

    return (
        <>
                    <h3>Clients</h3>

            {userList}
            <Input inputState={userInput.usernameInput} onEvent={handleUsernameInputChange} inputType="text" name="usernameInput" labelName="Enter username :" cssClassName="client-username-input">
            </Input>
            <Button isDisabled={false} onClick={submitInputData}  cssClassName="add-user-button">
                {"Add User:"}
            </Button></>
    );
    function handleSelectedUserListChange(event: React.ChangeEvent<HTMLSelectElement>) {

        event.preventDefault();
        event.stopPropagation();

        setSelectedUsername(event.target.value);
    }
    function handleRemoveUserClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        event.preventDefault();
        event.stopPropagation();
        const userId: number = getSelectedUser()[0].userId;
         
        onRemoveClient(selectedUsername,userId);
            if(clientInputList.length == 1){
                setSelectedUsername("")}
            else{
              const listWithoutRemovedUser =  clientInputList.filter((client)=>{
                    return client.userId !== userId;

                });
                 setSelectedUsername(listWithoutRemovedUser[0].username);

            } 
       
  

    }
    function getSelectedUser() {
        const filteredList = clientInputList.filter((client) =>  client.username == selectedUsername);
        return filteredList;
    }

    function submitInputData(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
            e.preventDefault();
            e.stopPropagation();
            const inputNotEmpty = userInput.usernameInput.trim() !== "";
            const usernameNotAlreadyInList = clientInputList.filter((client) => client.username === userInput.usernameInput).length == 0;
            if (inputNotEmpty && usernameNotAlreadyInList) {
                //check username-existence
                UserStore.getUserId(userInput.usernameInput).then((userId) => {

                    const isSuccess = (userId !== null);

                    if (isSuccess) {
                        onSubmitClient(userInput.usernameInput, userId);
                        setSelectedUsername( userInput.usernameInput );
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
    }



}