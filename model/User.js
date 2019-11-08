class User{
    constructor(obj){
        for (var prop in obj) {
            if (this.hasOwnProperty(prop)) {
                this[prop] = obj[prop];
            }
        } 
    }
}

module.exports = User