import { type ReactNode, useState } from "react";
import { Developer } from "../../User";
import { type DeveloperAssignmentData, DeverloperAssignmentForm } from "./AddTaskElement";
import { Feature } from "../../feature";
import { Button } from "./Button";

export type FeatureOveriewDeveloperAssigmentFormProp = {
    feature: Feature,
    projectDevs: Developer[],
    featureIndex: number,
    dispatchAction: (action: any) => void,
    children?: ReactNode,



}

export function FeatureOveriewDeveloperAssigmentForm({ projectDevs, dispatchAction, feature, featureIndex, children }: FeatureOveriewDeveloperAssigmentFormProp) {


    const devOptions = getDevsNotInFeature(projectDevs, feature);
    const [selectedIndicesState, setSelectedIndicesState] = useState({ indicesSelected: [0] });
    const devAssignmentData: DeveloperAssignmentData = {
        developerOptions: devOptions,
        indicesSelected: {
            stateVariable: selectedIndicesState.indicesSelected,
            setState: setSelectedIndicesState
        }

    }

    function assignDevsToFeature(devOptions: Developer[], indicesOfSelectedDevs: number[], featureIndex: number) {
        //Can only be called on an instantiated feature array
        //     action.type : ASSIGN_DEVELOPERS {
        //      action.payload.title : string,
        //      action.payload.type : string,
        //      action.payload.description : string,
        //      action.payload.developersToAssign : Developer[] | null,
        //      action.payload.featureIndex : number | null
        //              
        //      }

        const devsToAssign = devOptions.filter((val: Developer, index: number) => {
            let isInSelectedIndices: boolean = false;

            indicesOfSelectedDevs.forEach((selectedIndex) => {
                isInSelectedIndices = (index == selectedIndex);
            });
            return isInSelectedIndices;

        });
        const action = {
            type: "ASSIGN_DEVELOPERS",
            payload: {
                developersToAssign: devsToAssign,
                featureIndex: featureIndex
            }
        }

        dispatchAction(action);
    }


    return ((devOptions[0] != null) ? (<DeverloperAssignmentForm devLegendText={`Assign project developers to ${feature.title} :`} developerAssignmentState={devAssignmentData} >
        <Button onClick={
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (devOptions[0] != null && typeof devOptions !== "undefined") {
                    assignDevsToFeature(devOptions, devAssignmentData.indicesSelected.stateVariable!, featureIndex);
                }

            }} isDisabled={false} cssClassName="assign-developers-to-feature-button" >
            <strong><p>Add</p></strong>
        </Button>
    </DeverloperAssignmentForm>) : (<></>));

    // function setDevData(devData : DeveloperAssignmentData){

    //     setDevDataArrayState((prev)=>{
    //         { 
    //         prev.devDataArray = [
    //             ...prev.devDataArray,
    //             prev.devDataArray[devDataArrayIndex] = devData
    //         ]
    //     }});
    // }

    function getDevsNotInFeature(projectDevs: Developer[], feature: Feature) {


        //Check if there are any devs assigned to feature
        const devsInFeature: boolean = (feature.assignedDevelopers);
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

            return (featureDevOptions.length > 0) ? featureDevOptions : [null];

        }
        else {
            //No devs in feature, all can be assigned to it
            return projectDevs;
        }


    }
}