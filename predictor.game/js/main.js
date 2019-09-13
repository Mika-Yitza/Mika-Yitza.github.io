import * as data from './RWC2019Predictor.js'

const appbaseRef = Appbase({
	url: 'https://scalr.api.appbase.io',
	app: 'RWC2019PointsTable',
	credentials: 'NS8mA0TkJ:2f5b1e35-d02b-4807-9c6a-a751390998f9',
});

let array = [];
const top = document.getElementById("top10");
const odds = document.getElementById("odds");
const img = [];
for(let x=0; x<3; x++){
    img[x] = document.createElement(`img`);
    img[x].id = `img${x}`;
    img[x].src = "https://banner2.kisspng.com/20180714/efc/kisspng-2019-rugby-world-cup-2007-rugby-world-cup-2017-wor-trophy-globe-5b4a66a43ef0c2.2755513615316025962578.jpg";
    img[x].classList.add("image");
}

window.onload = function() {
    appbaseRef.search({
        type: "doc",
            body: {
                size : 100,
                query: {
                    match_all: {},
                },
            }
      }).then(function(response) {
        console.log(response);
        array = response.hits.hits;
        for(let x=0; x<array.length; x++){
            if(array[x]._id == "AWzYS72NuDNiuUUj251k"){
                array.splice(x, 1);
            }
        }

        for (let i=0; i<array.length; i++){
            for(let j=0; j<array.length-1; j++){
                if(array[j]._source.score < array[j+1]._source.score){
                        let temp = array[j+1];
                        array[j+1] = array[j];
                        array[j] = temp;
                 }
            }
        }
        const size = array.length >= 10 ? 10 : array.length;
        let row, cell0, cell1, cell2;
        for(let k=0; k<size; k++){
            row = top.insertRow(k+2);
            cell0 = row.insertCell(0);
            cell1 = row.insertCell(1);
            cell2 = row.insertCell(2);
            cell0.innerHTML = k+1;
            cell1.innerHTML = array[k]._source.name;
            cell2.innerHTML = array[k]._source.score;
        }
      }).catch(function(error) {
        alert(error)
      })
    
    let oddsRow, oddsCell0, oddsCell1, oddsCell2, oddsCell3, oddsCell4, oddsCell5, oddsCell6;
    for(let t=0; t<data.teams.length; t++){
        oddsRow = odds.insertRow(t+1);
        oddsCell0 = oddsRow.insertCell(0);
        oddsCell1 = oddsRow.insertCell(1);
        oddsCell2 = oddsRow.insertCell(2);
        oddsCell3 = oddsRow.insertCell(3);
        oddsCell4 = oddsRow.insertCell(4);
        oddsCell5 = oddsRow.insertCell(5);
        oddsCell6 = oddsRow.insertCell(6);
        oddsCell0.innerHTML = data.teams[t].name;
        oddsCell0.classList.add(`${data.teams[t].id}`);
        oddsCell1.innerHTML = data.teams[t].id;
        for(let a=0; a<data.teams[t].rwcwins; a++){
            oddsCell2.innerHTML += img[a].outerHTML;
        }
        oddsCell3.innerHTML = data.teams[t].oddsfra;
        oddsCell4.innerHTML = data.teams[t].oddsdec;
        oddsCell5.innerHTML = data.teams[t].rank;
        switch(true){
            case (data.teams[t].rank == 1): {
                oddsCell6.innerHTML = "Winner";
                break;
            };
            case (data.teams[t].rank == 2): {
                oddsCell6.innerHTML = "Runner Up";
                break;
            };
            case (data.teams[t].rank == 3): {
                oddsCell6.innerHTML = "Bronze Medal";
                break;
            };
            case (data.teams[t].rank == 4): {
                oddsCell6.innerHTML = "4th place";
                break;
            };
            case (data.teams[t].rank <= 8): {
                oddsCell6.innerHTML = "Quater finalist";
                break;
            };
            default: {
                oddsCell6.innerHTML = "Group Stage";
            };
        }

        
    }

};

document.getElementById(`login`).onclick = function() {
    const name = document.getElementById("name").value;
    const pass = document.getElementById("pass").value;
    let found = false;
    for (let i=0; i<array.length; i++){
            if(array[i]._source.name == name){
                if(array[i]._source.password == pass){
                    if(array[i]._source.pointssubmitted === false){
                         window.open(`play.html?id=${array[i]._id}`, "_self");
                    }
                    else{
                        alert("You have already sent us your predictions.");
                    }
                }
                else{
                alert("Incorrect password.");
                }
                found = true;
            }
        }
    if(!found){
        alert("Player doesn't exist.");
    }
};