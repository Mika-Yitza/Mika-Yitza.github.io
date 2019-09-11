import * as data from './RWC2019Predictor.js'

const admin = document.getElementById("admin");
const top = document.getElementById("admin2");

let array = [];
let results = [];
let finalResult;

const appbaseRef = Appbase({
	url: 'https://scalr.api.appbase.io',
	app: 'RWC2019PointsTable',
	credentials: 'NS8mA0TkJ:2f5b1e35-d02b-4807-9c6a-a751390998f9',
});

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
        let adminRow, adminCell0, adminCell1;
        for(let t=0; t<array.length; t++){
            if(array[t]._id == "AWzYS72NuDNiuUUj251k"){
                let x=1;
                for(let prop in array[t]._source){
                    if(array[t]._source[prop] >= 0 && prop !== "pointssubmitted" && prop !== "score"){
                        results[x] = document.createElement(`input`);
                        results[x].id = `result${x}`;
                        adminRow = admin.insertRow(x);
                        adminCell0 = adminRow.insertCell(0);
                        adminCell1 = adminRow.insertCell(1);
                        adminCell0.innerHTML = prop;
                        adminCell1.innerHTML = results[x].outerHTML;
                        document.getElementById(`result${x}`).value = array[t]._source[prop];
                        x++;
                    }
                }
                finalResult = array[t];
                array.splice(t, 1);
            }
        }

        let row, cell0, cell1;
        for(let k=0; k<array.length; k++){
            row = top.insertRow(k+1);
            cell0 = row.insertCell(0);
            cell1 = row.insertCell(1);
            cell0.innerHTML = array[k]._source.name;
            cell1.innerHTML = array[k]._source.score;
        }
    }).catch(function(error) {
    alert(error)
    })
};

document.getElementById(`results`).onclick = function() {
    appbaseRef
    .update({
        type: 'doc',
        id: "AWzYS72NuDNiuUUj251k",
        body: {
            doc: {
                ARG: document.getElementById(`result1`).value,
                AUS: document.getElementById(`result2`).value,
                CAN: document.getElementById(`result3`).value,
                ENG: document.getElementById(`result4`).value,
                FIJ: document.getElementById(`result5`).value,
                FRA: document.getElementById(`result6`).value,
                GRG: document.getElementById(`result7`).value,
                IRE: document.getElementById(`result8`).value,
                ITA: document.getElementById(`result9`).value,
                JPN: document.getElementById(`result10`).value,
                NAM: document.getElementById(`result11`).value,
                NZ: document.getElementById(`result12`).value,
                RUS: document.getElementById(`result13`).value,
                SA: document.getElementById(`result14`).value,
                SAM: document.getElementById(`result15`).value,
                SCO: document.getElementById(`result16`).value,
                TON: document.getElementById(`result17`).value,
                URU: document.getElementById(`result18`).value,
                USA: document.getElementById(`result19`).value,
                WAL: document.getElementById(`result20`).value,
            },
        },
    })
    .then(function(res) {
        console.log('successfully updated: ', res);
        alert("results updated")
        location.reload();
    })
    .catch(function(err) {
        console.log('update document error: ', err);
    });
};

document.getElementById(`score`).onclick = function() {
    for(let k=0; k<array.length; k++){
        let userScore = 0;
        for(let prop in array[k]._source){
            if(array[k]._source[prop] > 0 && prop !== "pointssubmitted" && prop !== "score"){
                for(let t=0; t<data.teams.length; t++){
                    if(data.teams[t].id == prop){
                        userScore += array[k]._source[prop] * data.teams[t][`multiplier${finalResult._source[prop]}`];
                    }
                }
            }
        }

        appbaseRef
        .update({
            type: 'doc',
            id: array[k]._id,
            body: {
                doc: {
                    score : userScore
                },
            },
        })
        .then(function(res) {
            console.log('successfully updated: ', res);
            if(k==array.length-1){
                alert("results updated")
                location.reload();
            }
        })
        .catch(function(err) {
            console.log('update document error: ', err);
        });
    }
};