import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

//declaro as variaveis
let cardsData;
let dataCol;
let dataRow;
let score=1000;
let recordVal=localStorage.getItem("record");
let nCards;
//localStorage["record"]=0; //quest serve per azzerare il record

$(document).ready(()=>{      //chiamata ad un api esterna, in questo caso un file json
  $('#score').text("Score: " + score);
  $('#record').text("Record: " + recordVal);
  fetch('http://localhost:3000/cards')//dopo che trovaerà il file
  .then((result)=>result.json())//lo metterà nel result, con result.json mi prenderò solo il file json
  .then((data) => {
      cardsData = data.cardList;
      dataCol = data.nCols;
      dataRow = data.nRows;
      //console.log(cardsData);
      createCardsData(data);
      clickCard();
  }) 
});

const shakeCards= () => {
  let random = 0;
  let aux = 0;
  nCards = dataRow * dataCol;//invece di usare lenght calcolo il num di carte giocabile per n avere rischio di caricare carte non accopiate
  for(let i = 0; i <nCards; i++){
    random = Math.floor(Math.random()*nCards);
    aux = cardsData[i];
    cardsData[i]= cardsData[random];
    cardsData[random]= aux;
  }
}

const createCardsData = (data) =>{
    shakeCards();//assim chamo shuffle com cartas apenas criadas ja faco shuffle do cards Data e n do json
   const cardList = cardsData;
   const nCols = dataCol;
   const nRows = dataRow;
   //console.log(cardList);
   //console.log("righe: " + nRows + " colonne: " + nCols);
   let boardHtml ="";

   for(let i =0; i < nRows; i++) //com un for coloca td dentro de boardHtml
   {
       boardHtml += `<div class="row">`;
      
       for(let j=0; j < nCols; j++){
           boardHtml += `<div class="col m-3 d-flex">`
           console.log(cardList[(i*nCols)+j].seed);
           boardHtml += `
           <div class="d-flex justify-content-center">
               <div class="whiteCard d-flex justify-content-center" style="background-image:url(${data.frontCover})">
                    <div class="cardValue" value=${cardList[(i*nCols)+j].value} style="background-image:url(${cardList[(i*nCols)+j].backCover})"></div>                    
               </div>
           </div>
           `;
           boardHtml += `</div>`;
       }
       boardHtml += `</div>`;
   }
   $('#board').append(boardHtml);
}

//funcao que gira cartas
function clickCard (){ 
let waitHiding=false; 
let cardVal1=0;
let cardVal2=0;
let firstCard;
let secondCard;
let countCouple=0; //varibile che conta le coppie e usata salvattaggio  
$('.whiteCard').on('click',(item)=>{
  if($(item.currentTarget).children().is(':hidden') && waitHiding==false){
    $(item.currentTarget).children().show();
    if(cardVal1==0 && cardVal2==0){
      cardVal1 = $(item.currentTarget).children()[0].attributes[1].nodeValue;
      firstCard = $(item.currentTarget).children();
    }
    else if(cardVal1!= 0 && cardVal2==0){
      cardVal2 = $(item.currentTarget).children()[0].attributes[1].nodeValue;
      secondCard = $(item.currentTarget).children();
      if(cardVal1==cardVal2){      //Controllo se carte sono uguali //aki devemos controlar con un cont o numero di duplas
        countCouple +=1;
        console.log(countCouple);
        if(countCouple >= nCards/2){  //uso nCards pq tem o prblema do Resposive se cambia il numero di collone json
          if(score > recordVal){
            recordVal=score;
            $('#record').text("Record: " + recordVal);
          }
          localStorage["record"]=recordVal;
          alert("Hai vinto!!!");
        }
        cardVal1=0
        cardVal2=0
      }
      else{       
        waitHiding=true;
        setTimeout(function(){
          cardVal1=0
          cardVal2=0
          firstCard.hide();
          secondCard.hide(); 
          waitHiding=false;
          if(score>5){
            score -= 5
            $('#score').text("Score: " + score);
          }
          else{
            alert("Hai perso!!!");
            //mettere refresh della page

          }
        },1000)    
      }
    }
  }
 });
 
 }

 