import { type ReactNode, useState } from "react";
import { Task } from "../../Task";
import { Developer } from "../../User";
import { getKeysForList } from "./ProjectsTab";
import { DeverloperAssignmentForm } from "./AddTaskElement";
import { Button } from "./Button";

type TaskDeveloperAssignmentFormProps = {
    developmentTask: Task,
    featureDevelopers: Developer[],
    dispatchAction: (action: any) => void,
    featureIndex: number,
    devTaskIndex: number,
    taskGoalIndex?: number | null

}

export function TaskDeveloperAssignmentForm({ featureIndex, developmentTask, devTaskIndex, taskGoalIndex = null, dispatchAction, featureDevelopers }: TaskDeveloperAssignmentFormProps) {
    const [selectedIndicesState, setSelectedIndicesState] = useState({ indicesSelected: [0] });


    //    * action.type : ASSIGN_DEVELOPERS_TO_DEVELOPMENT_TASK
    // *      action.payload : {
    // *                  featureIndex : number,
    // *                  devTaskIndex : number,
    // *                  developersToAssign : Developer[],
    // *                  // Specifies a specific goal-task inside the devtask
    // *                  taskGoalIndex : number | null
    // *                                   
    // * }
    function handleAssignDevs(devsToAssign: Developer[]) {

        //Make action
        const action = {
            type: "ASSIGN_DEVELOPERS_TO_DEVELOPMENT_TASK",
            payload: {
                featureIndex: featureIndex,
                devTaskIndex: devTaskIndex,
                developersToAssign: devsToAssign,
                taskGoalIndex: taskGoalIndex
            }
        };

        dispatchAction(action);
    }

    //get dev options for task

    const devOptions = getFeatureDevsNotInDevTask(developmentTask);




    function getFeatureDevsNotInDevTask(devTask: Task) {

        if (devTask.assignedDevelopers) {
            const devTaskDevIds = devTask.assignedDevelopers.map((developer: Developer) => developer.userId);
            const featureDevsNotInTask = featureDevelopers.filter((featureDev: Developer) => {
                for (let i = 0; i < devTaskDevIds.length; i++) {
                    if (devTaskDevIds[i] == featureDev.userId) {
                        return false;
                    }

                }
                return true;
            });



            return (featureDevsNotInTask.length > 0) ? featureDevsNotInTask : [null];
        } else {
            return featureDevelopers;
        }

    }


    function getSelectedDevs(indicesSelected: number[], devOptions: Developer[]) {

        return devOptions.filter((_dev, index) => {

            for (let i = 0; i < indicesSelected.length; i++) {
                if (indicesSelected[i] == index) {
                    return true;
                }
            }

            return false;
        })
    }
    return ((devOptions != null) ? (<DeverloperAssignmentForm devLegendText="Assign task to feature-developers :" developerAssignmentState={{ developerOptions: devOptions, indicesSelected: { setState: setSelectedIndicesState, stateVariable: selectedIndicesState.indicesSelected } }}>
        <Button onClick={
            (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (devOptions[0] != null && typeof devOptions !== "undefined") {

                    const selectedDevs = getSelectedDevs(selectedIndicesState.indicesSelected, devOptions)
                    handleAssignDevs(selectedDevs);
                }

            }} isDisabled={false} cssClassName="assign-developers-to-feature-button" >
            <strong><p>Add</p></strong>
        </Button>
    </DeverloperAssignmentForm>) : (<p>Please assign developers to feature</p>));


}