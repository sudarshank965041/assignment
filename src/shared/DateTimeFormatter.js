export function formattedDate (UNIX_timestamp) {
    var a = new Date(UNIX_timestamp );
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    return  (date + ' ' + month + ' ' + year)
}

export function formattedTime (UNIX_timestamp) {
    var a = new Date(UNIX_timestamp);
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    return  (hour + ':' + min + ':' + sec)
}

export default {
    formattedDate,
    formattedTime
}