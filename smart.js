var mqtt=require('mqtt');
var five = require("johnny-five");
var cliente=mqtt.connect('mqtt://broker.mqttdashboard.com',{clientId:'par-xyz-009-sub'});
var board = new five.Board();
var ThingSpeakClient=require("thingspeakclient");
var clienteThingSpeak=new ThingSpeakClient();
var CHANNELID=494699;
var API_KEY = "WNLXNUAU2G1EXU0K";
var porta = false; 

clienteThingSpeak.attachChannel(CHANNELID,
    { writeKey: API_KEY }, retornoThingSpeak
);

cliente.on('connect',function(){
    cliente.subscribe('smarthouse/par/led3');
    cliente.subscribe('smarthouse/par/servoA1');
    console.log('Conectou mqtt');

  
});

board.on("ready", function () {
    console.log('Conectou com Arduino');
    // var led1 = new five.Led(2);
    // var led2 = new five.Led(3);
    var led3 = new five.Led(4);
    // var servoS1 = new five.Servo({pin: 5}); // pwm
    var servoA1 = new five.Servo({pin: 6}); // pwm 
     /* var sensorDistancia = new five.Proximity({controller: "HCSR04", pin: 7}); */
    var sensorChama = new five.Sensor({pin: "A1", freq: 5000});

    cliente.on('message',function(topic,message,pacote){
        var comando=message.toString();
        console.log(comando);
        if (topic == 'smarthouse/par/led3') {
            if (comando == 'ON') {
               led3.on();
            } else {
               led3.off();
            }   
            console.log("Led3-" + comando);
        }
        if (topic == 'smarthouse/par/servoA1') {
            if (comando == 'ON') {
                servoA1.to(90, 1000)
            } else {
                servoA1.to(0, 1000)
            }
            console.log("ServoA1-" + comando);
        }
    });
/*
    sensorDistancia.on("data", function () {
        if (this.cm > 15) { 
            if (porta) { 
                servoS1.to(0, 1000); // Fecha porta
                porta = false;
            }
        } else { 
            if (!porta) {
                servoS1.to(90, 1000); // Abre porta
                porta = true;
            }     
        }
    });     
  */
    var temp=20;
    setInterval(function () {
        clienteThingSpeak.updateChannel(CHANNELID, { field1: temp }, retornoThingSpeak);
        temp=getRandomInt(1024);
    },5000);
    
    sensorChama.on("change",function(){
        var dado = this.scaleTo(0, 100);
        console.log(dado);
        if (dado != null) {
            if (dado > 25) { 
                // alertaFogo
                clienteThingSpeak.updateChannel(CHANNELID, { field2: dado }, retornoThingSpeak);
                led1.on();
                led2.off();
                console.log("Temperatura maior que 25C");
            } else { 
                // temperatura
                clienteThingSpeak.updateChannel(CHANNELID, { field1: dado }, retornoThingSpeak);
                led1.off();
                led2.on();
                console.log(dado);
            }
        } 
    });

    this.on("exit",function(){
        led1.off();
        led2.off();
        led3.off();
        sensorChama.disable();
    });
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function retornoThingSpeak(error,response){
	if (!error && response>0){
		console.log("Conectou");
	}else{
		console.log(error);
	}
}