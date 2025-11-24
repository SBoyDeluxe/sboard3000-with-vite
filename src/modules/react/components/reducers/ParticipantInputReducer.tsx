import { useReducer } from "react";

export type ParticipantInputData = {

    username: string,
    userType: string[],
    userId: number
};
export type ClientInputData = {

    username: string,
    userId: number
};
export function useParticipantReducer() {

    const initState = getInitState();

    return useReducer(ParticipantInputReducer, initState);
}

 export function getInitState() {
    let projectManagers: ParticipantInputData[] =   [{ username: "", userType: [""], userId: -1 }];
    let projectDevelopers: ParticipantInputData[] = [{ username: "", userType: [""], userId: -1 }];
    let projectClients: ClientInputData[] =                         [{ username: "", userId: -1 }];
    //The creating user is implicitly manager of the project 
    // const loggedInUser = UserStore.getSnapshotUser();
    // projectManagers[0] = { username: loggedInUser?.username.username!, userType: ["Creator"], userId: loggedInUser?.authParameters.userId! };

    const initState = {
        projectManagers,
        projectDevelopers,
        projectClients
    };
    return initState;
}

export function ParticipantInputReducer(participantsState: {
    projectManagers: ParticipantInputData[],
    projectDevelopers: ParticipantInputData[],
    projectClients: ClientInputData[],
}, action: { type: string, payload: any }) {

    let returnState = participantsState;
    const projectDevelopersIsUninitiated = participantsState.projectDevelopers[0].userId == -1;
    const projectManagersIsUninitated = participantsState.projectManagers[0].userId == -1;
    const projectClientsIsUninitiated = participantsState.projectClients[0].userId == -1;




    switch (action.type) {
        case "ADD_MANAGER_INPUT_DATA": {

            if (projectManagersIsUninitated) {

                returnState = participantsState = {
                    ...participantsState,
                    projectManagers: [action.payload]
                };

            } else {
                returnState = {
                    ...participantsState,
                    projectManagers: participantsState.projectManagers.concat({
                        username: action.payload.username,
                        userType: action.payload.userType,
                        userId: action.payload.userId
                    })
                };

            }





        }

            break;
        case "ADD_MANAGER_USER_TYPE": {


            let managerToAddTypeTo = participantsState.projectManagers.filter((manager, _index) => manager.username === action.payload.username)[0];
            if (managerToAddTypeTo) {

                const newUserTypeArray = (managerToAddTypeTo.userType[0].trim() !== "") ? managerToAddTypeTo.userType.concat(action.payload.userType) : [action.payload.userType];

                returnState = ({
                    ...participantsState,
                    projectManagers: participantsState.projectManagers.filter((dev) => dev.username !== action.payload.username).concat({ ...managerToAddTypeTo, userType: newUserTypeArray })
                });

            } else {

                returnState = participantsState;
            }









        }

            break;
        case "REMOVE_MANAGER_USER_TYPE": {



            if (Array.isArray(action.payload.userType)) {

                const newProjectManagerArray = participantsState.projectManagers.map((manager) => {
                    let returnManager = manager;

                    if (manager.userId == action.payload.userId) {
                        if (manager.userType.length == 1 && manager.userType[0] !== "") {

                            returnManager = {
                                userId: manager.userId,
                                userType: [""],
                                username: manager.username

                            }
                        } else {
                            returnManager = {
                                userId: manager.userId,
                                userType: manager.userType.filter((userType) => {
                                    let noMatch = true;

                                    for (let i = 0; i < action.payload.userType.length && noMatch; i++) {

                                        noMatch = (userType !== action.payload.userType[i]);
                                    }
                                    return noMatch
                                }),
                                username: manager.username
                            }
                        }
                    }
                    return returnManager;

                });

                returnState = ({
                    ...participantsState,
                    projectManagers: newProjectManagerArray
                }
                );

            }
            else if (typeof action.payload.userType == "string") {
                const newProjectManagerArray = participantsState.projectManagers.map((manager) => {
                    let returnManager = manager;
                    if (manager.userId == action.payload.userId) {
                        returnManager = {
                            userId: manager.userId,
                            userType: manager.userType.filter((userType) => userType !== action.payload.userType),
                            username: manager.username
                        }
                    }
                    return returnManager;
                });

                returnState = ({
                    ...participantsState,
                    projectManagers: newProjectManagerArray
                }
                );
            }
        }






            break;
        case "ADD_DEVELOPER_INPUT_DATA": {

            if (projectDevelopersIsUninitiated) {
                returnState = {
                    ...participantsState,
                    projectDevelopers: [{
                        username: action.payload.username,
                        userType: action.payload.userType,
                        userId: action.payload.userId
                    }]
                }
            } else {
                returnState = {
                    ...participantsState,
                    projectDevelopers: participantsState.projectDevelopers.concat({
                        username: action.payload.username,
                        userType: action.payload.userType,
                        userId: action.payload.userId
                    })
                }
            }





        }

            break;
        case "ADD_DEVELOPER_USER_TYPE": {


            let developerToAddTypeTo = participantsState.projectDevelopers.filter((dev, _index) => dev.username === action.payload.username)[0];
            if (developerToAddTypeTo) {

                const newUserTypeArray = (developerToAddTypeTo.userType[0].trim() !== "") ? developerToAddTypeTo.userType.concat(action.payload.userType) : [action.payload.userType];

                returnState = ({
                    ...participantsState,
                    projectDevelopers: participantsState.projectDevelopers.filter((dev) => dev.username !== action.payload.username).concat({ ...developerToAddTypeTo, userType: newUserTypeArray })
                });

            } else {

                returnState = participantsState;
            }

        }

            break;
        case "REMOVE_DEVELOPER_USER_TYPE": {


            if (Array.isArray(action.payload.userType)) {

                const newProjectDeveloperArray = participantsState.projectDevelopers.map((dev) => {
                    let returnDeveloper = dev;
                    if (dev.userId == action.payload.userId) {
                    
                        if (dev.userType.length == action.payload.userType.length) {

                            returnDeveloper = {
                                userId: dev.userId,
                                userType: [""],
                                username: dev.username

                            }
                        } else {
                            returnDeveloper = {
                                userId: dev.userId,
                                userType: dev.userType.filter((userType) => {
                                    let noMatch = true;

                                    for (let i = 0; i < action.payload.userType.length && noMatch; i++) {

                                        noMatch = (userType !== action.payload.userType[i]);
                                    }
                                    return noMatch;
                                }),
                                username: dev.username
                            }
                        }
                        return returnDeveloper;
                    }
                    return returnDeveloper;
                });

                returnState = ({
                    ...participantsState,
                    projectDevelopers: newProjectDeveloperArray as ParticipantInputData[]
                });

            }
            else if (typeof action.payload.userType == "string") {
                const newProjectDeveloperArray = participantsState.projectDevelopers.map((dev) => {
                    let returnDeveloper = dev;
                    if (dev.userId == action.payload.userId) {
                        returnDeveloper = {
                            userId: dev.userId,
                            userType: dev.userType.filter((userType) => userType !== action.payload.userType),
                            username: dev.username
                        }
                    }
                    return returnDeveloper;
                });

                returnState = ({
                    ...participantsState,
                    projectDevelopers: newProjectDeveloperArray
                }
                );
            }

        }

            break;
        case "ADD_CLIENT_INPUT_DATA": {




            if (projectClientsIsUninitiated) {
                returnState = {
                    ...participantsState,
                    projectClients: [action.payload]
                }
            } else {
                returnState = {
                    ...participantsState,
                    projectClients: participantsState.projectClients.concat(action.payload)
                }
            }



        }

            break;
        case "REMOVE_MANAGER_INPUT_DATA": {

            if (participantsState.projectDevelopers.length === 1) {

                let projectManagers: ParticipantInputData[] = getInitState().projectManagers;
                returnState = ({
                    ...participantsState,
                    projectManagers: projectManagers
                });
            } else {

                returnState = ({

                    ...participantsState,
                    projectManagers: participantsState.projectManagers.filter((manager) => (manager.userId !== action.payload.userId)),

                });
            }



        }

            break;
        case "REMOVE_DEVELOPER_INPUT_DATA": {

            if (participantsState.projectDevelopers.length === 1) {

                let projectDevelopers: ParticipantInputData[] = getInitState().projectDevelopers;
                returnState = ({
                    ...participantsState,
                    projectDevelopers: projectDevelopers
                });
            } else {

                returnState = ({

                    ...participantsState,
                    projectDevelopers: participantsState.projectDevelopers.filter((developer) => (developer.userId !== action.payload.userId)),

                });
            }


        }

            break;
        case "REMOVE_CLIENT_INPUT_DATA": {

            if (participantsState.projectClients.length === 1) {
                let projectClients: ClientInputData[] = getInitState().projectClients;
                returnState = ({
                    ...participantsState,
                    projectClients: projectClients
                });
            } else {

                returnState = ({
                    ...participantsState,
                    projectClients: participantsState.projectClients.filter((client) => (client.userId !== action.payload.userId)),
                });
            }



        }

            break;




        default:
            return { ...participantsState };
            break;
    }
    console.log(returnState);
    return returnState;

}