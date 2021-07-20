const got = require('got');
const jsdom = require('jsdom');
const fs = require('fs');
const { JSDOM } = jsdom;

function get_values(link, year)    {
    got(link).then(response => {
        doc = (new JSDOM(response.body)).window.document;
        
        var array = [year];
        var table = doc.getElementById("dataTable");
        for (var j = 2; j < 32; j++)  {
            var val = table.rows[j].cells[10].textContent;
            if (val != '') {
                array.push(val);
            }
        }
        data_str = array.toString();
        logger.write(data_str + '\n');
        
    }).catch(err => {
        console.log(err);
    });
    
};


let data_array = [];

let link = "http://www.bom.gov.au/jsp/ncc/cdio/weatherData/av?p_nccObsCode=193&p_display_type=dailyDataFile&p_startYear=1990&p_c=-48861811&p_stn_num=015628";


fs.writeFile('Weather data.csv', '', function(err){
    if (err) {
        console.log(err);
    }
});

let logger = fs.createWriteStream('Weather data.csv', {
    flags: 'a' //preserve old data
})


for (c = 0; c < link.length; c++) {
    console.log(link.substring(c, c+5));
    if (link.substring(c, c+5) == "Year="){
            break;
    }
}

let link1 = link.substring(0, c+5);
let link2 = link.substring(c+9, );


for (i = 0; i < 9; i++){
    var curr_url = link1 + "199" + i + link2;
    data_array.push(get_values(curr_url, "199" + i));
}

for (k = 0; k < 2; k++){
    if (k == 2) {
        var curr_url = link;
        data_array.push(get_values(curr_url, '2020'));
    }
    else {
        for (j = 0; j < 9; j++) {
            var curr_url = link1 + "20" + k + j + link2;
            data_array.push(get_values(curr_url, "20"+k+j));
        }    
    }
    
}

logger.end;
