import * as data from './RWC2019Predictor.js'

const appbaseRef = Appbase({
	url: 'https://scalr.api.appbase.io',
	app: 'RWC2019PointsTable',
	credentials: 'NS8mA0TkJ:2f5b1e35-d02b-4807-9c6a-a751390998f9',
});

let array = [];
const top = document.getElementById("top");
let details = [];
let result;

window.onload = function() {
    appbaseRef.search({
        type: "doc",
            body: {
                query: {
                    match_all: {},
                },
            }
      }).then(function(response) {
        console.log(response);
        array = response.hits.hits;
        for (let i=0; i<array.length; i++){
            for(let j=0; j<array.length; j++){
                if(array[i]._source.score > array[j]._source.score){
                        let temp = array[i];
                        array[i] = array[j];
                        array[j] = temp;
                 }
            }
            if(array[i]._id == "AWzYS72NuDNiuUUj251k"){
                result = array[i];
                array.splice(i, 1);
            }
        }
        let row, cell0, cell1, cell2, cell3;
        for(let k=0; k<array.length; k++){
            details[k] = document.createElement(`button`);
            details[k].innerHTML = "details";
            details[k].id = `details${k}`;
            row = top.insertRow(k+1);
            cell0 = row.insertCell(0);
            cell1 = row.insertCell(1);
            cell2 = row.insertCell(2);
            cell3 = row.insertCell(3);
            cell0.innerHTML = k+1;
            cell1.innerHTML = array[k]._source.name;
            cell2.innerHTML = array[k]._source.score;
            cell3.innerHTML = details[k].outerHTML;
        }
        for(let i=0; i<array.length; i++){
            document.getElementById(`details${i}`).onclick = function() {
                document.getElementById(`description`).innerHTML = "";
                document.getElementById(`title`).innerHTML = array[i]._source.name;
                for(let prop in array[i]._source){
                    if(array[i]._source[prop] > 0 && array[i]._source[prop] !== true){
                        if(prop == "score"){
                            document.getElementById(`description`).innerHTML += "</br> Total points: " + array[i]._source[prop] + "</br>" ;
                        }
                        else{
                            for(let t=0; t<data.teams.length; t++){
                                if(data.teams[t].id == prop){
                                    document.getElementById(`description`).innerHTML += "Points spent on " + prop + ": " + array[i]._source[prop] + " => gain: " 
                                    + (array[i]._source[prop] * data.teams[t][`multiplier${result._source[prop]}`]) + " points </br>" ;
                                }
                            }
                        }
                    }
                }
            };
        }
      }).catch(function(error) {
        alert(error)
      })
};

document.getElementById(`back`).onclick = function() {
    window.open(`index.html`, "_self");
}