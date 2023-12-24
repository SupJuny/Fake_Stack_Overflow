export default class HelperFunction {
    time_log = function (date) {
        let UploadedDate = new Date(date);
        let currentDate = new Date();
        let diff_time_sec = parseInt((currentDate.getTime() - UploadedDate.getTime()) / (1000));
        let diff_time_min = parseInt((currentDate.getTime() - UploadedDate.getTime()) / (1000 * 60));
        let diff_time_hour = parseInt((currentDate.getTime() - UploadedDate.getTime()) / (1000 * 60 * 60));
        let diff_time_year = parseInt((currentDate.getTime() - UploadedDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][UploadedDate.getMonth()];
        let month_idx = months.indexOf(month);
        let months_abrvs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let months_out = months_abrvs[month_idx];

        let hours = ('0' + UploadedDate.getHours()).slice(-2);
        let minutes = ('0' + UploadedDate.getMinutes()).slice(-2);
        let seconds = ('0' + UploadedDate.getSeconds()).slice(-2);
        let timeString = hours + ':' + minutes + ':' + seconds;

        if (diff_time_sec === 1) return (diff_time_sec.toString() + " second ago");
        else if (diff_time_sec < 60) return (diff_time_sec.toString() + " seconds ago");
        else if (diff_time_min === 1) return (diff_time_min.toString() + " minute ago");
        else if (diff_time_min < 60) return (diff_time_min.toString() + " minutes ago");
        else if (diff_time_hour === 1) return (diff_time_hour.toString() + " hour ago");
        else if (diff_time_hour < 24) return (diff_time_hour.toString() + " hours ago");
        else if (diff_time_year >= 1) return (months_out + " " + UploadedDate.getDate() + ", " + UploadedDate.getFullYear() + " at " + timeString);
        else return (months_out + " " + UploadedDate.getDate() + " at " + timeString);
    }

    newest_sort = function (questions) {
        questions.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
        return questions;
    }

    active_sort = function (questions, answers) {
        let active_sorted_questions = [];
        questions.sort((a, b) => new Date(b.answers.ask_date_time) - new Date(a.ask_date_time));
        answers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));

        answers.forEach(ans => {
            for (let i = 0; i < questions.length; i++) {
                for (let j = 0; j < questions[i].answers.length; j++) {
                    if (active_sorted_questions.includes(questions[i])) break;
                    else if (questions[i].answers[j] === ans._id) active_sorted_questions.push(questions[i]);
                }
            }
        });
        console.log(active_sorted_questions);
        questions.forEach(q => {
            if (!active_sorted_questions.includes(q)) active_sorted_questions.push(q);
        });
        return active_sorted_questions;
    }

    handling_hyperlinks = function (text) {
        let link_name = '';
        let link_ref = '';

        for (let i = 0; i < text.length; i++) {
            if (text[i] === '[') {
                console.log("[ is recognized");
                let idx = i;
                while (idx < text.length) {
                    if (text[idx] === ']') {
                        console.log("] is recognized");
                        link_name = text.substring(i + 1, idx);
                        break;
                    }
                    idx++;
                }
                console.log(idx);
                if (idx === text.length) return text;
                idx++;

                if (text[idx] === '(') {
                    console.log("link ref checking start");
                    if (text[idx + 1] === ')') return "hyperlink_empty";
                    if (text.substring(idx + 1, idx + 8) !== "http://" && text.substring(idx + 1, idx + 9) !== "https://") return "invalid_hyperlink";

                    let link_start_idx = idx;

                    while (idx < text.length) {
                        if (text[idx] === ')') {
                            link_ref = text.substring(link_start_idx + 1, idx);
                            console.log(link_name);
                            console.log(link_ref);
                            break;
                        }
                        idx++;
                    }

                    if (idx === text.length) return text;
                }
                else return text;
                if (idx === text.length) return text;
            }
        }

        console.log(text);

        return text;

    }

}