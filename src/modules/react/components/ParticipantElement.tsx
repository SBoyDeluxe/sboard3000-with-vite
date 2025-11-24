import { useState, type ReactNode } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import type { ParticipantInputData } from "./reducers/ParticipantInputReducer";
import { getKeysForList } from "./ProjectsTab";
import { UserStore } from "../store/UserStore";



export type ParticipantElementProps = {
    participantType: "Developers" | "Managers",
    /**
     * The list of developers and managers scheduled to be part of the project on creation
     */
    participantInputList: ParticipantInputData[],
    onSubmitUser: (username: string, userType: string[], userId: number) => void,
    onRemoveUser: (username: string, userId: number) => void,
    onAddUserType: (username: string, userId: number, userType: string) => void
    onRemoveUserType: (username: string, userId: number, userType: string | Array<string>) => void

}

/**
 * Produces the following : A text-input element where one can insert a user name (Labeled Developers or Managers)
 *                          , next to it a button ´Add user:´.
 *                          Beneath it another text-input element where one can insert user types, next to it two buttons labeled ´+´,'-'
 *                          When a user has successfully been added a select-element is added populated with the added users as options
 *                          
 *                          States : usernameInputState, userTypeInputState, selectedUsername
 *                          
 */
export function ParticipantElement({ onRemoveUser, onAddUserType, onRemoveUserType, onSubmitUser, participantType, participantInputList }: ParticipantElementProps) {

    const [inputState, setInputState] = useState({
        usernameInput: "",
        userTypeInput: ""
    });
    const [selectedUsernameState, setSelectedUsernameState] = useState("");
    const [selectedUserTypes, setSelectedUserTypes] = useState([""]);



    const participantListEmpty = participantInputList[0].userId == -1;

    //The list of users, also where we select a user for : Adding usertype to or removing
    let userList: ReactNode = (<></>);



    if (!participantListEmpty) {

        const keys = getKeysForList(participantInputList);
        const userOptions: ReactNode = participantInputList.map((participant: ParticipantInputData, index: number) => {


            const userTypesString: string = (participant.userType[0].trim() !== "") ? ` (${participant.userType})` : "";
            return (<option key={keys[index]} value={participant.username}>{participant.username}{userTypesString}</option>)
        });
        userList = (<><select value={selectedUsernameState} onChange={handleSelectedUserListChange}>{userOptions}</select>
            <Button cssClassName="remove-user-button" isDisabled={false} onClick={handleRemoveUserClick} children={<p>Remove user :</p>} />
        </>
        );
    }

    const removeUserTypeButton: ReactNode = (<Button isDisabled={false} cssClassName="remove-user-type-button" onClick={handleRemoveUserTypeClick}>
        {"Remove user-type(s)"}
    </Button>);

    return (<>
        <h3>{participantType} </h3>
         {userList}
        <Input cssClassName={`add-${participantType.substring(0,participantType.length-1).toLocaleLowerCase()}-username-input`} labelName="Enter username :" name="usernameInput" inputState={inputState.usernameInput} onEvent={handleInputFieldChange} inputType="text" />
        <Button cssClassName="add-user-button" isDisabled={false} onClick={handleAddUserClick}>
            {"Add User:"}
        </Button>
        {!participantListEmpty ? (<><UserTypeInputElement setSelectedUserTypes={setSelectedUserTypes} selectedUserTypesState={selectedUserTypes} removeUserTypeButton={removeUserTypeButton} selectedUser={getSelectedUser(participantInputList, selectedUsernameState)} onChange={handleInputFieldChange}  userTypeInputState={inputState.userTypeInput}>

        </UserTypeInputElement>
            <Button isDisabled={false} cssClassName="add-user-type-button" onClick={handleAddUserTypeClick}>
                {"+"}
            </Button>

        </>) : (<></>)
        }
    </>
    );

    function handleSelectedUserListChange(event: React.ChangeEvent<HTMLSelectElement>) {

        event.preventDefault();
        event.stopPropagation();

        setSelectedUsernameState(event.target.value);
    }

    /**
     * Updates the input state on change
     * @param e - change event
     */
    function handleInputFieldChange(e: React.ChangeEvent<HTMLInputElement>) {

        e.preventDefault();
        e.stopPropagation();

        setInputState((prev) => {
            return ({
                ...prev,
                [e.target.name]: e.target.value
            });
        });

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
    function handleAddUserClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        e.preventDefault(); e.stopPropagation();
        if (inputState.usernameInput.trim() !== "" && !(participantInputList.filter((participant) => participant.username === inputState.usernameInput).length > 0)) {
            //check username-existence
            UserStore.getUserId(inputState.usernameInput).then((userId) => {



                onSubmitUser(inputState.usernameInput, [inputState.userTypeInput], userId);
                setSelectedUsernameState(inputState.usernameInput);
            }).catch((error: Error) => {
                alert(error.message);

            }).finally(() => resetInputFields(setInputState, "usernameInput"));
        } else if (inputState.usernameInput.trim() == "") {
            alert("Username field cannot be empty, please try again!");
        } else if (participantInputList.filter((participant) => participant.username === inputState.usernameInput).length > 0) {
            alert(`${inputState.usernameInput} is already added as a ${participantType.substring(0,participantType.length-1)}, please try with another username!`);
        }

    }

    function handleRemoveUserClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        event.preventDefault();
        event.stopPropagation();
        //Add rinse field and set new selected username
        onRemoveUser(selectedUsernameState, getSelectedUser(participantInputList, selectedUsernameState).userId);
        setSelectedUsernameState(participantInputList[0].username);

    }
    function handleAddUserTypeClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        event.preventDefault();
        event.stopPropagation();
        if (inputState.userTypeInput.trim() !== "" && !(getSelectedUser(participantInputList, selectedUsernameState).userType.filter((userTypeEntry: string) => userTypeEntry === inputState.userTypeInput).length > 0)) {
            onAddUserType(selectedUsernameState, getSelectedUser(participantInputList, selectedUsernameState).userId, inputState.userTypeInput);


        } else if (inputState.userTypeInput.trim() == "") {
            alert("User type field cannot be empty, please try again!");
        } else if (getSelectedUser(participantInputList, selectedUsernameState).userType.filter((userTypeEntry: string) => userTypeEntry === inputState.userTypeInput).length > 0) {
            alert(`${selectedUsernameState} already has this user type, please try with another! `);
        }

    } function handleRemoveUserTypeClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

        event.preventDefault();
        event.stopPropagation();
        if (selectedUserTypes[0].trim() !== "" && (getSelectedUser(participantInputList, selectedUsernameState).userType.filter((userTypeEntry: string) => {
            let hasMatch = false;
            for (let i = 0; i < selectedUserTypes.length && !hasMatch; i++) {

                hasMatch = (userTypeEntry == selectedUserTypes[i]);
            }
            return hasMatch;
        }).length > 0)) {
            onRemoveUserType(selectedUsernameState, getSelectedUser(participantInputList, selectedUsernameState).userId, selectedUserTypes);
            setSelectedUserTypes(getSelectedUser(participantInputList, selectedUsernameState).userType.filter((userType)=>!selectedUserTypes.includes(userType)));


        } else if (selectedUserTypes[0] == "") {
            alert("User type field cannot be empty, please try again!");
        } 
        // else if (getSelectedUser(participantInputList, selectedUsernameState).userType.filter((userTypeEntry: string) => userTypeEntry === selectedUserTypes).length == 0) {
        //     alert(`${selectedUsernameState} does not have this type, please try with an entry from their list! `);
        // }

    }
}

type UserTypeInputElementProps = {
    userTypeInputState: string,
    onChange: ((e: React.ChangeEvent<HTMLInputElement>) => void),
    selectedUserTypesState: string[],
    setSelectedUserTypes: React.Dispatch<React.SetStateAction<string[]>>,
    selectedUser: ParticipantInputData,
    removeUserTypeButton: ReactNode
}
function UserTypeInputElement({ onChange,  userTypeInputState, selectedUser, selectedUserTypesState, setSelectedUserTypes, removeUserTypeButton }: UserTypeInputElementProps) {

    //List of all user types to exist as suggestions for user
  //  let allCurrentUserTypes: ReactNode = (<></>);


    //Only if we have added participants do we want to render the list
   // const participantListEmpty = participantInputList[0].userId == -1;

    const selectedUserHasUsertypes = (selectedUser.userType[0] !== "" && selectedUser.userType.length !== 0);

    // if (!participantListEmpty) {



    //     //If we have user types we want to add them so we can suggest them to the user
    //     let allUserTypes: string[] = participantInputList.flatMap((participant: ParticipantInputData) => {
    //         return participant.userType;
    //     });

    //     let allUserTypesNoDoubles: string[];

    //     if (allUserTypes.length > 0) {
    //         allUserTypesNoDoubles = allUserTypes.filter((userType: string, index: number) => {
    //             let notADouble = true;
    //             for (let i = index; i < allUserTypes.length && notADouble; i++) {
    //                 notADouble = (userType !== allUserTypes[i]);

    //             }
    //             //Returns true if no double, false otherwise
    //             return notADouble;
    //         });

    //         const keysForUserTypes = getKeysForList(allUserTypesNoDoubles);
    //         const allUserTypeOptions = allUserTypesNoDoubles.map((userType: string, index: number) => {
    //             return (<option key={keysForUserTypes[index]} value={userType}>{userType}</option>);
    //         });

    //         allCurrentUserTypes = (<datalist id="userTypeSuggestionList">
    //             {allUserTypeOptions}
    //         </datalist>);



    //     }

    // }
    let userTypeSelection: ReactNode = (<></>);

    if (selectedUserHasUsertypes) {

        const keys = getKeysForList(selectedUser.userType);

        const userTypeOptionElements = selectedUser.userType.map((userType: string, index: number) => {

            return (<option key={keys[index]} value={userType}>{userType}</option>);

        });

        userTypeSelection = (<>
            <br></br>
            <br></br>
            <h4>User types:</h4>
            <select multiple={true} value={selectedUserTypesState} onChange={(e) => {
                e.stopPropagation;
                console.log(e.target.value);
            let selectedOptions : string[] = [];
                if(selectedUserTypesState.includes(e.target.value)){
                        selectedOptions = selectedUserTypesState.filter((userType)=>userType !== e.target.value);
                }else{
                selectedOptions = (selectedUserTypesState[0] == "") ? [e.target.value] : selectedUserTypesState.concat(e.target.value);
                }

                setSelectedUserTypes(selectedOptions);
                
            }}>{userTypeOptionElements}
            </select>
            {removeUserTypeButton}
        </>)

    }

    return (!selectedUserHasUsertypes ? (<>
    <h4>User types:</h4>
    <Input cssClassName="user-type-input" labelName="User-type:" name="userTypeInput" inputState={userTypeInputState} inputType="text" onEvent={onChange}>
    </Input>
    </>) : (<>
        {userTypeSelection}
        <Input cssClassName="user-type-input" list="userTypeSuggestionList" labelName="User-type:" name="userTypeInput" inputState={userTypeInputState} inputType="text" onEvent={onChange}>
        </Input>
       </>))

}