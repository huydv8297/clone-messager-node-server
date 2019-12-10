
module.exports = () =>{
    const CronJob = require('cron').CronJob

    let storyController = require('./controller/StoryController')

    const TimeZone = 'Asia/Ho_Chi_Minh'

    const job = new CronJob('0 * */2 * * *', function() {
        storyController.cleanExpiredStories()
        console.log('Clean Story');
    }, null, true, TimeZone)
}
