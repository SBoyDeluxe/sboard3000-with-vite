

/**Represents the timeconstraints imposed on a project or feature ;
 * 
 * ->(its)start date, end date, completion date
 * 
 * 
 */
export class TimeConstraints {


    /**The start date of work on a feature or project */
    public startdate: Date;

    public get startdateString(): string {
        return this.getDateString("start-date");
    }

    /**The expected end date of work on a feature or project */
    public enddate: Date;

    public get enddateString(): string {
        return this.getDateString("end-date");
    }

    /**The completion date of a feature or project, null if incomplete */
    public completionDate: Date | null = null;
    public get completiondate(): string | null {
        if (this.completionDate != null) {
            //             let completionYear = this.completionDate.getFullYear();
            // let completionMonth = this.completionDate.getMonth();
            // let completionDay = this.completionDate.getDate();
            // let completionHours = this.completionDate.getHours();
            // let completionMinutes = this.completionDate.getMinutes();
            this.dateToString(this.completionDate);
            return TimeConstraints.getAsFormattedString(this.completionDate);;
        } else {
            return null
        }
    }
    public set completiondate(value: Date) {
        this.completionDate = value;
    }



    constructor(startdate: Date, enddate: Date) {
        this.startdate = startdate;
        this.enddate = enddate;



    }




    /** Takes in a date and converts to a readable string
     * 
     * @param {Date} dateToConvert 
     * @returns {string} dateString : Format (year - month - day | hh:mm |)
     */
    dateToString(dateToConvert: Date): string {

        const year = dateToConvert.getFullYear();
        const month = dateToConvert.getMonth() +1;
        const day = dateToConvert.getDate();
        const hour = dateToConvert.getHours();
        const minutes = dateToConvert.getMinutes();
        const hourString = (hour < 10) ? `0${hour}` : `${hour}`;
        const minuteString = (minutes < 10) ? `0${minutes}` : `${minutes}`;
        return `${year} - ${month} - ${day} | ${hourString} : ${minuteString} | `;
    }
    /**Sets the completion date to now
     * 
     */
    public completeConstraint() {
        let now = new Date(Date.now());

        this.completionDate = now;

    }
    /**
     * 
     * @param inDate The date to be converted into UTC-parameters (day, year....)
     * @returns UTCParameters - Ex : year : 2025, month : 8, day : 12....
     */
    public static getLocalTimeParameters(inDate: Date) {


        const dateYear = inDate.getFullYear();
        const dateMonth = inDate.getMonth();
        const dateDay = inDate.getDate();
        const dateHours = inDate.getHours();
        const dateMinutes = inDate.getMinutes();
        const dateSeconds = inDate.getSeconds();
        const dateMilliseconds = inDate.getMilliseconds();

        return {
            year: dateYear,
            month: dateMonth,
            day: dateDay,
            hour: dateHours,
            minutes: dateMinutes,
            seconds: dateSeconds,
            miliSeconds: dateMilliseconds


        }
    }
    /**
     * Returns the fraction of how much time has passed since the start date.
     * 
     * @returns The time passed since the start date as a fraction of the total time alloted between start date and end date 
     * 
     * @example
     *           const startDate =  Date.parse("04 Dec 2024 00:12:00 GMT");
     *           const endDate =  Date.parse("06 Dec 2024 00:12:00 GMT");
     * 
     *           const  currentDate =  Date.parse("05 Dec 2024 00:12:00 GMT");
     * 
     *            const totalTime =  endDate.getTime() - startDate.getTime();
     *           
     *           const timePassed = currentDate.getTime() - startDate.getTime();
     * 
     * 
     *           //In this example, 0.5 -> 1 day of the totally allotted 2 days have passed
     *           return timePassed/totalTime;
     * 
     *      
     * 
     */
    public getTimePassedFraction() {

        const totalTime = this.enddate.getTime() - this.startdate.getTime();

        const timePassed = new Date(Date.now()).getTime() - this.startdate.getTime();

        return timePassed / totalTime;
    }

    getDateString(wantedString: "start-date" | "end-date"): string {

        let returnString = "";
        switch (wantedString) {
            case "start-date": {
                returnString = this.dateToString(this.startdate);
            }
                break;
            case "end-date": {

                returnString = this.dateToString(this.enddate);

            }
                break;

        }

        return returnString;

    }

    public static getAsFormattedString(date: Date): string {

        if (typeof date == "string") {
            let dateParse = new Date(Date.parse(date));
            let dateYear = dateParse.getFullYear();
            let dateMonth = dateParse.getMonth() +1;
            let dateDay = dateParse.getDate();
            let dateHours = dateParse.getHours();
            let dateMinutes = dateParse.getMinutes();
            return `${dateYear}/${(dateMonth >= 10) ? dateMonth : `0${dateMonth}`} /${(dateDay >= 10) ? dateDay : `0${dateDay}`} | ${(dateHours >= 10) ? dateHours : `0${dateHours}`}:${(dateMinutes >= 10) ? dateMinutes : `0${dateMinutes}`} |`;

        }

        let dateYear = date.getFullYear();
        let dateMonth = date.getMonth()+1;
        let dateDay = date.getDate();
        let dateHours = date.getHours();
        let dateMinutes = date.getMinutes();
        return `${dateYear}/${(dateMonth >= 10) ? dateMonth : `0${dateMonth}`} /${(dateDay >= 10) ? dateDay : `0${dateDay}`} | ${(dateHours >= 10) ? dateHours : `0${dateHours}`}:${(dateMinutes >= 10) ? dateMinutes : `0${dateMinutes}`} |`;

    }



}




