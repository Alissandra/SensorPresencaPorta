
#include <Boards.h>
#include <Firmata.h>
#include <FirmataConstants.h>
#include <FirmataDefines.h>
#include <FirmataMarshaller.h>
#include <FirmataParser.h>

#include <NewPing.h>
#include <Servo.h>
#define TRIGGER_PIN 11
#define ECHO_PIN 12
#define MAX_DISTANCE 200
Servo servoS1;
NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);

boolean porta = true;

void setup() {
  Serial.begin(9600);
  servoS1.attach(9);
  servoS1.write(0);
  porta = false;     // true=aberta  false=fechada
}

void loop() {
  unsigned int distanciaS1 = sonar.ping_cm();
  if (distanciaS1 > 0 & distanciaS1 < 15) {
    if (porta) {
      servoS1.write(0);   // Fecha a porta
      porta = false;
    }
  } else {
    if (!porta) {
      servoS1.write(90);  //Abre a porta
      porta = true;
    }
  }
  delay(2000);
  Serial.print(distanciaS1);
  Serial.println("cm");
}





