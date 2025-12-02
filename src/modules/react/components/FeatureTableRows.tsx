import { useContext, type ReactNode, useRef, Fragment } from "react";
import { Feature } from "../../feature";
import { themeContext } from "../context/ThemeContext";
import { Button } from "./Button";
import { getKeysForList } from "./ProjectsTab";
import { TimeConstraints } from "../../Timeconstraints";
import { TaskDeveloperAssignmentForm } from "./TaskDeveloperAssigmentForm";
import { DeverloperAssignmentForm } from "./AddTaskElement";

export function getActiveDevelopmentTasks(feature : Feature){
     if(feature.developmentTasks !== null && typeof feature.developmentTasks !== "undefined"){


        return feature.developmentTasks.filter((feature)=>(feature.currentTaskStatus == "Active"));
    }
    
    return null;
}

export function getPendingDevelopmentTasks(feature : Feature){

    if(feature.developmentTasks !== null && typeof feature.developmentTasks !== "undefined"){


        return feature.developmentTasks.filter((feature)=>(feature.currentTaskStatus == "Pending"));
    }
    
    return null;

}
export function FeatureTableRows({ feature, featureIndex, handleStatusChange }: { feature: Feature; featureIndex: number; handleStatusChange: (action: any) => void; }) {
    const activeTasks = getActiveDevelopmentTasks(feature);
    const pendingTasks = getPendingDevelopmentTasks(feature);
    const completedTasks = feature.developmentTasks!.filter((devTask) => (devTask.currentTaskStatus === "Completed"));
    const numberOfPendingTasks = pendingTasks!.length;
    const numberOfActiveTasks = activeTasks!.length;
    const numberOfCompletedTasks = completedTasks.length;
    const appThemeContext = useContext(themeContext);

        let tableRows: ReactNode[] = [];

    //let assignedDevList: ReactNode = (<></>);
    const refsForCompletedTasks = new Array(completedTasks.length);

    for (let i = 0; i < refsForCompletedTasks.length; i++) {

        refsForCompletedTasks[i] = useRef(null);
    }


    // We need to generate a number of rows accomodating the largest of the active, pending or complete tasks : this array is sorted from largest to smallest
    // <=> We need as many rows as the first element of the array
    let amountOfDifferentTasks = [numberOfActiveTasks, numberOfCompletedTasks, numberOfPendingTasks].sort((numberA, numberB) => {
        return numberB - numberA;
    });


    //We will need one key for each row, since this is a mapping call
    const keysForTableRows = getKeysForList(new Array(amountOfDifferentTasks[0]));
    //We will also need one key per  task and type of task
    const activeTaskKeys = getKeysForList(activeTasks!);
    const pendingTaskKeys = getKeysForList(pendingTasks!);
    const completedTaskKeys = getKeysForList(new Array(numberOfCompletedTasks));
    //amountOfDifferentTasks[0] === amount of rows we need
    //We go down each row and try to add the completed, active and pending tasks in the order:
    //Pending (0)-> Active (1) -> Completed (2)
    let activeTds = new Array(activeTasks!.length);
    if (activeTasks!.length > 0) {

        activeTasks!.map((task, index) => {
            let devAssignmentForm : ReactNode = (<></>);
            let assignedTaskDevelopers : ReactNode = (<></>);
            if(task.assignedDevelopers !== null){
                                    
                const devTaskIndex = feature.developmentTasks?.findIndex((taskIn) => ((taskIn.type === taskIn.type) && (taskIn.description === task.description)));

              const keys : React.Key[] =  getKeysForList(task.assignedDevelopers);
              let asssignedDevsListElements : ReactNode = task.assignedDevelopers.map((dev, index)=>{

                const userTypeString = (dev.developerType[0]!== undefined && dev.developerType[0]!=="") ? `(${dev.developerType})` : "";
              return ( <li key={keys[index]} value={dev.username}>{dev.username}{userTypeString}</li>);

              });
                assignedTaskDevelopers = (
               <> <h6>Developers assigned to {task.description}</h6>
              <ul>{asssignedDevsListElements}</ul></>);

              if(!(feature.assignedDevelopers?.filter((featDev)=>{ 
                //task.assignedDevelopers?.includes(dev)
                    return task.assignedDevelopers!.filter((taskDev=> featDev.userId == taskDev.userId)).length > 0;    
            }).length == feature.assignedDevelopers?.length)){
               devAssignmentForm = (<TaskDeveloperAssignmentForm devTaskIndex={devTaskIndex!} developmentTask={task} dispatchAction={handleStatusChange} featureDevelopers={feature.assignedDevelopers} featureIndex={featureIndex} ></TaskDeveloperAssignmentForm>)
              }else{
                devAssignmentForm = (<></>);
              }

            }

            activeTds[index] = (<td key={activeTaskKeys[index]}><div style={{ border: `medium inset ${appThemeContext.primaryBackgroundColor} ` }}><h5>{`${task.timeconstraints.startdateString} -> ${task.timeconstraints.enddateString}`}</h5>
                <h5>{`${task.type}`}</h5>

                <textarea disabled={false} defaultValue={task.description}>

                </textarea>
                                {assignedTaskDevelopers}
                                {devAssignmentForm}

                <Button isDisabled={false} onClick={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    //make action object
                    const devTaskIndex = feature.developmentTasks?.findIndex((taskIn) => ((taskIn.type === taskIn.type) && (taskIn.description === task.description)
                        && (taskIn.assignedDevelopers === task.assignedDevelopers)));

                    const action = {
                        type: "CHANGE_DEV_TASK_STATUS",
                        payload: {
                            devTaskIndex: devTaskIndex,
                            featureIndex: featureIndex,
                            newStatus: "Complete"
                        }
                    };



                    handleStatusChange(action);


                }} cssClassName="task-to-complete-task-button">{"Set task as complete : "}</Button>
                <Button isDisabled={false} onClick={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    //make action object
                    const devTaskIndex = feature.developmentTasks?.findIndex((taskIn) => ((taskIn.type === task.type) && (taskIn.description === task.description)
                        && (taskIn.assignedDevelopers === task.assignedDevelopers)));
                    const action = {
                        type: "CHANGE_DEV_TASK_STATUS",
                        payload: {
                            devTaskIndex: devTaskIndex,
                            featureIndex: featureIndex,
                            newStatus: "Pending"
                        }
                    };

                    handleStatusChange(action);


                }} cssClassName="task-to-pending-task-button">{"Set task as pending : "}</Button>                                                                              </div></td>);


        });
    }
    let pendingdTds = new Array(pendingTasks!.length);
    if (pendingTasks!.length > 0) {
        

        pendingTasks!.map((task, index) => {
            let assignedTaskDevelopers : ReactNode = (<></>);
                        let devAssignmentForm : ReactNode = (<></>);

            if(task.assignedDevelopers !== null){
                                const devTaskIndex = feature.developmentTasks?.findIndex((taskIn) => ((taskIn.type === taskIn.type) && (taskIn.description === task.description)));

              const keys : React.Key[] =  getKeysForList(task.assignedDevelopers);
              let asssignedDevsListElements : ReactNode = task.assignedDevelopers.map((dev, index)=>{

                const userTypeString = (dev.developerType[0]!== undefined && dev.developerType[0]!=="") ? `(${dev.developerType})` : "";
              return ( <li key={keys[index]} value={dev.username}>{dev.username}{userTypeString}</li>);

              });
                assignedTaskDevelopers = (
               <> <h6>Developers assigned to {task.description}</h6>
              <ul>{asssignedDevsListElements}</ul></>);
              if(!(feature.assignedDevelopers?.filter((featDev)=>{ 
                //task.assignedDevelopers?.includes(dev)
                    return task.assignedDevelopers!.filter((taskDev=> featDev.userId == taskDev.userId)).length > 0;    
            }).length == feature.assignedDevelopers?.length)){
               devAssignmentForm = (<TaskDeveloperAssignmentForm devTaskIndex={devTaskIndex!} developmentTask={task} dispatchAction={handleStatusChange} featureDevelopers={feature.assignedDevelopers} featureIndex={featureIndex} ></TaskDeveloperAssignmentForm>)
              }else{
                devAssignmentForm = (<></>);
              }

            }
            
                
            pendingdTds[index] = <td key={pendingTaskKeys[index]}><div style={{ border: `medium inset ${appThemeContext.primaryBackgroundColor} ` }}><h5>{`${task.timeconstraints.startdateString} -> ${task.timeconstraints.enddateString}`}</h5>
                <h5>{`${task.type}`}</h5>

                <textarea disabled={false} defaultValue={task.description}>

                </textarea>
                {assignedTaskDevelopers}
                {devAssignmentForm}
                
                <Button isDisabled={false} onClick={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    //make action object
                    const devTaskIndex = feature.developmentTasks?.findIndex((taskin) => ((taskin.type === task.type) && (taskin.description === task.description)
                        && (taskin.assignedDevelopers === task.assignedDevelopers)));
                    const action = {
                        type: "CHANGE_DEV_TASK_STATUS",
                        payload: {
                            devTaskIndex: devTaskIndex,
                            featureIndex: featureIndex,
                            newStatus: "Active"
                        }
                    };

                    handleStatusChange(action);


                }} cssClassName="task-to-active-task-button">{"Set task as active: "}</Button>
            </div></td>;


        });
    }

    let completedTds = new Array(completedTasks.length);
    if (completedTasks.length > 0) {

        completedTasks.map((task, index) => {
              let assignedTaskDevelopers : ReactNode = (<></>);
                                      let devAssignmentForm : ReactNode = (<></>);

            if(task.assignedDevelopers !== null){
                                                const devTaskIndex = feature.developmentTasks?.findIndex((taskIn) => ((taskIn.type === taskIn.type) && (taskIn.description === task.description)));

              const keys : React.Key[] =  getKeysForList(task.assignedDevelopers);
              let asssignedDevsListElements : ReactNode = task.assignedDevelopers.map((dev, index)=>{

                const userTypeString = (dev.developerType[0]!== undefined && dev.developerType[0]!=="") ? `(${dev.developerType})` : "";
              return ( <li key={keys[index]} value={dev.username}>{dev.username}{userTypeString}</li>);

              });
              assignedTaskDevelopers = (
               <> <h6>Developers assigned to {task.description}</h6>
              <ul>{asssignedDevsListElements}</ul></>);
            //     if(!(feature.assignedDevelopers?.filter((dev)=> task.assignedDevelopers?.includes(dev)).length == feature.assignedDevelopers?.length)){
            //    devAssignmentForm = (<TaskDeveloperAssignmentForm devTaskIndex={devTaskIndex!} developmentTask={task} dispatchAction={handleStatusChange} featureDevelopers={feature.assignedDevelopers} featureIndex={featureIndex} ></TaskDeveloperAssignmentForm>);
            // }

            }

            completedTds[index] = <td key={completedTaskKeys[index]}><div ref={refsForCompletedTasks[index]} style={{ border: `medium inset ${appThemeContext.primaryBackgroundColor} ` }}><h5>{`${task.timeconstraints.startdateString} -> ${task.timeconstraints.enddateString} \n \t Completed at : ${task.timeconstraints.completiondate}`}</h5>
                <h5>{`${task.type}`}</h5>
                <Button cssClassName="remove-task-from-schedule-button " isDisabled={false} onClick={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    // refsForCompletedTasks[index].current.className = "complete-task-schedule cell hidden";

                    const action = {
                        type: "REMOVE_DEVELOPMENT_TASK",
                        payload: {
                            featureIndex: featureIndex,
                            completedTaskIndex: index
                        }
                    };
                    handleStatusChange(action);
                }}>{"Remove"}</Button>

                <textarea defaultValue={task.description} disabled={false}>

                </textarea>
                                {assignedTaskDevelopers}
                                {devAssignmentForm}

            </div></td>;


        });
    }
    let completedTaskSafeBool = true;
    tableRows = new Array(amountOfDifferentTasks[0]);
    for (let i = 0; i < amountOfDifferentTasks[0]; i++) {
        if (refsForCompletedTasks.length > 0 && i < refsForCompletedTasks.length) {
            if (refsForCompletedTasks[i].current === null || typeof refsForCompletedTasks[i].current === "undefined") {
                completedTaskSafeBool = true;
            }
            else {

                completedTaskSafeBool = (refsForCompletedTasks[i].current.className = "complete-task-schedule cell hidden") ? false : true;
            }
        }
        tableRows[i] = (<Fragment key={keysForTableRows[i]}>
            <tr>
                {(i < pendingTasks!.length && pendingTasks!.length > 0) ? pendingdTds[i] : (<td></td>)}
                {(i < activeTasks!.length && activeTasks!.length > 0) ? activeTds[i] : (<td></td>)}
                {(i < completedTasks.length && completedTasks.length > 0 && completedTaskSafeBool) ? completedTds[i] : (<td></td>)}
            </tr>
        </Fragment>);
    }
    // let mappedTasks = new Array(amountOfDifferentTasks[0]).fill(new Array(3));
    // for (let i = 0; i < amountOfDifferentTasks[0]; i++) {
    //     for (let k = 0; k < 3; k++) {
    //         switch (k) {
    //             case 0: {
    //                 //We only try taskKeys after the check that i < ... .length <=> We can just check for i
    //                 mappedTasks[i][k] = (i < pendingTasks.length && pendingTasks.length !== 0) ? (<div style={{ border: `medium inset ${appThemeContext.primaryBackgroundColor} ` }} key={pendingTaskKeys[i]}><h5>{`${pendingTasks[i].timeconstraints.startdate} -> ${pendingTasks[i].timeconstraints.enddate}`}</h5>
    //                     <h5>{`${pendingTasks[i].type}`}</h5>
    //                     <textarea disabled={false} defaultValue={pendingTasks[i].description}>
    //                     </textarea>
    //                     <Button isDisabled={false} onClick={(e) => {
    //                         e.preventDefault(); e.stopPropagation();
    //                         //make action object
    //                         const devTaskIndex = feature.developmentTasks?.findIndex((task) => ((task.type === pendingTasks[i].type) && (task.description === pendingTasks[i].description)
    //                             && (task.assignedDevelopers === pendingTasks[i].assignedDevelopers)));
    //                         const action = {
    //                             type: "CHANGE_DEV_TASK_STATUS",
    //                             payload: {
    //                                 devTaskIndex: devTaskIndex,
    //                                 featureIndex: featureIndex,
    //                                 newStatus: "Active"
    //                             }
    //                         };
    //                         handleStatusChange(action);
    //                     } } cssClassName="task-to-active-task-button">{"Set task as active: "}</Button>
    //                 </div>)
    //                     : (<></>);
    //             }
    //                 break;
    //             case 1: {
    //                 //We only try taskKeys after the check that i < ... .length <=> We can just check for i
    // mappedTasks[i][k] = (i < activeTasks.length && activeTasks.length !== 0) ? (<div style={{ border: `medium inset ${appThemeContext.primaryBackgroundColor} ` }} key={activeTaskKeys[i]}><h5>{`${activeTasks[i].timeconstraints.startdate} -> ${activeTasks[i].timeconstraints.enddate}`}</h5>
    //     <h5>{`${activeTasks[i].type}`}</h5>
    //     <textarea disabled={false} defaultValue={activeTasks[i].description}>
    //     </textarea>
    //     <Button isDisabled={false} onClick={(e) => {
    //         e.preventDefault(); e.stopPropagation();
    //         //make action object
    //         const devTaskIndex = feature.developmentTasks?.findIndex((task) => ((task.type === activeTasks[i].type) && (task.description === activeTasks[i].description)
    //             && (task.assignedDevelopers === activeTasks[i].assignedDevelopers)));
    //         const action = {
    //             type: "CHANGE_DEV_TASK_STATUS",
    //             payload: {
    //                 devTaskIndex: devTaskIndex,
    //                 featureIndex: featureIndex,
    //                 newStatus: "Complete"
    //             }
    //         };
    //         handleStatusChange(action);
    //     } } cssClassName="task-to-complete-task-button">{"Set task as complete : "}</Button>
    //     <Button isDisabled={false} onClick={(e) => {
    //         e.preventDefault(); e.stopPropagation();
    //         //make action object
    //         const devTaskIndex = feature.developmentTasks?.findIndex((task) => ((task.type === activeTasks[i].type) && (task.description === activeTasks[i].description)
    //             && (task.assignedDevelopers === activeTasks[i].assignedDevelopers)));
    //         const action = {
    //             type: "CHANGE_DEV_TASK_STATUS",
    //             payload: {
    //                 devTaskIndex: devTaskIndex,
    //                 featureIndex: featureIndex,
    //                 newStatus: "Pending"
    //             }
    //         };
    //         handleStatusChange(action);
    //     } } cssClassName="task-to-pending-task-button">{"Set task as pending : "}</Button>                                                                              </div>)
    //                     : (<></>);
    //             }
    //                 break;
    //             case 2: {
    //                 //We only try taskKeys after the check that i < ... .length <=> We can just check for i
    //                 mappedTasks[i][k] = (i < completedTasks.length && completedTasks.length !== 0) ? (<div ref={refsForCompletedTasks[i]}  style={{ border: `medium inset ${appThemeContext.primaryBackgroundColor} ` }} key={completedTaskKeys[i]}><h5>{`${completedTasks[i].timeconstraints.startdate} -> ${completedTasks[i].timeconstraints.enddate} \n \t Completed at : ${completedTasks[i].timeconstraints.completiondate}`}</h5>
    //                     <h5>{`${completedTasks[i].type}`}</h5>
    //                     <Button cssClassName="remove-task-from-schedule-button " isDisabled={false} onClick={(e) => {
    //                         e.preventDefault(); e.stopPropagation();
    //                        refsForCompletedTasks[i].current.className = "complete-task-schedule cell hidden";
    //                     } }>{"Remove"}</Button>
    //                     <textarea defaultValue={completedTasks[i].description} disabled={false}>
    //                     </textarea>
    //                 </div>)
    //                     : (<></>);
    //             }
    //                 break;
    //             default:
    //                 break;
    //         }
    //         //Once we have exited the switch-statement we have mapped all our tasks for one row
    //     }
    //     //-----!!PUT DEVELOPERS IN EACH TASK !!--------
    // }
    // //Once we finish the for loop we have mapped all rows of elements, we can safely put each element into any table row since they´re, at worst, are empty
    // tableRows = new Array(amountOfDifferentTasks[0]);
    // for (let i = 0; i < amountOfDifferentTasks[0]; i++) {
    //     tableRows[i] = (<Fragment key={keysForTableRows[i]}>
    //         <tr>
    //             <td>{mappedTasks[i][0]}</td>
    //             <td>{mappedTasks[i][1]}</td>
    //             <td>{mappedTasks[i][2]}</td>
    //         </tr>
    //     </Fragment>);
    // }
    return (<>{tableRows}</>);
}
