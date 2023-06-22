let capture
let detector

const MAGGIORE = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",   
]


const CROMATICA = [  
    'B',
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
]


const scalaA = MAGGIORE
const scalaB = CROMATICA

let synth
let reverb


    // SCALA A - B SUONO

function playNota(nota, ottava, nomeScala) {    
    
    if (nomeScala == "laScalaA") {

        const att = 0.05  // attack
        const sus = 0.30  // sustain
        const rel = 0.20  // release
        synth.play(nota + ottava, att, 0, sus, rel)
    }

    else if (nomeScala == "laScalaB") {

        const att = 0.05  // attack
        const sus = 0.30  // sustain
        const rel = 0.20  // release
        synth.play(nota + ottava, att, 0, sus, rel)
    }

    console.log(nomeScala, nota)
}


  // GRANDEZZA CANVAS E SETUP

async function setup() {

	createCanvas(1350, 500)
	background(255)
	noStroke()
	capture = createCapture(VIDEO)
	capture.size(640, 480)
	capture.hide()

	userStartAudio()
    reverb = new p5.Reverb()
    synth = new p5.MonoSynth()
    synth.disconnect()
    synth.connect(reverb)

	console.log("Carico modello...")
	detector = await createDetector()
	console.log("Modello caricato.")

    monoSynth = new p5.MonoSynth();

}



  // DISEGNO E SUONO

async function draw() {

     
	scale (1.88, 1)

	if (detector && capture.loadedmetadata) {
		const hands = await detector.estimateHands(capture.elt, { flipHorizontal: true })
			
		if (hands.length == 1) {

			const manoA = hands[0]

			const dito  = manoA.keypoints[8]
			noStroke()
			// fill (255, 0, 255)
			//ellipse (dito.x, dito.y, 50, 50)
			
			let nota
 
                const passoX = 90
                const passoY = 500/2
                const colonna = floor(dito.x / passoX)
                const riga = floor(dito.y / passoY)
                const grigliaX = colonna * passoX
                const grigliaY = riga * passoY
                rect (grigliaX, grigliaY, passoX, passoY)

            
            
            if (dito.x > 0 && dito.y > 0 && dito.x < width && dito.y < height/2){
            
    
                // Sound
                nota = colonna % scalaA.length
                let ottava = 4 + Math.floor(colonna / scalaA.length)
                const w = constrain(dito.y / height, 0, 0.5);
                reverb.drywet(w)
                nomeScala = "laScalaA"
                playNota(scalaA[nota], ottava, nomeScala)
                


                // Disegno
                const r = nota / scalaA.length * 255  + ottava * 10
                const g = dito.y / height * 50 
                fill (r, g, 255)
                rect (grigliaX, grigliaY, passoX, passoY)
                fill(255,255,255)
                text(colonna + ", " + nota, grigliaX +10, grigliaY +30)
              
                // text(dito.x + ", " + dito.y, grigliaX + 10, grigliaY + 10)
            }

                
            //SCALA B


            else if (dito.x > 0 && dito.y > 0 && dito.x < width && dito.y > height/2) {

                //SUONO 
                nota = colonna % scalaB.length
                let ottava = 5 + Math.floor(colonna / scalaB.length)
                const w = constrain(dito.y / height, 0, 1);
                reverb.drywet(w)
                nomeScala = "laScalaB"
                playNota(scalaB[nota], ottava, nomeScala)
                
                
                // Disegno
                const b = nota / scalaB.length * 170  + ottava * 30
                const g = dito.y / height * 255 
                fill (255, g, b)
                rect (grigliaX, grigliaY, passoX, passoY)
                fill(255,255,255)
                text(colonna + ", " + nota, grigliaX +10, grigliaY +30)
                

            }

        }
		
	}
}

async function createDetector() {
	// Configurazione Media Pipe
	// https://google.github.io/mediapipe/solutions/hands
	const mediaPipeConfig = {
		runtime: "mediapipe",
		modelType: "full",
		maxHands: 1,
		solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands`,
	}
	return window.handPoseDetection.createDetector( window.handPoseDetection.SupportedModels.MediaPipeHands, mediaPipeConfig )
}
