import { type Key, type ReactNode, useContext, useState } from "react";
import { Form } from "./Form";
import { Input } from "./Input";
import type { FieldSetOptions } from "./Form";
import { themeContext } from "../context/ThemeContext";
import { Button } from "./Button";
import * as React from "react";
import { type ClientInputData, getInitState, type ParticipantInputData, ParticipantInputReducer } from "./reducers/ParticipantInputReducer";

import { firebaseClient, UserStore } from "../store/UserStore";
import { LoadingStore } from "./LoadingStore";
import { Project } from "../../project";
import { Manager, Developer, Client } from "../../User";
import { ClientElement } from "./ClientElement";
import { ParticipantElement } from "./ParticipantElement";
import { TimeConstraints } from "../../Timeconstraints";
import { Header } from "./Header";
import { InfoToggleButton } from "./InfoToggleButton";
export type CreateProjectTabProps = {

    createProjectState: {
        projectTitle: string;
        projectDescription: string;
        projectStartTime: string;
        projectEndTime: string;
        projectManagers: string;
        projectDevelopers: string;
        projectClients: string;

    }, setCreateProjectState: React.Dispatch<React.SetStateAction<{
        projectTitle: string;
        projectDescription: string;
        projectStartTime: string;
        projectEndTime: string;
        projectManagers: string;
        projectDevelopers: string;
        projectClients: string;
    }>>,
    createProject: (({ projectDescription, projectTitle, }: {
        projectTitle: string;
        projectDescription: string;
    }, { projectClients, projectDevelopers, projectManagers }: {
        projectDevelopers: ParticipantInputData[];
        projectManagers: ParticipantInputData[];
        projectClients: ClientInputData[];
    }, { projectEndTime, projectStartTime }: {
        projectStartTime: string;
        projectEndTime: string;
    }) => void)

}






/**
 * The contents of the create project tab
 * 
 */
export function CreateProjectTab(): ReactNode {



    const createProjectText = (<h1>{"Create Project"}</h1>);
    const fieldSetDateLegendText = (<p>{"Start-date -> End-date :"}</p>);
    const participantsLegendText = (<p>{"Add participants :"}</p>);
    const appThemeContext = useContext(themeContext);
    const fieldSetOptions: FieldSetOptions = { children: createProjectText, };
    const dateFieldSetOptions: FieldSetOptions = { children: fieldSetDateLegendText, textColor: appThemeContext.secondaryContentColor };
    const userStore = React.useSyncExternalStore(UserStore.subscribe, UserStore.getSnapshotUser);

    

    const [participantState, participantDispatch] = React.useReducer(ParticipantInputReducer,{
        projectManagers :[{ username: "", userType: [""], userId: -1 }],
projectDevelopers :[{ username: "", userType: [""], userId: -1 }],
               projectClients: [{ username: "", userId: -1 }]

    });

    const [createProjectState, setCreateProjectState] = React.useState(() => {


        return ({
            projectTitle: "",
            projectDescription: "",
            projectStartTime: "",
            projectEndTime: "",
        })
    });



    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        e.stopPropagation();

        const nameOfChangingAttribute = e.target.name;
        setCreateProjectState(() => {
            return {
                ...createProjectState,
                [nameOfChangingAttribute]: e.target.value

            }
        });




    };





    function handleClick(mouseEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        //Check so that all fields are filled
        mouseEvent.preventDefault();



        console.log(createProjectState);
        console.log(participantState);

        createProject({ projectTitle: createProjectState.projectTitle, projectDescription: createProjectState.projectDescription }, {projectClients : participantState.projectClients,
                                                                                                                                    projectDevelopers: participantState.projectDevelopers,
                                                                                                                                    projectManagers : participantState.projectManagers
        } , { projectStartTime: createProjectState.projectStartTime, projectEndTime: createProjectState.projectEndTime });
    }


    const [infoToggleState, setInfoToggleState] = useState(false);

  function onInfoToggleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        event.stopPropagation();

        setInfoToggleState((prev) => !prev);
    }


    return (
        <>
         <Header cssClassName="project-tab-content-header" title="Create Project" titleClassName="tab-title">
                                    <InfoToggleButton toggleState={{
                                        stateVariable: infoToggleState,
                                        setState: setInfoToggleState
                                    }}  ></InfoToggleButton>
                                </Header>
                                 {infoToggleState && (<>
                            <table>
                                <caption>
                                                                        <h3>Project</h3>

                                    Here you can view the current projects you are involved in.
                                    A project consists of Features, the features of a project encapsulates the functions of the project and can be, for example:
                                    <br></br>
                                    <ul>
                                        <li> UI - The user interface of an application.</li>
                                        <li> Database - Data persistence layer for a software project</li>
                                        <li> Administration - For example assigning budget or assigning developers to develop features.</li>
                                        <li>Marketing - The marketing aspect of a project.</li>
                                    </ul>





                                    Developers are responsible for developing and completing a given feature. To specify the development needs of a given feature a developer can add tasks
                                    to the feature´s task schedule : The task is assigned to one or more in the development team for that specific feature who then can indicate progress on that
                                    specific task by settings its status as 'Pending'/'Active'/'Completed' and updating the project entry by pressing 'Update project'. The task can then be removed
                                    to decrease clutter, this removes the entry from the schedule/project overview.
                                </caption>
                                <tr>
                                    <th></th>
                                    <th> Project: </th>
                                    <th>  Feature:  </th>
                                    <th> Task: </th>
                                </tr>
                                <tr>
                                    <th>Structure:</th>
                                    <td>  <ol>
                                        <li>Title (Title of the project)</li>
                                        <li>Description (Description of the project)</li>
                                        <li>Timeconstraints (Start-date and end date of the project)</li>
                                        <li>Features (As specified above)</li>
                                        <li>Development team (All developers involved in project)</li>
                                    </ol></td>
                                    <td><ol>
                                        <li>Title (Title of the feature)</li>
                                        <li>Type (The feature type - 'Front-end','Administration' or any arbitrary feature type)</li>
                                        <li>Description (Description of the feature)</li>
                                        <li>Timeconstraints (Start-date and end date of the feature)</li>
                                        <li>Development team (All project developers assigned to a specific feature)</li>
                                    </ol> </td>
                                    <td>  <ol>
                                        <li>Description (Description of the feature)</li>
                                        <li>Type (The task type - 'Login-screen  (For UI-feature)','Entity-implementation(For back-end feature)' or any arbitrary feature type)</li>
                                        <li>Timeconstraints (Start-date and end date of the task)</li>
                                        <li>Development team (All feature developers assigned to the specific task)</li>
                                    </ol>
                                    </td>
                                </tr>
                            </table>
                            <code>
                                Example :
                                        Make web store application
                                        <br></br>

                                        Title : GamerStore 
                                                                                <br></br>

                                        Description: A web site where users can order games from gamer store
                                                                                <br></br>


                                        Start-date: 3030-08-10 10:50
                                                                                <br></br>

                                        End-date: 3030-10-10 17:59
                                                                                <br></br>


                                        Development-team : Cole (Manager, Administrator, Treasurer)
                                                                                <br></br>

                                                           Livia (Developer, Front-end, React)
                                                                                                   <br></br>

                                                           Garminia (Developer, Back-end, cryptographer, RDB-dev)
                                                                                                   <br></br>

                                                           Guillermo (Client)
                                                                                                   <br></br>
                                        <br></br>



                                        Features :                                         <br></br>

                                                    Ui :                                                 <br></br>

                                                         Description: Make the UI of the store                                        <br></br>


                                                        Start-date: 3030-08-10 10:50                                        <br></br>

                                                        End-date: 3030-10-10 17:59                                            <br></br>
    
                                                        Assigned developers : Livia                                           <br></br>


                                                            Tasks(Ui):                                        <br></br>

                                                                    Description: Make login screen                                        <br></br>

                                                                    Task-type : React                                          <br></br>

                                                                      Start-date: 3030-08-10 10:50                                        <br></br>

                                                                      End-date: 3030-08-18 17:59                                           <br></br>

                                                                      Assigned developer(s): Livia
                                                                                                              <br></br>
                                        <br></br>

                                                        ...

                            </code>
                            
                        </>)}
        <Form onSubmit={()=>{}}cssClassName="create-project-form" fieldSetOptions={fieldSetOptions} style={{
            backgroundColor: appThemeContext.primaryContentColor,
            border: `solid thin ${appThemeContext.secondaryContrastColor}`
        }}>
            <Input onEvent={handleChange} inputState={createProjectState.projectTitle} inputType="text" labelName="Title :" name="projectTitle" cssClassName="project-title-input" />
            <Input onEvent={handleChange} inputState={createProjectState.projectDescription} inputType="text" labelName="Project description :" name="projectDescription" cssClassName="project-description-input" />
                        <hr></hr>
            <h2>Time :</h2>
            <Input onEvent={handleChange} inputState={createProjectState.projectStartTime} inputType="datetime-local" labelName="Start time :" name="projectStartTime" cssClassName="project-start-time-input" />
            <Input onEvent={handleChange} inputState={createProjectState.projectEndTime} inputType="datetime-local" labelName="End time :" name="projectEndTime" cssClassName="project-end-time-input" />
                        <hr></hr>
            <h2>Participants :</h2>

            <ParticipantElement participantType="Managers" onSubmitUser={(usernameInput, userTypeInput, userId) => participantDispatch({ type: "ADD_MANAGER_INPUT_DATA", payload: { username: usernameInput, userType: userTypeInput, userId: userId } })} onRemoveUserType={(usernameInput, userId, userTypeToRemove) => { participantDispatch({ type: "REMOVE_MANAGER_USER_TYPE", payload: { username: usernameInput, userType: userTypeToRemove, userId: userId  } }) }} onAddUserType={(usernameInput, userId ,userType) => { participantDispatch({ type: "ADD_MANAGER_USER_TYPE", payload: { username: usernameInput, userType: userType, userId: userId  } }) }} onRemoveUser={(username,userId) => { participantDispatch({ type: "REMOVE_MANAGER_INPUT_DATA", payload: { username: username, userId: userId  } }) }} participantInputList={participantState.projectManagers}></ParticipantElement>
            <br></br>
                        <hr></hr>

            <ParticipantElement participantType="Developers" onSubmitUser={(usernameInput, userTypeInput, userId) => participantDispatch({ type: "ADD_DEVELOPER_INPUT_DATA", payload: { username: usernameInput, userType: userTypeInput, userId: userId } })} onRemoveUserType={(usernameInput,userId,userTypeToRemove) => { participantDispatch({ type: "REMOVE_DEVELOPER_USER_TYPE", payload: { username: usernameInput, userType: userTypeToRemove, userId: userId } }) }} onAddUserType={(usernameInput, userId,userType ) => { participantDispatch({ type: "ADD_DEVELOPER_USER_TYPE", payload: { username: usernameInput, userType: userType, userId: userId } }) }} onRemoveUser={(username, userId) => { participantDispatch({ type: "REMOVE_DEVELOPER_INPUT_DATA", payload: { username: username, userId: userId } }) }} participantInputList={participantState.projectDevelopers}></ParticipantElement>
            <br></br>
                        <hr></hr>

            <ClientElement onSubmitClient={(username, userId) => { participantDispatch({ type: "ADD_CLIENT_INPUT_DATA", payload: { username: username, userId: userId } }) }} onRemoveClient={(username, userId) => { participantDispatch({ type: "REMOVE_CLIENT_INPUT_DATA", payload: { username: username, userId: userId } }); }} clientInputList={participantState.projectClients}></ClientElement>
            <br></br>
            <hr></hr>
            <Button isDisabled={false} cssClassName="create-project-submit-button" children={createProjectText} onClick={handleClick}></Button>

        </Form>
    </>

    );

    function createProject({ projectDescription, projectTitle, }: {
        projectTitle: string;
        projectDescription: string;
    }, { projectClients, projectDevelopers, projectManagers }: {
        projectDevelopers: ParticipantInputData[];
        projectManagers: ParticipantInputData[];
        projectClients: ClientInputData[];
    }, { projectEndTime, projectStartTime }: {
        projectStartTime: string;
        projectEndTime: string;
    }): void {

        LoadingStore.updateLoading();
        //Maps project devs, managers and clients in accordance with the format specified in the create project-form
        //The following should be known : Project always has at least 1 manager, all users added (inputData !== {"", ""|undefined, -1}) are verified users with userids
        //Everything else must be checked -> startDate < endDate, endDate >=today, startDate, currentUser included in developers || managers (clientUsers can only be invited)
        //projectTitle !== "" && projectDescription !== ""
        //  handleProjectCreationAsync(projectClients, projectStartTime, projectEndTime, projectTitle, projectDescription, projectManagers, projectDevelopers);
        //        const startDate = TimeConstraints.getLocalTimeParameters( new Date(projectStartTime));
        //        const endDate = TimeConstraints.getLocalTimeParameters( new Date(projectEndTime));
        //        const todaysDate = TimeConstraints.getLocalTimeParameters(new Date(Date.now())) ;
        const currentUser = userStore;
        const currentUserAsInput = { username: currentUser?.username.username, userId: currentUser?.authParameters.userId }
        const allVariablesExist = (projectTitle.trim() !== "") && (projectDescription.trim() !== "") && (projectStartTime.trim() !== "") && (projectEndTime.trim() !== "") && (projectManagers.length >= 1) && (projectManagers[0].userId !== -1)
            && ((projectManagers.filter((manager) => (manager.username === currentUserAsInput.username && manager.userId === currentUserAsInput.userId))[0] !== undefined) ||
                (projectDevelopers.filter(dev => (dev.username === currentUserAsInput.username && dev.userId === currentUserAsInput.userId))[0] !== undefined) && (projectDevelopers.length >= 1)) && (projectDevelopers[0].userId !== -1);
        if (allVariablesExist) {
            const startDate = new Date(Date.parse(projectStartTime));
            const endDate = new Date(Date.parse(projectEndTime));
            const todaysDate = new Date(Date.now());


            const datesAreValid = ((endDate.valueOf() >= startDate.valueOf()) && (endDate.valueOf() >= todaysDate.valueOf()));

            if (datesAreValid) {
                //All variables are valid -> We can now start construction of the project parameters
                const timeConstraints = new TimeConstraints(startDate, endDate);

                const managers = projectManagers.map((manager) => {

                    return new Manager(manager.userId, manager.username, manager.userType);
                });
                const developersExist = (projectDevelopers.filter((dev) => dev.userId !== -1)[0] !== undefined)
                const developers = developersExist ? projectDevelopers.map((developer) => {

                    return new Developer(developer.userId, developer.username, developer.userType);
                })
                    : null;

                const clientsExist = (projectClients.filter((client) => (client.userId === -1 && client.username === ""))[0] === undefined);

                const clients = (clientsExist) ? (projectClients.map((client) => new Client(client.username, client.userId))) : null;
                let userIds = (clientsExist) ? projectManagers.concat(projectDevelopers).filter((vals) => vals.userId !== -1).map((validInput) => validInput.userId).concat(clients!.map((client) => client.userId))
                    : projectManagers.concat(projectDevelopers).filter((vals) => vals.userId !== -1).map((validInput) => validInput.userId);


                const project = new Project(projectTitle, managers, clients, null, developers, projectDescription, timeConstraints);
                //filter for duplicates
                userIds = userIds.filter((id, index) => {

                    let noMatch: boolean = true;

                    for (let i = index + 1; i < userIds.length && noMatch; i++) {
                        noMatch = id !== userIds[i];
                    }

                    return noMatch;

                });

                firebaseClient.createProject(project, userIds).then(() => {

                    LoadingStore.updateLoading();
                    alert("Project created!");
                    console.log(project);
                }).catch((error: Error) => alert(error));


            }
        }

        else {
            LoadingStore.updateLoading();
            alert("To create project the input must hold : Title, description, a start and end-time at least 1 project manager, at least 1 project developer (Can be the same user) and the creating user must be included as a developer, manager or both. \n \t Please, try again!")
        }
    }
}


