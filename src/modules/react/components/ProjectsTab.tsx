import { useContext, useEffect, useSyncExternalStore, type Key, useReducer, Fragment, useState } from "react";
import { Developer } from "../../User";
import { MailboxStore, ProjectStore } from "../store/UserStore";
import { Project } from "../../project";
import { useLoadingStore } from "./LoadingStore";
import { Background } from "./background";
import { themeContext } from "../context/ThemeContext";
import { ProgressBar } from "./ProgressBar";
import { Button } from "./Button";
import { FeatureReducer } from "./reducers/FeatureReducer";
import { Feature } from "../../feature";
import { Task } from "../../Task";
import { AddFeaturesElement } from "./AddFeaturesElement";
import { AddTaskElement } from "./AddTaskElement";
import { ProjectSchedule } from "./ProjectSchedule";
import { FeatureOverview } from "./FeatureOverview";
import { Details } from "./Details";
import { TimeConstraints } from "../../Timeconstraints";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ToggleButton } from "./ToggleButton";
import { InfoToggleButton } from "./InfoToggleButton";





export type ProjectsTabProp = {

    projectList: string[],

}

export function ProjectsTab() {
    let keysNeededForProjectsList: Key[];
    const projectStore = useSyncExternalStore(ProjectStore.subscribe, ProjectStore.getSnapshotProjects);
    const mailBoxStore = useSyncExternalStore(MailboxStore.subscribe, MailboxStore.getSnapshotMailbox);
    let loadingStore = useLoadingStore();

    const [infoToggleState, setInfoToggleState] = useState(false);
    //const appThemeContext = useContext(themeContext);
    useEffect(() => {
        ProjectStore.getProjects();
    }, [, mailBoxStore]);

    //  useEffect(() => ProjectStore.getProjects, []);
    let activeProjects: Project[] | null = projectStore;

    // const [state, dispatcher] = useReducer(FeatureReducer, null);

    function onInfoToggleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        event.preventDefault();
        event.stopPropagation();

        setInfoToggleState((prev) => !prev);
    }



    if (activeProjects !== null) {

        keysNeededForProjectsList = getKeysForList(activeProjects);



    }






    return (<>
        {loadingStore ? (<>
            <img className="loading-indicator" src='https://icons8.com/preloaders/preloaders/1480/Fidget-spinner-128.gif'>

            </img>
        </>) : (<>


        </>)}

        {
            activeProjects !== null && (

                <>
                        <Header cssClassName="project-tab-content-header" title="Projects" titleClassName="tab-title">
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
                            <br></br>
                            <br></br>
                            
                            <table>
                                <caption>
                                    <h3>Legend</h3>
                                    A legend to guide any new users
                                </caption>
                                <tr>
                                    <th>Project schedule</th>
                                    <th>Add-feature</th>
                                    <th>Feature-overview</th>
                                    <th>Add task</th>
                                </tr>
                                <tr>
                                    <td>
                                        <ol>
                                            <li>The current project schedule, each row represents a feature and holds the tasks needed to complete that feature</li>
                                            <li>Assigned project developers:
                                                <ul>
                                                    <li>
                                                        The developers currently assigned to the project
                                                    </li>
                                                </ul>
                                            </li>
                                        </ol>
                                    </td>

                                    <td>Here you can add new features, specifying the data as shown in the previous table section.</td>
                                    <td>Here you can see and manage all features. You can assign project devs to the feature, see the task-schedule of the specific feature and manage tasks.

                                        <ol>
                                            <li>
                                                Task-schedule:
                                                <ul>
                                                    <li>
                                                        See all tasks in a specific feature.
                                                    </li>
                                                    <li>
                                                        Assign feature-developers to those tasks using the assignment-forms on the schedule
                                                    </li>
                                                    <li>
                                                        Set task-status of tasks in that feature
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                Development team
                                                <ul>
                                                    <li>
                                                        See the developers assigned to the feature
                                                    </li>
                                                </ul>
                                            </li>
                                        </ol>
                                    </td>
                                    <td>Here you can add tasks to the feature of your choice using the task-creation form and the feature-list presented above the task creation form</td>
                                </tr>
                            </table>
                        </>)}


                        {activeProjects.map((project, index) => {


                            return (<Fragment key={keysNeededForProjectsList[index]}>
                                <ProjectView project={project} ></ProjectView></Fragment>)
                        })}

                </>
            )

        }
    </>)

}
export type AddFeaturesElementProps = {
    /**
     * The dev team assigned to the specific project or null if none are.
     * 
     * Will be used to give suggestions for appropriate developers, that is, devs that belong to the project already in 
     * second hand and that has the type of the thought feature, if such a type has been set, in first hand
     */
    projectDevTeam: Developer[] | null,
    /**
     * The time constraints of the project, we do not accept features that go outside of these bounds
     */
    projectTimeConstraints: TimeConstraints,

    onSubmitFeature: (title: string, description: string, type: string, timeconstraints: TimeConstraints, developersAssigned: Developer[] | null) => void





}

export type FeatureOverviewProps = {

    features: Feature[] | null,

    dispatchAction: ((action: any) => void),

    projectDevs: Developer[] | null


}

type ProjectViewProps = {


    project: Project
}

function ProjectView({ project }: ProjectViewProps) {
    const appThemeContext = useContext(themeContext);
    const [state, dispatcher] = useReducer(FeatureReducer, project.features);


    function handleSubmitFeature(title: string, description: string, type: string, timeconstraints: TimeConstraints, developersAssigned: Developer[] | null) {


        //Can always be called, instantiates a Feature[] if none exists
        // action.type : ADD_FEATURE {
        //      action.payload.title : string,
        //      action.payload.type : string,
        //      action.payload.description : string,
        //      //timeconstraints must be given for a feature
        //      action.payload.timeconstraints : TimeConstraints,
        //      //if developmentTasks are left as null, the first dev-task becomes "Plan project" with all assigned devs assigned to it
        //      action.payload.developmentTasks : Task[]|null,
        //      action.payload.assignedDevelopers : Developer[] | null,


        //  }

         let devTask = new Task(type, `Complete implementantation of  ${title}`, timeconstraints, developersAssigned, null, "Pending");

        const action = { type: "ADD_FEATURE", payload: { title: title, description: description, type: type, timeconstraints: timeconstraints, developmentTasks: [devTask], assignedDevelopers: developersAssigned } }
        dispatcher(action);

    }

    function handleUpdateProject(newFeatures: Feature[] | null) {
        if (newFeatures !== null) {
            for (let i = 0; i < newFeatures?.length; i++) {
                let featureToAdd = new Feature(newFeatures[i].title, newFeatures[i].type, newFeatures[i].description, newFeatures[i].timeconstraints, newFeatures[i].developmentTasks!, newFeatures[i].assignedDevelopers);
                project.addFeature(featureToAdd);
            }
        }
        ProjectStore.updateProject(project);
    }






    function getTimeFraction(timeConstraints: TimeConstraints) {

        const startDate = Date.parse(timeConstraints.startdate);
        const endDate = Date.parse(timeConstraints.enddate);
        timeConstraints.getTimePassedFraction

        const currentDate = Date.now();

        const totalTime = endDate.valueOf() - startDate.valueOf();

        const timePassed = currentDate - startDate.valueOf();

        return timePassed / totalTime * 100;


    }

    return <Background cssClassName="project-details-container" backgroundColor={appThemeContext.tertiaryContentColor}>

        <ProgressBar barColor={appThemeContext.tertiaryContrastColor} progress={(getTimeFraction(project.timeconstraints))} />

        <Details cssClassName="project-details-element" summaryContent={<b>{`${project.title} : ${TimeConstraints.getAsFormattedString(new Date(Date.parse(project.timeconstraints.startdate)))} -> ${TimeConstraints.getAsFormattedString(new Date(Date.parse(project.timeconstraints.enddate)))}`} </b>} >

            <h4>Description : </h4>
            <textarea defaultValue={`${project.description}`} disabled={false}>

            </textarea>
            <hr></hr>



            <ProjectSchedule projectDevs={project.developerTeam} features={state}></ProjectSchedule>
            <hr></hr>





            <AddFeaturesElement onSubmitFeature={handleSubmitFeature} projectDevTeam={project.developerTeam} projectTimeConstraints={project.timeconstraints}>

            </AddFeaturesElement>
            <hr></hr>




            {state !== null && <FeatureOverview projectDevs={project.developerTeam} dispatchAction={dispatcher} features={state} />}

            <AddTaskElement handleAddTask={(type, description, timeconstraints, assignDevelopers, selectedFeatureIndex) => {
                //Make action object with complete payload and type === "ADD_DEVELOPMENT_TASK"
                const newTask = new Task(type, description, timeconstraints, assignDevelopers, null, "Pending");
                const action = {
                    type: "ADD_DEVELOPMENT_TASKS",
                    payload: {
                        featureIndex: selectedFeatureIndex,
                        timeconstraints: timeconstraints,
                        devTask: newTask
                    }
                };

                dispatcher(action);



            }} features={state}></AddTaskElement>
            <hr></hr>



        </Details>


        <Button cssClassName="update-project-button" isDisabled={false} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleUpdateProject(state);
        }} > {"Update project (Will save changes)"}</Button>

    </Background>;

}

/**
 * Takes in a list and gives back a React key-array matching the length of that list
 * 
 * @param list - list of elements needing keys
 * @returns Generated keys for all list members
 */
export function getKeysForList(list: Array<Object>) {
    const numberOfMembersInlist = list.length;

    let keysNeededForList: Key[] = new Array<Key>(numberOfMembersInlist);

    for (let i = 0; i < numberOfMembersInlist; i++) {

        keysNeededForList[i] = window.crypto.randomUUID();
    }
    return keysNeededForList;
}

export type AddTaskElementProps = {

    features: Feature[] | null,

    handleAddTask: (type: string, description: string, timeconstraints: TimeConstraints, assignedDevelopers: Developer[] | null, selectedFeatureIndex: number) => void,


}


