import { Feature } from "../../../feature";



// function useFeatureReducer() {
//     const features: Feature[] | null = null;

//     return useReducer(FeatureReducer, features);



// }

/**
 * 
 * @example
 * 
 *      //----!!All filters will be done with the assumption that title, type and 
 *      //description can be used as discerning data for any 1 feature if featureIndex is null !!----
 *           
 *      //Can always be called, instantiates a Feature[] if none exists
 *     action.type : ADD_FEATURE {
 *          action.payload.title : string,
 *          action.payload.type : string,
 *          action.payload.description : string,
 *          //timeconstraints must be given for a feature
 *          action.payload.timeconstraints : TimeConstraints,
 *          //if developmentTasks are left as null, the first dev-task becomes "Plan project" with all assigned devs assigned to it
 *          action.payload.developmentTasks : Task[]|null,
 *          action.payload.assignedDevelopers : Developer[] | null,
 *         
 *              
 *      }
 * 
 *      //Can only be called on an instantiated feature array
 *     action.type : ASSIGN_DEVELOPERS {
 *      action.payload.title : string,
 *      action.payload.type : string,
 *      action.payload.description : string,
 *      action.payload.developersToAssign : Developer[] | null,
 *      action.payload.featureIndex : number | null
 *              
 *      }
 *      //Can only be called on an instantiated feature array
 *     action.type : COMPLETE_FEATURE {
 *      action.payload.title : string,
 *      action.payload.type : string,
 *      action.payload.description : string,
 *      action.payload.featureIndex : number | null
 *              
 *      }
 *      //Can only be called on an instantiated feature array
 *     action.type : ADD_DEVELOPMENT_TASKS {
 *      action.payload.title : string|null,
 *      action.payload.type : string|null,
 *      action.payload.description : string|null,
 *      action.payload.devTask : Task;
 *      
 *      action.payload.featureIndex : number | null
 *              
 *      }
 * 
 *  action.type : "CHANGE_DEV_TASK_STATUS": {
 *
 *           
 *               
 *               
 *               action.payload.devTaskIndex : number;
 *
 *               action.payload.featureIndex : number;
 *
 *               action.payload.newStatus :string ;
 *      }
 * 
 * action.type : ASSIGN_DEVELOPERS_TO_DEVELOPMENT_TASK
 *      action.payload : {
 *                  featureIndex : number,
 *                  devTaskIndex : number,
 *                  developersToAssign : Developer[],
 *                  // Specifies a specific goal-task inside the devtask
 *                  taskGoalIndex : number | null
 *                                   
 * }
 * 
 *   const action = {
 *                       type : "REMOVE_DEVELOPMENT_TASK",
 *                      payload:{ featureIndex : featureIndex,
 *                       completedTaskIndex : index
 *                       }
 *                  }
 * 
 * @param features 
 * @param action 
 */
export function FeatureReducer(features: Feature[] | null, action: { type: string, payload: any }) {
    //Checks whether the feature array has been instantiated
    const featuresAreInstantiated = (features !== null);

    let returnArray: Feature[] | null = null;

    switch (action.type) {

        case "ADD_FEATURE": {

            if (featuresAreInstantiated) {
                const featureToAdd = new Feature(action.payload.title, action.payload.type, action.payload.description, action.payload.timeconstraints, action.payload.developmentTasks, action.payload.assignedDevelopers);

                const newFeatureArray = features.concat(featureToAdd);

                returnArray = newFeatureArray;
            } else {
                const featureToAdd = new Feature(action.payload.title, action.payload.type, action.payload.description, action.payload.timeconstraints, action.payload.developmentTasks, action.payload.assignedDevelopers);

                returnArray = [featureToAdd];

            }

        }
            break;

        case "ASSIGN_DEVELOPERS": {
            //Only if features are instantiated can we assign developers to those features
            if (featuresAreInstantiated) {

                if (action.payload.featureIndex !== undefined) {
                    const index = action.payload.featureIndex;

                    let featureToAssignDevsTo = features[index];
                    featureToAssignDevsTo.assignDevelopers(action.payload.developersToAssign, null);

                    const arrayOfOtherFeatures = features.filter((_feature, indexToCheck: number) => (indexToCheck !== index));

                    const newFeatureArray = (features.length > 1) ? (arrayOfOtherFeatures.concat(featureToAssignDevsTo)) : [featureToAssignDevsTo];

                    returnArray = newFeatureArray;
                } else {

                    const featureToAssignDevsTo = features.filter((feature) => (feature.title === action.payload.title && feature.description === action.payload.description &&
                        feature.type === action.payload.type));

                    if (featureToAssignDevsTo[0] !== undefined) {
                        featureToAssignDevsTo[0].assignDevelopers(action.payload.developersToAssign, null);

                        const arrayOfOtherFeatures = features.filter((feature) => !(feature.title === action.payload.title && feature.description === action.payload.description &&
                            feature.type === action.payload.type));

                        const newFeatureArray = (features.length > 1) ? (arrayOfOtherFeatures.concat(featureToAssignDevsTo[0])) : [featureToAssignDevsTo[0]];

                        returnArray = newFeatureArray;

                    }
                    else {
                        returnArray = null;
                    }
                }




            }
            else {
                returnArray = null;
            }
        }
            break;
        case "COMPLETE_FEATURE": {
            //We can only complete any features if they have been instantiated
            if (featuresAreInstantiated) {

                //If featureIndex is given this is a prioritized for filtering

                if (action.payload.featureIndex !== undefined) {
                    const index = action.payload.featureIndex;
                    const featureToComplete = features[index];
                    featureToComplete.completeFeature();


                    const returnElement = (features.length > 1) ? features.filter((_val, valIndex) => (valIndex !== index)).concat(featureToComplete) : [featureToComplete];
                    returnArray = returnElement;
                } else {


                    const featureToComplete = features.filter((feature) => (feature.title === action.payload.title && feature.description === action.payload.description &&
                        feature.type === action.payload.type))[0];
                    const restOfTheFeatures = features.filter((feature) => !(feature.title === action.payload.title && feature.description === action.payload.description &&
                        feature.type === action.payload.type));

                    if (featureToComplete !== undefined) {
                        featureToComplete.completeFeature();
                        returnArray = [...restOfTheFeatures, featureToComplete]


                    }


                }






            }



        }
            break;

        case "ADD_DEVELOPMENT_TASKS": {
            //From AddDevTaskElement
            //  const action = {
            //         type: "ADD_DEVELOPMENT_TASKS",
            //         payload: {
            //             featureIndex: selectedFeatureIndex,
            //             timeconstraints: timeconstraints,
            //             devTask: newTask
            //         }
            //     };
            if (featuresAreInstantiated) {

                const isValid = (action.payload.featureIndex !== null && action.payload.timeconstraints !== null && action.payload.devTask!== null);

                if(isValid){

                  // const timeConstraints = action.payload.timeconstraints;     
                   const featureIndex = action.payload.featureIndex;     
                   const devTaskToAdd = action.payload.devTask;
                   
                   returnArray = features.map((featureInFeatures, indexOfFilter)=>{
                        if(indexOfFilter == featureIndex){
                            featureInFeatures.addDevelopmentTasks([devTaskToAdd]);
                        }
                        return featureInFeatures;
                   });

                }
                else{
                    returnArray = [...features];
                }

                //If featureIndex is given this is a prioritized for filtering

                // if (typeof action.payload.featureIndex === "number") {
                //     //If features.length === 1 we won´t be able to run filter
                //     const isOnlyOneFeature = (features.length === 1);
                //     const index = action.payload.featureIndex;

                //     let featureToAddDevTaskTo = features[index];

                //     const devTasksUndefined = (typeof featureToAddDevTaskTo.developmentTasks === "undefined");
                //     const devTaskToAdd = action.payload.devTask;


                //     if (isOnlyOneFeature) {

                //         let newDevTaskArray: Task[];

                //         if (devTasksUndefined) {
                //             newDevTaskArray = [devTaskToAdd];
                //             featureToAddDevTaskTo.developmentTasks = newDevTaskArray;

                //             returnArray = [featureToAddDevTaskTo];
                //         } else {
                //             const currentDevTasks = featureToAddDevTaskTo.developmentTasks;

                //             newDevTaskArray = [...currentDevTasks, devTaskToAdd];

                //             featureToAddDevTaskTo.addDevelopmentTasks(devTaskToAdd) 

                //             returnArray = [featureToAddDevTaskTo];
                //         }

                //     } else {
                //         let newDevTaskArray: Task[];


                //         //Multiple features to return in the array
                //         const otherFeatures = features.filter((val, fIndex) => (fIndex !== index));

                //         if (devTasksUndefined) {
                //             newDevTaskArray = [devTaskToAdd];
                //             featureToAddDevTaskTo.developmentTasks = newDevTaskArray;

                //             returnArray = [...otherFeatures, featureToAddDevTaskTo];
                //         } else {
                //             const currentDevTasks = featureToAddDevTaskTo.developmentTasks;

                //             newDevTaskArray = [...currentDevTasks, devTaskToAdd];

                //             featureToAddDevTaskTo.developmentTasks = newDevTaskArray;

                //             returnArray = [...otherFeatures, featureToAddDevTaskTo];
                //         }


                //     }
                // } else {


                //     let featureToaddDevTasksTo = features.filter((feature) => (feature.title === action.payload.title && feature.description === action.payload.description &&
                //         feature.type === action.payload.type))[0];

                //     if (typeof featureToaddDevTasksTo !== "undefined") {
                //         const devTaskToAdd = action.payload.devTask;
                //         let currentDevTasks = featureToaddDevTasksTo.developmentTasks;
                //         //Add our new devTask to the array
                //         const newDevTaskArray = (typeof currentDevTasks !== "undefined") ? currentDevTasks.concat(devTaskToAdd) : [devTaskToAdd];
                //         featureToaddDevTasksTo.developmentTasks = newDevTaskArray;
                //         returnArray = features.filter((feature, index) => !(feature.title === action.payload.title && feature.description === action.payload.description &&
                //             feature.type === action.payload.type)).concat(featureToaddDevTasksTo);


                //     }


                // }

            }

        }
            break;

        case "CHANGE_DEV_TASK_STATUS": {

            if (featuresAreInstantiated) {
                //Obtain index of feature and devTask from payload

                const devTaskIndex = action.payload.devTaskIndex;

                const featureIndex = action.payload.featureIndex;

                const newStatus = action.payload.newStatus;

                if (typeof action.payload.featureIndex === "number") {
                    //If features.length === 1 we won´t be able to run filter
                    const isOnlyOneFeature = (features.length === 1);
                    //const index = action.payload.featureIndex;







                    if (newStatus === "Complete") {
                        let featureToCompleteTaskIn = features[featureIndex];

                        featureToCompleteTaskIn.developmentTasks![devTaskIndex].completeTask();

                        if (isOnlyOneFeature) {

                            returnArray = [featureToCompleteTaskIn];
                        }
                        else {
                            const otherFeatures = features.filter((_feat, fIndex) => (fIndex !== featureIndex));

                            returnArray = [...otherFeatures, featureToCompleteTaskIn];
                        }
                    }
                    else {

                        if (isOnlyOneFeature) {
                            let featureToSetStatusForTaskIn = features[featureIndex];
                            featureToSetStatusForTaskIn.developmentTasks![devTaskIndex].currentTaskStatus = newStatus;


                            returnArray = [featureToSetStatusForTaskIn];
                        }
                        else {
                            let featureToSetStatusForTaskIn = features.filter((_feat, featIndex) => (featIndex === featureIndex))[0];
                            featureToSetStatusForTaskIn.developmentTasks![devTaskIndex].currentTaskStatus = newStatus;

                            const otherFeatures = features.filter((_feat, fIndex) => (fIndex !== featureIndex));

                            returnArray = [...otherFeatures, featureToSetStatusForTaskIn];
                        }




                    }

                }

            }
        }
            break;

        case "ASSIGN_DEVELOPERS_TO_DEVELOPMENT_TASK": {

            if (featuresAreInstantiated) {
                /*NaN check to see if we can run the assignment */
                const isValid: boolean = (action.payload.featureIndex != null && typeof action.payload.featureIndex !="undefined" && action.payload.devTaskIndex != null && typeof action.payload.devTaskIndex !="undefined"&& action.payload.developersToAssign != null && typeof action.payload.developersToAssign !="undefined")
                if(isValid){
                    const featureIndex = action.payload.featureIndex;
                    const devTaskIndex = action.payload.devTaskIndex;
                    const devsToAssign =  action.payload.developersToAssign;
                    const developmentTaskGoalIndex = action.payload.taskGoalIndex;
                    if(!developmentTaskGoalIndex){
                   returnArray = features.map((feature : Feature, index : number)=>{
                        if(index == featureIndex){
                                //If is specified feature we want to assign devs to devtask with index = devTaskIndex
                                feature.developmentTasks![devTaskIndex].assignDevelopers(devsToAssign, null);
                        }
                        return feature;
                    });
                }
                    else{
                    returnArray = features.map((feature : Feature, index : number)=>{
                        if(index == featureIndex){
                                //If is specified feature we want to assign devs to devtask with index = devTaskIndex
                                feature.developmentTasks![devTaskIndex].taskGoals![developmentTaskGoalIndex].assignDevelopers(devsToAssign, null);
                        }
                        return feature;
                    });
                    }
                }
            }
        }
            break;

            case "REMOVE_DEVELOPMENT_TASK" :{

                    if(featuresAreInstantiated){
                        
                        const isValid : boolean = (action.payload.featureIndex !== null && action.payload.completedTaskIndex!==null);

                        if(isValid){

                           const featureIndex = action.payload.featureIndex ; 
                            const completedTaskIndex = action.payload.completedTaskIndex;
                          returnArray =  features.map((featureInFeatures, indexOfFeature)=>{

                                if(indexOfFeature == featureIndex){
                                    //Get all completed tasks to select via completedTaskIndex
                                   
                                    featureInFeatures.removeDevelopmentTasks(completedTaskIndex);
                                }
                                return featureInFeatures;
                            });
                        }
                        else{
                                returnArray = [...features];
                        }
                    }

            }
            break;

        default: returnArray = features;
            break;







    }

    return returnArray;



}