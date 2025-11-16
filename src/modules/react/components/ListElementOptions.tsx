import type { Key, ReactNode } from "react";
import type { ParticipantInputData, ClientInputData } from "./reducers/ParticipantInputReducer";
import { getKeysForList } from "./ProjectsTab";

export type ListElementOptions = {
    participantInputDataList: ParticipantInputData[] | ClientInputData[], 
    
}

export function ListElementOptions({participantInputDataList}:ListElementOptions) {

    const reactKeys = getKeysForList(participantInputDataList);
    const listElementOptions : ReactNode = participantInputDataList.map((participantInputData, index) => {

        if (Object.keys(participantInputData).length === 2) {
            if (participantInputData.username.trim() !== "") {
                //Means we have client input and should only show username
                return (

                    <option key={reactKeys[index]} value={participantInputData.username}>{`Username : ${participantInputData.username}`} </option>

                );
            }
        }
        else {
            if (participantInputData.username.trim() !== "") {
                return (

                    <option key={reactKeys[index]} value={participantInputData.username}>{`Username : ${participantInputData.username} | User-types : ${participantInputData.userType}`}</option>
                );
            }
        }
    });

    return listElementOptions;
}
