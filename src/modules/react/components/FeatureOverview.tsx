import { Fragment, type ReactNode, useContext } from "react";
import { themeContext } from "../context/ThemeContext";
import { Background } from "./background";
import { FeatureTableRows } from "./FeatureTableRows";
import { type FeatureOverviewProps, getKeysForList } from "./ProjectsTab";
import { Developer } from "../../User";
import { Feature } from "../../feature";
import { FeatureOveriewDeveloperAssigmentForm } from "./FeatureOverviewDevelopmentAssignmentForm";
import { TaskDeveloperAssignmentForm } from "./TaskDeveloperAssigmentForm";
import { Details } from "./Details";


export function FeatureOverview({ dispatchAction, features, projectDevs }: FeatureOverviewProps): ReactNode {
    //Feature guaranteed, otherwise FeatureOveriew not rendered
    // let devDataArray = new Array<DeveloperAssignmentData>(features!.length);
    // const [featureDeveloperAssignmentState, setFeatureDeveloperAssignmentState] = useState({
    //     //Make array of featureDeveloperAssignment-states for all features in start to hinder 'rendered more hooks error'
    //     devDataArray : new Array<DeveloperAssignmentData>(features!.length)
    // });


    // function assignDevsToFeature(devOptions: Developer[], indicesOfSelectedDevs: number[], featureIndex: number) {
    //     //Can only be called on an instantiated feature array
    //     //     action.type : ASSIGN_DEVELOPERS {
    //     //      action.payload.title : string,
    //     //      action.payload.type : string,
    //     //      action.payload.description : string,
    //     //      action.payload.developersToAssign : Developer[] | null,
    //     //      action.payload.featureIndex : number | null
    //     //              
    //     //      }

    //     const devsToAssign = devOptions.filter((val: Developer, index: number) => {
    //         let isInSelectedIndices: boolean = false;

    //         indicesOfSelectedDevs.forEach((selectedIndex) => {
    //             isInSelectedIndices = (index == selectedIndex);
    //         });
    //         return isInSelectedIndices;

    //     });
    //     const action = {
    //         type: "ASSIGN_DEVELOPERS",
    //         payload: {
    //             developersToAssign: devsToAssign,
    //             featureIndex: featureIndex
    //         }
    //     }

    //     dispatchAction(action);
    // }


    if (features === null) {

        return <></>;
    }
    else {



        const keysForFeatures = getKeysForList(features);
        let assignedDevList: ReactNode = (<></>);
        const appThemeContext = useContext(themeContext);
        let tableRows = (<></>);
        let content: ReactNode = features.map((feature, index) => {
            // let devsNotInFeature = getDevsNotInFeature(projectDevs, feature);
            // let devData: DeveloperAssignmentData = { developerOptions: devsNotInFeature, indicesSelected: [0] };


            // if (feature.assignedDevelopers != null && typeof feature.assignedDevelopers !== "undefined" && typeof projectDevs !== "undefined" && projectDevs !== null) {

            //     let featureDevsUserIds = feature.assignedDevelopers?.map((dev: Developer) => { return dev.userId })!;
            //     let devsNotInFeature: Developer[] = getDevsNotInFeature(projectDevs!, feature);

            // } else {
            //     let devData: DeveloperAssignmentData = { developerOptions: projectDevs, indicesSelected: [0] };

            // }
            let devTaskDevForms: ReactNode = (<></>);
            if (feature.developmentTasks) {
                const devTasks = feature.developmentTasks;
                const devTaskKeys = getKeysForList(devTasks);

                devTaskDevForms = devTasks.map((task, devTaskIndex) => {
                    let keysForList = null;
                    if (task.assignedDevelopers) {
                        keysForList = getKeysForList(task.assignedDevelopers);
                    }
                    return (<Fragment key={devTaskKeys[devTaskIndex]}>

                        <Details cssClassName="" summaryContent={task.description}>
                            {(task.assignedDevelopers) ? (<Background cssClassName="assigned_devs">
                                <strong>Assigned task developers : </strong>
                                <ul> {
                                    task.assignedDevelopers.map((dev, index) => {
                                        return (<li key={keysForList[index]}>{dev.username}</li>)
                                    })}
                                </ul>

                            </Background>) : (<></>)}
                            <TaskDeveloperAssignmentForm devTaskIndex={devTaskIndex} developmentTask={task} dispatchAction={dispatchAction}
                                featureDevelopers={feature.assignedDevelopers!} featureIndex={index}>
                            </TaskDeveloperAssignmentForm>
                        </Details>

                    </Fragment>
                    )
                });
            }
            if (feature.assignedDevelopers) {

                let assignedFeatureDevelopers = feature.assignedDevelopers;
                if (assignedFeatureDevelopers !== null) {
                    const keys = getKeysForList(assignedFeatureDevelopers);
                    assignedDevList = assignedFeatureDevelopers?.map((dev, index) => {
                        const devTypeElement = (dev.developerType[0] !== "") ? `(${dev.developerType})` : "";
                        return (
                            <li key={keys[index]}>{dev.username} {devTypeElement}</li>
                        );
                    });
                }
            }
            if (feature.developmentTasks) {

                let assignedFeatureDevelopers = feature.assignedDevelopers;
                if (assignedFeatureDevelopers !== null) {
                    const keys = getKeysForList(assignedFeatureDevelopers);
                    assignedDevList = assignedFeatureDevelopers?.map((dev, index) => {
                        const devTypeElement = (dev.developerType[0] !== "") ? `(${dev.developerType})` : "";
                        return (
                            <li key={keys[index]}>{dev.username} {devTypeElement}</li>
                        );
                    });
                }

                // {(featureDeveloperAssignmentState.developerOptions !== null && typeof featureDeveloperAssignmentState.developerOptions !== "undefined") && (<DeverloperAssignmentForm developerAssignmentState={{ stateVariable: featureDeveloperAssignmentState, setState: setFeatureDeveloperAssignmentState! }}>

                //                     </DeverloperAssignmentForm>)}
            }



            return (

                <Details style={{ border: `medium solid ${appThemeContext.tertiaryContentColor} ` }} key={keysForFeatures[index]} cssClassName="" summaryContent={`Feature ${index + 1}: ${feature.title}`}>
                    <Background cssClassName="feature-overview">
                        <h3> {`${feature.title} ${feature.type ? `(${feature.type})` : ""}`} </h3>
                        <textarea defaultValue={feature.description} />

                        <FeatureOveriewDeveloperAssigmentForm dispatchAction={dispatchAction} feature={feature} featureIndex={index} projectDevs={projectDevs}>

                        </FeatureOveriewDeveloperAssigmentForm>
                        <Details cssClassName="" summaryContent={"Task-schedule : "}>
                            <table>

                                <thead>
                                    <tr>
                                        <th scope="col">{"Pending tasks :"}</th>
                                        <th scope="col">{"Active tasks :"}</th>
                                        <th scope="col">{"Completed tasks :"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <FeatureTableRows feature={feature} featureIndex={index} handleStatusChange={dispatchAction}></FeatureTableRows>
                                </tbody>
                            </table>
                        </Details>

                        {(feature.assignedDevelopers) ? (<Details summaryContent={`Developer-Team : ${feature.title} `} cssClassName="" >
                            <ul>
                                {assignedDevList}
                            </ul>


                        </Details>) : (<></>)}


                        {(feature.developmentTasks) ? (
                            <Details summaryContent={"Assign tasks to developers"} cssClassName="" >
                                {devTaskDevForms}
                            </Details>) : (<></>)}
                    </Background>
                </Details>

            );
        }

        );

        return (<Background cssClassName="feature-overview">
            <Details style={{ border: `medium solid ${appThemeContext.tertiaryContentColor} ` }} summaryContent={"Feature overview:"}>
                {content}
            </Details>
        </Background>)
    }



    function getDevsNotInFeature(projectDevs: Developer[], feature: Feature) {


        //Check if there are any devs assigned to feature
        const devsInFeature: boolean = (feature.assignedDevelopers != null);
        if (devsInFeature) {

            //Get all projectDevs not already in feature
            const featureDevsIds = feature.assignedDevelopers!.map((dev: Developer) => {
                return dev.userId;
            });
            let featureDevOptions = projectDevs.filter((projectDev: Developer) => {
                let isNotAlreadyInFeature = true;
                for (let i = 0; i < featureDevsIds.length; i++) {

                    if (featureDevsIds[i] == projectDev.userId) {
                        isNotAlreadyInFeature = false;
                        return isNotAlreadyInFeature;
                    }

                }

                return isNotAlreadyInFeature;
            });

            return featureDevOptions;

        }
        else {
            //No devs in feature, all can be assigned to it
            return projectDevs;
        }


    }
}
