import * as data from './RWC2019Predictor.js'

const play = document.getElementById("play");
let minus = [];
let points = [];
let plus = [];
let details = [];
let total = 0;
let lastID;

const img = [];
for(let x=0; x<3; x++){
    img[x] = document.createElement(`img`);
    img[x].id = `img${x}`;
    img[x].src = "https://banner2.kisspng.com/20180714/efc/kisspng-2019-rugby-world-cup-2007-rugby-world-cup-2017-wor-trophy-globe-5b4a66a43ef0c2.2755513615316025962578.jpg";
    img[x].classList.add("image");
}

const appbaseRef = Appbase({
	url: 'https://scalr.api.appbase.io',
	app: 'RWC2019PointsTable',
	credentials: 'NS8mA0TkJ:2f5b1e35-d02b-4807-9c6a-a751390998f9',
});

window.onload = function() {    
    let playRow, playCell0, playCell1, playCell2, playCell3, playCell4, playCell5, playCell6, playCell7;
    for(let t=0; t<data.teams.length; t++){
        minus[t] = document.createElement(`button`);
        minus[t].innerHTML = "-";
        minus[t].id = `minus${t}`;
        points[t] = document.createElement(`center`);
        points[t].innerHTML = 0;
        points[t].id = `points${t}`;
        plus[t] = document.createElement(`button`);
        plus[t].innerHTML = "+";
        plus[t].id = `plus${t}`;
        details[t] = document.createElement(`button`);
        details[t].innerHTML = "More details";
        details[t].id = `details${t}`;
        playRow = play.insertRow(t+1);
        playCell0 = playRow.insertCell(0);
        playCell1 = playRow.insertCell(1);
        playCell2 = playRow.insertCell(2);
        playCell3 = playRow.insertCell(3);
        playCell4 = playRow.insertCell(4);
        playCell5 = playRow.insertCell(5);
        playCell6 = playRow.insertCell(6);
        playCell7 = playRow.insertCell(7);
        playCell0.innerHTML = data.teams[t].name;
        playCell0.classList.add(`${data.teams[t].id}`);
        for(let a=0; a<data.teams[t].rwcwins; a++){
            playCell1.innerHTML += img[a].outerHTML;
        }
        playCell2.innerHTML = data.teams[t].oddsfra;
        switch(true){
            case (data.teams[t].rank == 1): {
                playCell3.innerHTML = "Winner";
                break;
            };
            case (data.teams[t].rank == 2): {
                playCell3.innerHTML = "Runner Up";
                break;
            };
            case (data.teams[t].rank == 3): {
                playCell3.innerHTML = "Bronze Medal";
                break;
            };
            case (data.teams[t].rank == 4): {
                playCell3.innerHTML = "4th place";
                break;
            };
            case (data.teams[t].rank <= 8): {
                playCell3.innerHTML = "Quater finalist";
                break;
            };
            default: {
                playCell3.innerHTML = "Group Stage";
            };
        }

        playCell4.innerHTML = minus[t].outerHTML;
        minus[t].onclick = function() {
            if(points[t].innerHTML > 0){
                points[t].innerHTML -= 1;
            }
        };
        playCell5.innerHTML = points[t].outerHTML;
        playCell6.innerHTML = plus[t].outerHTML;
        playCell7.innerHTML = details[t].outerHTML;
    }

    for(let i=0; i<data.teams.length; i++){
        document.getElementById(`minus${i}`).onclick = function() {
            if(document.getElementById(`points${i}`).innerHTML > 0){
                document.getElementById(`points${i}`).innerHTML = parseInt(document.getElementById(`points${i}`).innerHTML) - 1;
                total--;
                document.getElementById(`totalPoints`).innerHTML = total;
            }
        };
    }

    for(let i=0; i<data.teams.length; i++){
        document.getElementById(`plus${i}`).onclick = function() {
            if(total < 10){
                document.getElementById(`points${i}`).innerHTML = parseInt(document.getElementById(`points${i}`).innerHTML) + 1;
                total++;
                document.getElementById(`totalPoints`).innerHTML = total;
            }
            else{
                alert("You can only spend 10 points.")
            }
        };
    }

    for(let i=0; i<data.teams.length; i++){
        document.getElementById(`details${i}`).onclick = function() {
            if(lastID){
                document.getElementById(`details`).classList.remove(`${lastID}`);
            }
            document.getElementById(`details`).classList.add(`${data.teams[i].id}`);
            lastID = data.teams[i].id;
            document.getElementById(`title`).innerHTML = data.teams[i].name;
            document.getElementById(`cups`).innerHTML = "World Cups won: "+ data.teams[i].rwcwins;
            document.getElementById(`description`).innerHTML = data.teams[i].description;
            document.getElementById(`odds`).innerHTML = "Odds: " + data.teams[i].oddsfra + "</br>";
            let m=1;
            while(data.teams[i][`multiplier${m}`]){
                let position;
                switch(m){
                    case 1:{
                        position = "Winner";
                        break;
                    };
                    case 2:{
                        position = "Runner Up";
                        break;
                    };
                    case 3:{
                        position = "Bronze";
                        break;
                    };
                    default:{
                        position = m + "th place"
                    }
                }
                document.getElementById(`odds`).innerHTML += "</br>" + position + " : " + data.teams[i][`multiplier${m}`] + " points for every point spent";
                m++;
            }
            switch(data.teams[i].group){
                case "A": {
                    document.getElementById(`playImg`).src = "https://www.snack-media.com/wp-content/uploads/2019/03/2019-03-29-1.jpg";
                    break;
                };
                case "B": {
                    document.getElementById(`playImg`).src = "https://cdn.snack-media.com/wp-content/uploads/2019/04/b.jpg";
                    break;
                };
                case "C": {
                    document.getElementById(`playImg`).src = "https://www.snack-media.com/wp-content/uploads/2019/04/2019-04-26-2.jpg";
                    break;
                };
                case "D": {
                    document.getElementById(`playImg`).src = "https://www.snack-media.com/wp-content/uploads/2019/05/2019-05-08.jpg";
                    break;
                };
                
            }

        };
    }
};

document.getElementById(`rules`).onclick = function() {
    document.getElementById(`details`).classList.remove(`${lastID}`);
    document.getElementById(`title`).innerHTML = "Rules";
    document.getElementById(`cups`).innerHTML = "10 points available.";
    document.getElementById(`description`).innerHTML = "Use your points wisely and predict which teams will exceed expectations.";
    document.getElementById(`odds`).innerHTML = `Click "More details" for extra info related to each team.`;
    document.getElementById(`playImg`).src = "https://media.giphy.com/media/l0MYtXPklAUqPUGFW/giphy.gif";
};

document.getElementById(`submit`).onclick = function() {
    if(total == 10){
        const url = window.location.href;
        const id = url.split("=")[1];
        appbaseRef
        .update({
            type: 'doc',
            id: id,
            body: {
                doc: {
                    NZ: parseInt(document.getElementById(`points0`).innerHTML),
                    SA: parseInt(document.getElementById(`points1`).innerHTML),
                    ENG: parseInt(document.getElementById(`points2`).innerHTML),
                    IRE: parseInt(document.getElementById(`points3`).innerHTML),
                    WAL: parseInt(document.getElementById(`points4`).innerHTML),
                    AUS: parseInt(document.getElementById(`points5`).innerHTML),
                    FRA: parseInt(document.getElementById(`points6`).innerHTML),
                    ARG: parseInt(document.getElementById(`points7`).innerHTML),
                    SCO: parseInt(document.getElementById(`points8`).innerHTML),
                    JPN: parseInt(document.getElementById(`points9`).innerHTML),
                    FIJ: parseInt(document.getElementById(`points10`).innerHTML),
                    GRG: parseInt(document.getElementById(`points11`).innerHTML),
                    ITA: parseInt(document.getElementById(`points12`).innerHTML),
                    SAM: parseInt(document.getElementById(`points13`).innerHTML),
                    TON: parseInt(document.getElementById(`points14`).innerHTML),
                    USA: parseInt(document.getElementById(`points15`).innerHTML),
                    CAN: parseInt(document.getElementById(`points16`).innerHTML),
                    RUS: parseInt(document.getElementById(`points17`).innerHTML),
                    URU: parseInt(document.getElementById(`points18`).innerHTML),
                    NAM: parseInt(document.getElementById(`points19`).innerHTML),
                    pointssubmitted: true
                },
            },
        })
        .then(function(res) {
            console.log('successfully updated: ', res);
            window.setTimeout(function(){
                window.open(`predictions.html`, "_self");
            }, 3000);
        })
        .catch(function(err) {
            console.log('update document error: ', err);
        });
    }
    else{
        alert("You need to have used all your 10 points before submitting.")
    }
};