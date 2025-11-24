import { useState, type ReactNode, type ChangeEvent, type FormEvent } from "react";
import { TimeConstraints } from "../../Timeconstraints";
import { Button } from "./Button";
import { type FieldSetOptions, Form } from "./Form";
import { Input } from "./Input";
import { type AddTaskElementProps, getKeysForList } from "./ProjectsTab";
import type { State } from "./App";
import { Developer } from "../../User";
import { Details } from "./Details";

export function AddTaskElement({ handleAddTask, features }: AddTaskElementProps) {
    //type: string, description: string, timeconstraints: TimeConstraints, assignedDevelopers: Developer[] | null, taskGoals: Task[] | null, currentTaskStatus: string | null): Task
    if (features !== null) {
        const [addTaskState, setAddTaskState] = useState({
            taskDescriptionInput: "",
            taskTypeInput: "",
            taskStartTime: "",
            taskEndTime: "",
            indicesSelected: [0],
            selectedFeatureIndex: 0

        });

        const timeConstraintLegendText: ReactNode = (<><b><p>{"Set time-constraints : "}</p></b></>);
        const timeConstraintsFieldSetOptions: FieldSetOptions = {
            children: timeConstraintLegendText
        };
        const devAssignLegendText: ReactNode = (<><b><p>{"Assign Developers to task: "}</p></b></>);
        // const devAssignFieldSetOptions: FieldSetOptions = {
        //     children: devAssignLegendText
        // };

        let featureKeys = getKeysForList(features);

        let featureOptions : ReactNode = features.map((feature, index) => {

            return <option value={index} key={featureKeys[index]}> {`${feature.title}`}</option>;
        });

        let selectedFeature = (addTaskState.selectedFeatureIndex !== -1) ? features[addTaskState.selectedFeatureIndex] : null;
        // let devOptions: ReactNode = (<></>);
        // if (selectedFeature !== null && selectedFeature.assignedDevelopers !== null) {
        //     const keys = getKeysForList(selectedFeature.assignedDevelopers);
        //     devOptions = selectedFeature.assignedDevelopers.map((developer, index) => {
        //         const devTypeElement = (developer.developerType[0].trim() !== "") ? `(${developer.developerType})` : "";
        //         return (<option key={keys[index]} value={index}>{`${developer.username} ${devTypeElement}`}</option>);

        //     });

        //}

        function handleSelectFeature(e: ChangeEvent<HTMLSelectElement>) {

            e.stopPropagation();

            setAddTaskState((prevState) => {

                return ({
                    ...prevState,
                    selectedFeatureIndex: e.target.value
                });
            });


        }


        function resetInput(){
            setAddTaskState((prev)=>{
                    return {
            taskDescriptionInput: "",
            taskTypeInput: "",
            taskStartTime: "",
            taskEndTime: "",
            indicesSelected: [0],
            selectedFeatureIndex: 0

        }
            })
        }
        function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

            e.preventDefault();
            e.stopPropagation();

            //Since button is not disabled <=> All variables exist
            const startDate = new Date(addTaskState.taskStartTime);
            const endDate = new Date(addTaskState.taskEndTime);
            const todaysDate = new Date(Date.now());

            const datesAreValid = ((endDate.getTime() >= startDate.getTime()) && (endDate.getTime() >= todaysDate.getTime()));

            if (datesAreValid) {
                // We can get the indices of the developers assigned to the task in the state object and
                //  <features.assignedDevelopers>-property and match these values to get the wanted devs for the task
                //get selected feature 
                const selectedFeatureIndex = addTaskState.selectedFeatureIndex;
                const taskDevs = addTaskState.indicesSelected.map((devIndex) => features![selectedFeatureIndex].assignedDevelopers![devIndex]);

                const timeconstraints = new TimeConstraints(startDate, endDate);

                handleAddTask(addTaskState.taskTypeInput, addTaskState.taskDescriptionInput, timeconstraints, taskDevs, selectedFeatureIndex);
                //Reset input on added dev-task
                resetInput();

            }
            else {

                alert("All dates were not valid, please observe that your planned task can´t start before today, your end time for the task can not be a past date and your start date must come before your end date");
            }


        }

        function handleChange(e: ChangeEvent<HTMLInputElement>): void {
            e.stopPropagation();

            setAddTaskState((prevState) => {


                return ({
                    ...prevState,
                    [e.target.name]: e.target.value
                });

            });

        }

        function handleInput(e: FormEvent<HTMLInputElement>): void {

            setAddTaskState((prevState) => {


                return ({
                    ...prevState,
                    [e.target.name]: e.target.value
                });

            });

            e.stopPropagation();
        }
        let allVariablesExist = (addTaskState.taskTypeInput.trim() !== "") && (addTaskState.taskDescriptionInput.trim() !== "") && (addTaskState.taskStartTime !== "") && (addTaskState.taskEndTime !== "");

        //        {{ setState: setAddTaskState, stateVariable: { indicesSelected: addTaskState.indicesSelected, developerOptions: (selectedFeature?.assignDevelopers != null && typeof selectedFeature.assignedDevelopers !== "undefined") ? selectedFeature.assignedDevelopers : null } }}
        return (<>
            <Details cssClassName="" summaryContent={"Add task :"}>

                <select value={addTaskState.selectedFeatureIndex} onChange={handleSelectFeature}>
                    {featureOptions}
                </select>


                <Form cssClassName="add-task-form">




                    <Input inputType="text" cssClassName="task-description-input" labelName="Description :" name="taskDescriptionInput" onEvent={handleChange}  inputState={addTaskState.taskDescriptionInput}>
                    </Input>
                    <Input inputType="text" cssClassName="task-type-input" labelName="Task-type :" name="taskTypeInput" onEvent={handleChange}  inputState={addTaskState.taskTypeInput}>
                    </Input>


                </Form>
                <Form cssClassName="time-constraints-add-form" fieldSetOptions={timeConstraintsFieldSetOptions}>
                    <Input onEvent={handleChange} onInput={handleInput} inputState={addTaskState.taskStartTime} inputType="datetime-local" labelName="Start time :" name="taskStartTime" cssClassName="task-start-time-input" />
                    <Input onEvent={handleChange} onInput={handleInput} inputState={addTaskState.taskEndTime} inputType="datetime-local" labelName="End time :" name="taskEndTime" cssClassName="task-end-time-input" />

                </Form>
                {(selectedFeature?.assignedDevelopers != null && typeof selectedFeature.assignedDevelopers !== "undefined") ? (
                    <DeverloperAssignmentForm devLegendText="Assign developers to new task :" developerAssignmentState={{ developerOptions: selectedFeature?.assignedDevelopers, indicesSelected: { stateVariable: addTaskState.indicesSelected, setState: setAddTaskState } }} >
                        <Button cssClassName="add-task-button" isDisabled={!allVariablesExist} onClick={handleClick}>{"Add task"}</Button>
                    </DeverloperAssignmentForm>
                ) : (<><p>Please assign developers to feature via the feature overview tab</p></>)}

            </Details>
           
        </>);
    }
    else {
        return (<></>);
    }
}

export type DeveloperAssignmentData = {
    /**
     * Indicates the indices of the currently selected developers from the 
     * {@linkplain DeveloperAssignmentData.developerOptions developer list }
     */
    indicesSelected: State<number[]>,
    /**
     * The developers to be presented in the assignment list
     */
    developerOptions: Developer[] | null[]

}

export type DeverloperAssignmentFormProp = {
    /**
     * Indicates the indices of the devs assigned from the developer list
     */
    developerAssignmentState: DeveloperAssignmentData,
    children?: ReactNode
    devLegendText?: string

}

export function DeverloperAssignmentForm({ devLegendText = "Assign Developers : ", developerAssignmentState, children = (<></>) }: DeverloperAssignmentFormProp) {
    const devAssignLegendText: ReactNode = (<><b><p>{devLegendText}</p></b></>);
    const devAssignFieldSetOptions: FieldSetOptions = {
        children: devAssignLegendText
    };

    let devOptionElements: ReactNode = (<></>);
    if (developerAssignmentState.developerOptions[0] !== null && typeof developerAssignmentState.developerOptions !== "undefined") {
        const keys = getKeysForList(developerAssignmentState.developerOptions!);
        devOptionElements = developerAssignmentState.developerOptions!.map((developer, index) => {
            const devTypeElement = (developer!.developerType[0].trim() !== "") ? `(${developer!.developerType})` : "";
            return (<option key={keys[index]} value={index}>{`${developer!.username} ${devTypeElement}`}</option>);

        });

    }

    function handleDevSelect(e: ChangeEvent<HTMLSelectElement>): void {

        let newDevArray = new Array(e.target.selectedOptions.length);

        for (let i = 0; i < newDevArray.length; i++) {

            newDevArray[i] = e.target.selectedOptions.item(i)?.value;
        }

        console.log(e.target.selectedOptions);
        console.log(newDevArray);
        developerAssignmentState.indicesSelected.setState((prevState) => {

            return ({
                ...prevState,
                indicesSelected: newDevArray
            });

        }

        );
    }
    //value={developerAssignmentState.stateVariable.indicesSelected}
    return ((developerAssignmentState.developerOptions[0] !== null) ? (<Form cssClassName="developer-assignment-form" fieldSetOptions={devAssignFieldSetOptions}>



        <select name="developersAssigned" value={developerAssignmentState.indicesSelected.stateVariable!} onChange={(e) => handleDevSelect(e)} multiple={true} id="devs">
            {devOptionElements}
        </select>


        {children}

    </Form>) : (<></>));
}

