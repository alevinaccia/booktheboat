module.exports = class book{
    constructor(startTime, endTime, creator){
        this.startTime = startTime,
        this.endTime = endTime,
        this.creator = creator,
        this.date = new Date(startTime).toDateString();
    }
}