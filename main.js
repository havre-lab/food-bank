var mainCanvas=document.getElementById("drawing");
var ctx=mainCanvas.getContext("2d");
var totalPercent=0;
var displayPercent=0;
var inputBar=document.getElementById("inputbar")
var tempRed,tempBlue,tempGreen,tempColor;
var gravity=0.5;

//unblur inputbar
inputBar.focus()

var confettum=[]

const multBase=6.05//6.05 as 1.00 for top bit, 0.5 radius of curve

class ConFetti{
    constructor(x,y,sx,sy,color){
        this.x=x
        this.y=y
        this.sx=sx
        this.sy=sy
        this.color=color
        this.size=10
    }
    update(){
        this.x+=this.sx
        this.y+=this.sy
        this.sy+=gravity
        ctx.fillStyle=this.color;
        ctx.fillRect(this.x,this.y,this.size,this.size)
    }
}

function greyPen(lineWidth=10){
    ctx.strokeStyle="grey";
    ctx.lineWidth=lineWidth;
}

function drawStuff(timestamp){
    //

    //1000 size canvas
    var prevTime=timestamp
    var currentTime=performance.now()
    delta=(currentTime-prevTime)/(1000/60)
    
    displayPercent+=(totalPercent-displayPercent)/(32)

    ctx.clearRect(0,0,1000,1000)
    
    //calculate color
    if(displayPercent>100){
        tempColor="red"
    }else{
        tempRed=displayPercent/100*255
        tempBlue=255-tempRed
        tempGreen=255/2*Math.log2(100-displayPercent)
        tempColor="rgb("+tempRed+","+tempGreen+","+tempBlue+")"
    }
    

    // prepping the small pen
    greyPen()
    ctx.font="40px Arial"
    ctx.textAlign="right"
    ctx.fillStyle=tempColor
    //755 base
    
    var tempDistance=displayPercent*multBase
    var topBit=0; 
    if(tempDistance>100*multBase){
        topBit=tempDistance-100*multBase
        tempDistance=100*multBase
        if(topBit>110*multBase){
            topBit=110*multBase
        }
    }
    ctx.fillRect(450,755,100,50)
    ctx.fillRect(450,755-tempDistance,100,tempDistance)
    if(displayPercent>=100){
        ctx.beginPath()
        ctx.arc(500,150,50,Math.PI,0)
        ctx.fill()
        ctx.clearRect(450,100,100,50-topBit)
    }


    ctx.fillStyle="slateblue"
    for(var i=0; i<=100; i+=20){
        ctx.beginPath()
        ctx.moveTo(450,755-(i*multBase))
        ctx.lineTo(400,755-(i*multBase))
        ctx.stroke()
        ctx.fillText(i+"%",390,755-(i*multBase)+10)
        ctx.fill()
        
    }
    

    //prepping the pen
    greyPen()
    ctx.fillStyle=tempColor
    //rectangle
    ctx.beginPath()
    ctx.moveTo(450,850);
    ctx.lineTo(450,150);
    ctx.stroke();
    ctx.beginPath()
    ctx.moveTo(550,850);
    ctx.lineTo(550,150);
    ctx.stroke();
   
    ctx.beginPath();
    ctx.arc(500,150,50,Math.PI,0)
    ctx.stroke();
    
    

    //circle
    ctx.beginPath()
    ctx.arc(500,850,100,Math.PI*2,0)
    ctx.fill();
    ctx.stroke();
    
    
    
    

    //shiny glint
    ctx.strokeStyle="white";
    ctx.lineWidth=10;
    if(tempDistance>40){
        ctx.beginPath()
        ctx.moveTo(530,755-20)
        if(topBit<multBase*5){
           ctx.lineTo(530,755-(tempDistance+topBit)+20) 
        }else{
            ctx.lineTo(530,755-(tempDistance+multBase*5)+20) 
        }
        
        ctx.stroke();
    }
    ctx.beginPath()
    ctx.arc(500,850,75,Math.PI*1.7,Math.PI*2.3)
    ctx.stroke();

    //confetti

    for(var i=0; i<confettum.length; i++){
        confettum[i].update()
    }
    //confettum adding
    if(confettum.length==0 && displayPercent>=99){
        for(var i=0; i<3000; i++){
            var tempConfColor;
            switch(i%7){
                case 0: tempConfColor="red"; break
                case 1: tempConfColor="yellow"; break
                case 2: tempConfcolor="green";break
                case 3: tempConfColor="blue";break
                case 4: tempConfColor="purple";break
                case 5: tempConfColor="orange";break
                case 6: tempConfColor="pink";break
            }
            confettum.push(new ConFetti(500,1000,Math.random()*40-20,Math.random()*-50,tempConfColor));
        }
    }
    


    requestAnimationFrame(drawStuff);
}


function numberAffect(){
    if(inputBar.value.charAt(inputBar.value.length-1)=="%"){
        inputBar.value=inputBar.value.substring(0,inputBar.value.length-1)
    }

    if(!isNaN(parseFloat(inputBar.value))){
        totalPercent+=parseFloat(inputBar.value)   
    }inputBar.value="";

    
}

document.addEventListener("keypress",function(ev){
    if(ev.key=="Enter"){
        numberAffect();
    }
})
inputBar.addEventListener("blur",function(){
    setTimeout(function(){inputBar.focus()},0)
})

requestAnimationFrame(drawStuff);