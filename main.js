var modal
var modalContent
var lastNumEggs=-1
var lastNumShrimp=-1
var lastSecondsUntilFull=100
lastHatchTime=0
var eggstohatch1=864
var lastUpdate=new Date().getTime()

function main(){
    console.log('test')
    modal = document.getElementById('myModal');
    modalContent=document.getElementById('modal-internal')
    controlLoop()
    controlLoopFaster()
}

function controlLoop(){
    refreshData()
    setTimeout(controlLoop,2500)
}

function controlLoopFaster(){
    liveUpdateEggs()
    console.log('clf')
    setTimeout(controlLoopFaster,30)
}

function refreshData(){
    var sellsforexampledoc=document.getElementById('sellsforexample')
    marketEggs(function(eggs){
        eggs=eggs/10
        ComputeSell(eggs,function(wei){
                console.log('examplesellprice ',wei)
                sellsforexampledoc.textContent='('+formatEggs(eggs)+' eggs would sell for '+formatEthValue(web3.fromWei(wei,'ether'))+')'
        });
    });
    lastHatch(web3.eth.accounts[0],function(lh){
        lastHatchTime=lh
    });
    TIME_TO_HATCH_1SNAIL(function(eggs){
        eggstohatch1=eggs
    });
    ComputeMyEggs(function(eggs){
        if(lastNumEggs!=eggs){
            lastNumEggs=eggs
            lastUpdate=new Date().getTime()
            updateEggNumber(formatEggs(eggs))

        }
        var timeuntilfulldoc = document.getElementById('timeuntilfull');
        secondsuntilfull = eggstohatch1 - eggs/lastNumShrimp;
        console.log('secondsuntilfull ',secondsuntilfull,eggstohatch1,eggs,lastNumShrimp);
        lastSecondsUntilFull=secondsuntilfull;
        timeuntilfulldoc.textContent = secondsToString(secondsuntilfull);
        if(lastNumShrimp==0){
            timeuntilfulldoc.textContent='?'
        }
    });
    GetMySnail(function(shrimp){
        lastNumShrimp=shrimp
        var gfsdoc=document.getElementById('getfreeshrimp')
        if(shrimp>0){
            gfsdoc.style.display="none"
        }
        else{
            gfsdoc.style.display="inline-block"
        }
        var allnumshrimp=document.getElementsByClassName('numshrimp')
        for(var i=0;i<allnumshrimp.length;i++){
            if(allnumshrimp[i]){
                allnumshrimp[i].textContent=translateQuantity(shrimp,0)
            }
        }
        var productiondoc=document.getElementById('production')
        productiondoc.textContent=formatEggs(lastNumShrimp*60*60)
    });
    updateBuyPrice();
    updateSellPrice();
	updateSnailPot();
	updateTreePot();
	updateAcornPriceBuy();
	updateAcornPriceSell();
	updateSnailmasterReq();
	updateSpiderReq();
	updateSquirrelReq();
	updateTadpoleReq();
	updateAcorns();
	updatePlayerEarnings();
	//updateCurrentSnailmaster()
	//updateCurrentSpider()
	//updateCurrentSquirrel()
	//updateCurrentTadpole()
    //var prldoc = document.getElementById('playerreflink'); 
	//prldoc.textContent = window.location.protocol + '//' + window.location.host + window.location.pathname + "?ref=" + web3.eth.accounts[0]; 
	//var copyText = document.getElementById("copytextthing"); 
	//copyText.value = prldoc.textContent;

}

function updateEggNumber(eggs){
    var hatchshrimpquantitydoc = document.getElementById('hatchshrimpquantity')
    hatchshrimpquantitydoc.textContent = translateQuantity(eggs,0)
    var allnumeggs = document.getElementsByClassName('numeggs')
    for(var i=0 ; i<allnumeggs.length ; i++){
        if(allnumeggs[i]){
            allnumeggs[i].textContent=translateQuantity(eggs);
        }
    }
}

function hatchEggs1(){
    var ethtospenddoc=0.0004//document.getElementById('freesnailspend')
    weitospend=web3.toWei(ethtospenddoc,'ether')
    HatchEggs(weitospend,function(){
        displayTransactionMessage();
    });
}

function liveUpdateEggs(){
    if(lastSecondsUntilFull>1 && lastNumEggs>=0 && lastNumShrimp>0 && eggstohatch1>0){
        currentTime = new Date().getTime()
        if(currentTime/1000-lastHatchTime>eggstohatch1){
            return;
        }
        difference = (currentTime - lastUpdate) / 1000;
        additionalEggs = Math.floor(difference * lastNumShrimp);
        updateEggNumber((lastNumEggs + additionalEggs) / eggstohatch1);//formatEggs(lastNumEggs+additionalEggs))
    }
}

function updateSellPrice(){
    var eggstoselldoc=document.getElementById('sellprice')
    //eggstoselldoc.textContent='?'
   ComputeMyEggs(function(eggs){
        ComputeSell(eggs,function(wei){
               console.log('sellprice ',wei)
               eggstoselldoc.textContent=formatEthValue(web3.fromWei(wei,'ether'))
        });
   });
}

function updateBuyPrice(){
    var eggstobuydoc=document.getElementById('eggstobuy')
    //eggstobuydoc.textContent='?'
    var ethtospenddoc=document.getElementById('ethtospend')
    weitospend=web3.toWei(ethtospenddoc.value,'ether')
    ComputeBuy(weitospend,function(eggs){ 
            eggstobuydoc.textContent=formatEggs(eggs)
    });
}
/*
function updateAcornPriceBuy(){
    var acornstobuydoc = document.getElementById('acornstobuy')
    //eggstobuydoc.textContent='?'
    var ethtobuyacornsdoc=document.getElementById('ethtobuyacorns')
    weitospend=web3.toWei(ethtobuyacornsdoc.value,'ether')	
	ComputeAcornPrice(function(acorns){ 
            acornstobuydoc.textContent = acorns * acornstobuydoc;
    });
}
*/

var treepot = 314;
var acornprice = 1;

function updateAcornPriceBuy(){
    var acornstobuydoc = document.getElementById('acornstobuy')
    var ethtobuyacorndoc=document.getElementById('ethtobuyacorn')
	var currentacornprice = acornprice;
	acornstobuydoc.textContent = currentacornprice * ethtobuyacorndoc.value;
    }

function updateAcornPriceSell(){
    var ethforacornsdoc=document.getElementById('ethforacorns')
    var acornstoselldoc=document.getElementById('acornstosell')
    var currentacornprice = acornprice; //web3.fromWei(ComputeAcornPrice(),'ether')
    ethforacornsdoc.textContent = currentacornprice * acornstoselldoc.value;
    }

function updateAcorns(){
	var playeracornsdoc=document.getElementById('playeracorns');
	var totalacornsdoc=document.getElementById('totalacorns');
	var percentacornsdoc = document.getElementById('percentacorns');
	GetMyAcorn(function(req) {
		playeracornsdoc.textContent = translateQuantity(req, 0);
	});
	totalAcorns(function(req) {
		totalacornsdoc.textContent = translateQuantity(req, 0);
	});
	var acornratio = playeracornsdoc.value / totalacornsdoc.value;
	percentacornsdoc.textContent = acornratio * 100;
	acornprice = acornratio * treepot;
}

/*
function updateAcornPriceSell(){
    var ethforacornsdoc=document.getElementById('ethforacorns')
    //eggstobuydoc.textContent='?'
    var acornstoselldoc=document.getElementById('acornstosell')
    weitospend=web3.toWei(ethtobuyacornsdoc.value,'ether')
    ComputeAcornPrice(function(acorns){ 
            ethforacornsdoc.textContent = acorns ;
    });
}
*/

function updatePlayerEarnings(){
	var numearningsdoc = document.getElementById('numearnings')
	GetMyEarning(function(req) {
		numearningsdoc.textContent = formatEthValue(web3.fromWei(req,'ether'));
	});
}

function updateSnailPot(){
    var snailpotdoc=document.getElementById('snailpot')
	snailPot(function(req) {
		snailpotdoc.textContent = formatEthValue(web3.fromWei(req,'ether'));
	});
}

function updateTreePot(){
    var treepotdoc=document.getElementById('treepot')
	treePot(function(req) {
		treepotdoc.textContent = formatEthValue(web3.fromWei(req,'ether'));
	});
	treepot = treepotdoc.textContent;
}

function updateSnailmasterReq(){
    var snailmasterpricedoc=document.getElementById('snailmasterreq')
	snailmasterReq(function(req) {
		snailmasterpricedoc.textContent = translateQuantity(req, 0);
	});
}

function updateSpiderReq(){
    var spiderreqdoc=document.getElementById('spiderreq')
	spiderqueenReq(function(req) { // CHANGE TO spiderReq FOR MAINNET
		spiderreqdoc.textContent = translateQuantity(req, 0);
	});
}

function updateSquirrelReq(){
    var squirrelreqdoc=document.getElementById('squirrelreq')
	squirrelReq(function(req) {
		squirrelreqdoc.textContent = translateQuantity(req, 0);
	});
}

function updateTadpoleReq(){
    var tadpolereqdoc=document.getElementById('tadpolereq')
	tadpoleReq(function(req) {
		tadpolereqdoc.textContent = formatEthValue(web3.fromWei(req,'ether'));
	});
}

/*
function updateCurrentSnailmaster(){
    var currentsnailmasterdoc=document.getElementById('currentsnailmaster')
    ceoAddress(function(address) {
		//currentsnailmaster.textContent=address;
	});
}
*/

function getFreeShrimp2(){
    var ethtospenddoc=0.002//document.getElementById('freesnailspend')
    weitospend=web3.toWei(ethtospenddoc,'ether')
    BuyStartingSnails(weitospend,function(){
        displayTransactionMessage();
    });
}
	
function buyEggs2(){
    var ethtospenddoc=document.getElementById('ethtospend')
    weitospend=web3.toWei(ethtospenddoc.value,'ether')
    BuyEggs(weitospend,function(){
        displayTransactionMessage();
    });
}

function buyAcorns2(){
    var ethtobuyacorndoc=document.getElementById('ethtobuyacorn')
    weitospend=web3.toWei(ethtobuyacorndoc.value,'ether')
    BuyAcorns(weitospend,function(){
        displayTransactionMessage();
    });
}

function sellAcorns2(){
    var acornstoselldoc = document.getElementById('acornstosell')
    acornssold = acornstoselldoc.value;
    SellAcorns(acornssold,function(){
        displayTransactionMessage();
    });
}

function buyTadpole(){
    var ethtospenddoc=document.getElementById('tadpolepotato')
    weitospend=web3.toWei(ethtospenddoc.value,'ether')
    BecomeTadpolePrince(weitospend,function(){
        displayTransactionMessage();
    });
}

function formatEggs(eggs){
    return translateQuantity(eggs/eggstohatch1)
}

function translateQuantity(quantity,precision){
    quantity=Number(quantity)
    finalquantity=quantity
    modifier=''
    if(precision == undefined){
        precision=0
        if(quantity<10000){
            precision=1
        }
        if(quantity<1000){
            precision=2
        }
        if(quantity<100){
            precision=3
        }
        if(quantity<10){
            precision=4
        }
    }
    //console.log('??quantity ',typeof quantity)
    if(quantity>1000000){
        modifier='M'
        finalquantity=quantity/1000000
		precision=2
    }
    if(quantity>1000000000){
        modifier='B'
        finalquantity=quantity/1000000000
		precision=2
    }
    if(quantity>1000000000000){
        modifier='T'
        finalquantity=quantity/1000000000000
		precision=2
    }
    if(precision==0){
        finalquantity=Math.floor(finalquantity)
    }
    return finalquantity.toFixed(precision)+modifier;
}

function removeModal(){
        modalContent.innerHTML=""
        modal.style.display = "none";
}
function displayTransactionMessage(){
    displayModalMessage("Transaction Submitted. This can take a moment depending on the state of the Ethereum Network.")
}

function displayModalMessage(message){
    modal.style.display = "block";
    modalContent.textContent=message;
    setTimeout(removeModal,3000)
}

function weiToDisplay(ethprice){
    return formatEthValue(web3.fromWei(ethprice,'ether'))
}

function formatEthValue(ethstr){
    return parseFloat(parseFloat(ethstr).toFixed(5));
}

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

function copyRef() {
  var copyText = document.getElementById("copytextthing");
  copyText.style.display="block"
  copyText.select();
  document.execCommand("Copy");
  copyText.style.display="none"
  displayModalMessage("copied link to clipboard")
  //alert("Copied the text: " + copyText.value);
}

function secondsToString(seconds)
{
    seconds=Math.max(seconds,0)
    var numdays = Math.floor(seconds / 86400);

    var numhours = Math.floor((seconds % 86400) / 3600);

    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);

    var numseconds = ((seconds % 86400) % 3600) % 60;
    var endstr=""
    //if(numdays>0){
    //    endstr+=numdays + " days "
    //}
    
    return numhours + "h " + numminutes + "m "//+numseconds+"s";
}

function disableButtons(){
    var allnumshrimp=document.getElementsByClassName('btn-lg')
    for(var i=0;i<allnumshrimp.length;i++){
        if(allnumshrimp[i]){
            allnumshrimp[i].style.display="none"
        }
    }
}

function enableButtons(){
    var allnumshrimp=document.getElementsByClassName('btn-lg')
    for(var i=0;i<allnumshrimp.length;i++){
        if(allnumshrimp[i]){
            allnumshrimp[i].style.display="inline-block"
        }
    }
}

web3.version.getNetwork((err, netId) => {
    if(netId!="3"){
        displayModalMessage("Please switch to Ropsten for testing "+netId)
        disableButtons()
    }
    /*
  switch (netId) {
    case "1":
      console.log('This is mainnet')
      break
    case "2":
      console.log('This is the deprecated Morden test network.')
      break
    case "3":
      console.log('This is the ropsten test network.')
      break
    default:
      console.log('This is an unknown network.')
      
  }*/
})
