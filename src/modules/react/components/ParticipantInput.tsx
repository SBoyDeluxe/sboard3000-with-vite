import * as React from "react";
import { useContext, Fragment, type ReactNode } from "react";
import { UserStore, firebaseClientContext, useUserStore } from "../store/UserStore";
import { Background } from "./background";
import { Button } from "./Button";
import { Input } from "./Input";
import { ListElementOptions } from "./ListElementOptions";
import { ParticipantListElement } from "./ParticipantListElement";
import { getKeysForList } from "./ProjectsTab";
import type { ParticipantInputData } from "./reducers/ParticipantInputReducer";

type ParticipantInputProps = {

    onAddUserType?: (username: string, userTypeInput: string) => void;

    onRemoveUserType?: (username: string, userTypeToRemove: string) => void;

    onRemoveUser: (username: string) => void;

    onSubmitUser: (username: string, userTypeInput?: string[], userId: number) => void;
    /**
     * Called to show the participants already input by the user as a list
     *
     */
    participantInputDataList: ParticipantInputData[];
};

/**
 *  Shows : 
 *              -The user input for Developer and manager, that is, the text field used to add new Developers and managers
 *              
 * 
 */
export function ParticipantInput({ participantInputDataList, onAddUserType, onRemoveUser, onRemoveUserType, onSubmitUser }: ParticipantInputProps) {


    const userStore = useUserStore();


    const [userInput, setUserInput] = React.useState({ usernameInput: "", userTypeInput: "" });

    let handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { };

   




    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {



        setUserInput((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };












    inputElement = (<>

        <Input onEvent={handleChange} inputState={userInput.usernameInput} inputType="text" name="usernameInput" labelName="Add user :" cssClassName="add-participant-username-input" />


        <Button onClick={(e) => {
            e.preventDefault(); e.stopPropagation();
            if (userInput.usernameInput && !(participantInputDataList.filter((participant) => participant.username === userInput.usernameInput)[0])) {
                //check username-existence
                appFirebaseClientContext.getUserIds([userInput.usernameInput]).then((userId) => {

                    return userId[0];
                }).then((userId) => {
                    const isSuccess = (userId !== null);

                    if (isSuccess) {
                        onSubmitUser(userInput.usernameInput, [userInput.userTypeInput], userId);
                        setSelectedUsername(userInput.usernameInput);
                    }
                    else {
                        alert(`${userInput.usernameInput} was not found in our database, please try again!`);
                    }
                }).catch((error: Error) => {
                    console.log(error);
                }).finally(() => resetInputFields(setUserInput()));
            }
        }} id="submit-user-button" cssClassName="participant-input-button">
            <p>{"Add :"}</p>
        </Button>

    </>);

    userTypeButtons = (<> <Button onClick={(e) => {
        e.preventDefault(); e.stopPropagation();
        //Check wheter the userType-array has been initialized, if so compare input to see the type is not already included
        if (userInput.userTypeInput.trim() !== "" && !selectedUser.userType.includes(userInput.userTypeInput)) {
            handleOnAddUserTypeClick({ usernameInput: selectedUsername, userTypeInput: userInput.userTypeInput }, setUserInput);
        }
    }} id="usertype-add-button" cssClassName="participant-input-button">
        <p>{"+"}</p>
    </Button>
        <Button onClick={(e) => {
            e.preventDefault(); e.stopPropagation();
            if (userInput.userTypeInput.trim() !== "" && selectedUser.userType.includes(userInput.userTypeInput)) {
                handleOnRemoveUserTypeClick({ usernameInput: selectedUsername!, userTypeInput: userInput.userTypeInput }, setUserInput);
            }
        }}
            id="usertype-remove-button" cssClassName="participant-input-button" children={(<p>{"-"}</p>)} /> </>);
}
{
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        e.stopPropagation();

        setUserInput((prev) => ({
            usernameInput: e.target.value
        }));
    };



    handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        event.stopPropagation();
        setUserInput((prev) => ({
            usernameInput: event.target.value
        }));
    };
    inputElement = (<>

        <Input onInput={handleInput} onEvent={handleChange} inputState={userInput.usernameInput} inputType="text" name="usernameInput" labelName="Enter username :" cssClassName="add-client-username-input" />
        <Button onClick={(e) => {
            e.preventDefault(); e.stopPropagation(); if (userInput.usernameInput) {
                appFirebaseClientContext.getUserIds([userInput.usernameInput]).then((userId) => {

                    return userId[0];
                }).then((userId) => {
                    const isSuccess = (userId !== null);

                    if (isSuccess) {
                        onSubmitUser(userInput.usernameInput, undefined, userId);
                        setSelectedUsername(userInput.usernameInput);
                        setUserInput({ usernameInput: "" });
                    }
                    else {
                        alert(`${userInput.usernameInput} was not found in our database, please try again!`);
                    }
                }).catch((error: Error) => {
                    console.log(error);
                });
            }
        }} id="submit-user-button" cssClassName="participant-input-button">
            <p>{"Add :"}</p>
        </Button>
    </>);



}
let listEntries = ListElementOptions({ participantInputDataList });
let selectedUser = getSelectedUser(participantInputDataList, selectedUsername);
let userTypeOptions = UserTypeOptions(participantInputDataList);
//The list where you can handle already added users
listElement = ParticipantListElement(listElement, selectedUsername, setSelectedUsername, UserTypeOptions(selectedUser), participantInputDataList, listEntries, handleRemoveUserClick, handleChange, handleInput, userInput, userTypeOptions, userTypeButtons);
;
return (
    <Fragment>
        <Background cssClassName="participant-input-container">
            {(listEntries[0] !== (undefined)) &&
                listElement}
            {inputElement}
        </Background>
    </Fragment>
);
function UserTypeOptions(selectedUser: ParticipantInputData) {
    let userTypeOptions: ReactNode = (<></>);
    if (selectedUser && selectedUser.userType[0].trim() !== "") {
        let keysForUserTypeOptions = getKeysForList(selectedUser.userType);
        userTypeOptions = (selectedUser.userType.map((usertype, index) => {




            return (

                <option key={keysForUserTypeOptions[index]} value={usertype}></option>
            );



        }));
    }
    return userTypeOptions;
}
/**
 * Sets one or both user inputs of username and userType to ""
 *
 * @param setUserInput The setter function of the input variables
 * @param fieldOption The specific field to be reset, if fieldOption is left out both fields are reset
 */
function resetInputFields(setUserInput: React.Dispatch<React.SetStateAction<{ usernameInput: string; userTypeInput: string; }>>, fieldOption?: "usernameInput" | "userTypeInput") {


    const fieldOptionIsDefined = (fieldOption) ? true : false;

    switch (fieldOptionIsDefined) {
        case false: {
            //No field option specified -> Means both fields should be reset
            setUserInput({ usernameInput: "", userTypeInput: "" });
        }

            break;

        default: {

            setUserInput((prevState) => {
                return ({
                    ...prevState,
                    [fieldOption!]: ""
                });
            });
        }
            break;
    }
}
function getSelectedUser(participantInputDataList: ParticipantInputData[], selectedUsername: string) {
    return participantInputDataList.filter((participant) => participant.username === selectedUsername)[0];
}
