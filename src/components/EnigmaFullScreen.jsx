import { useState } from 'react';
import KeyboardElements from './KeyboardElements.jsx';

// data storage for rotar arrays and keyboard layouts
const rotarArray = [
    {
        name: 'EKW',
        combination: ["Q", "W", "E", "R", "T", "Z", "U", "I", "O", "A", "S", "D", "F", "G", "H", "J", "K", "P", "Y", "X", "C", "V", "B", "N", "M", "L"]
    },
    {
        name: 'i',
        combination: ["E", "K", "M", "F", "L", "G", "D", "Q", "V", "Z", "N", "T", "O", "W", "Y", "H", "X", "U", "S", "P", "A", "I", "B", "R", "C", "J"]
    },
    {
        name: 'ii',
        combination: ["A", "J", "D", "K", "S", "I", "R", "U", "X", "B", "L", "H", "W", "T", "M", "C", "Q", "G", "Z", "N", "P", "Y", "F", "V", "O", "E"]
    },
    {
        name: 'iii',
        combination: ["B", "D", "F", "H", "J", "L", "C", "R", "P", "T", "X", "V", "Z", "N", "Y", "E", "I", "W", "G", "A", "K", "M", "U", "S", "Q", "O"]
    },
    {
        name: 'iv',
        combination: ["E", "S", "O", "V", "P", "Z", "J", "A", "Y", "Q", "U", "I", "R", "H", "X", "L", "N", "F", "T", "G", "K", "D", "C", "M", "W", "B"]
    },
    {
        name: 'v',
        combination: ["V", "Z", "B", "R", "G", "I", "T", "Y", "U", "P", "S", "D", "N", "H", "L", "X", "A", "W", "M", "J", "Q", "O", "F", "E", "C", "K"]
    },
    {
        name: 'UKW',
        combination: ["E", "V", "Q", "B", "Z", "T", "C", "P", "M", "Y", "F", "H", "S", "L", "D", "X", "N", "I", "A", "J", "U", "W", "R", "K", "O", "G"]
    }
];

// data storage for initial load state.
const initialPlaintextState = "Hello World Clear this message and choose your plugboard settings Type your message";


export default function EnigmaFullScreen() {
    // states for boards and text.
    const [plaintextState, setPlaintextState] = useState("");
    const [plugboardOptions, setPlugboardOptions] = useState([]);
    const [ciphertextState, setCiphertextState] = useState("");

    // assign default rotar positions
    let rotarStartingIndex = 0;
    let rotar2StartingIndex = 0;
    let rotar3StartingIndex = 0;
    const [rotar1Index, setRotar1Index] = useState(rotarStartingIndex);
    const [rotar2Index, setRotar2Index] = useState(rotar2StartingIndex);
    const [rotar3Index, setRotar3Index] = useState(rotar3StartingIndex);

    // create user clicks for each rotar
    let eKW = rotarArray[0].combination;
    let reflector = rotarArray[6].combination;
    let reflectorHit = false;

    // create state management for the rotars position
    const [rotar1, setRotar1] = useState(rotarArray[1].combination);
    const [rotar2, setRotar2] = useState(rotarArray[2].combination);
    const [rotar3, setRotar3] = useState(rotarArray[3].combination);

    // create the first function of the letters journey.
    /**
     * BUG FOUND!! 
     * plugboard switches correctly when encrypting but not when decrypting.
     * need to look into why, could be that I need to reverse the process on reflector hit but i reckon its probably 
     * something else when running the code back through !!! 
     * problem for another day for now.
     */
    function passPlugboard(letter) {
        
        let newLetter = letter;
        // if letter does not exist in plugboardOptions
        const checkPlugExists = plugboardOptions.indexOf(newLetter);

        if (checkPlugExists === -1) {
            return newLetter;
        } else if (checkPlugExists !== -1 && checkPlugExists % 2 === 0) {
            newLetter = plugboardOptions[checkPlugExists + 1];
            return newLetter;
        } else if (checkPlugExists !== -1 && checkPlugExists % 2 !== 0) {
            newLetter = plugboardOptions[checkPlugExists - 1];
            return newLetter;
        }
        return newLetter;
    }

    // pass lightboard and return letter, takes input as argument and rotar to get index from.
    function passLightboard(letter) {
        // get rotar 1 index and translate it to the eKW (lightboard config)
        let currentLetterIndex = rotar1.indexOf(letter);
        let length = rotar1.length;
        // copy that data over minus the rotar1 index
        let lightboardIndex = (currentLetterIndex - rotar1Index) % length;
        // same as the rotar ciphers from earlier, prevents overlapping to undefined.
        lightboardIndex = ((lightboardIndex % length) + length) % length;

        return eKW[lightboardIndex];
    }

    // "light up" the lightboard
    function toggleLightboard(letter) {
        /**
         * this is where I learn useRef properly.
         * 
         *      - useRef is a way to select elements with react.
         *      - 
         */
    }

    // create dynamic ciphers for each rotar, takes the letter array as argument
    function substitutionCiphers(letter, rotar, prevRotar, rotarsIndex) {

        let length = rotar.length;
        // find letters current index
        let newLetterIndex = prevRotar.indexOf(letter);

        // rotar1 cipher - caesar 13
        if (rotar === rotar1 && reflectorHit === false) {
            newLetterIndex = (newLetterIndex + 13 + rotarsIndex) % length;
        } else if (rotar === rotar1 && reflectorHit === true) {
            newLetterIndex = (newLetterIndex + 13) % length;

        // rotar 2 cipher - shift 4
        } else if (rotar === rotar2 && reflectorHit === false) {
            newLetterIndex = (newLetterIndex + 4 + rotarsIndex) % length;
        } else if (rotar === rotar2 && reflectorHit === true) {
            newLetterIndex = (newLetterIndex - 4) % length;
            newLetterIndex = ((newLetterIndex % length) + length) % length;

        // rotar3 cipher - shift 5
        } else if (rotar === rotar3 && reflectorHit === false) {
            newLetterIndex = (newLetterIndex + 5 + rotarsIndex) % length;
        } else if (rotar === rotar3 && reflectorHit === true) {
            newLetterIndex = rotar.indexOf(letter);
            newLetterIndex = (newLetterIndex - 5) % length;
            newLetterIndex = ((newLetterIndex % length) + length) % length;

        // reflector, caesar 13
        } else if (rotar === reflector) {
            let reflectorIndex = rotar.indexOf(letter);
            newLetterIndex = (reflectorIndex + 13) % length;
            reflectorHit = true;
        } else {
            console.log("error found at rotars or reflector");
        }
        return rotar[newLetterIndex];
    }

    // rotar function
    function shiftRotars() {
        // set rotar indexes
        let length = rotar1.length;

        if (rotar1Index === length) {
            // SO answer to rotate the arrays, this works correctly, credit to Musadiq Khan (stack overflow link below)
            // https://stackoverflow.com/questions/76813535/how-do-i-pop-and-unshift-that-value-to-an-array-in-react/76814579#76814579
            setRotar1([rotar1[rotar1.length - 1], ...rotar1.slice(0, -1)]);
            setRotar1Index(0);
        } else if (rotar1Index >= 0) {
            setRotar1([rotar1[rotar1.length - 1], ...rotar1.slice(0, -1)]);
            setRotar1Index(rotar1Index + 1);
        }
        
        if (rotar1Index === length) {
            setRotar2([rotar2[rotar2.length - 1], ...rotar2.slice(0, -1)]);
            setRotar2Index(0);
        } else if (rotar2Index === rotarStartingIndex + 1) {
            setRotar2([rotar2[rotar2.length - 1], ...rotar2.slice(0, -1)]);
            setRotar2Index(rotar2Index + 1);
        }

        if (rotar3Index === length) {
            setRotar3([rotar3[rotar3.length - 1], ...rotar3.slice(0, -1)]);
            setRotar3Index(0);
        } else if (rotar3Index === rotar2StartingIndex + 1) {
            setRotar3([rotar3[rotar3.length - 1], ...rotar3.slice(0, -1)]);
            setRotar3Index(rotar3Index + 1);
        } 
    }

    // handle keyboard click, remember that this is purely for the input state keep this function clean
    const handleKeyboardClick = (value) => {
        // create the letter variable after any plugboard switches
        let newLetter = passPlugboard(value);
        // update the state for the plaintext input UI display
        setPlaintextState(plaintextState + ' ' + value);

        // pass the letter through each rotar
        let rotar1Letter = substitutionCiphers(newLetter, rotar1, eKW, rotar1Index);
        let rotar2Letter = substitutionCiphers(rotar1Letter, rotar2, rotar1, rotar2Index);
        let rotar3Letter = substitutionCiphers(rotar2Letter, rotar3, rotar2, rotar3Index);
        let refLetter = substitutionCiphers(rotar3Letter, reflector, rotar3, 0);
        let rot3Ref = substitutionCiphers(refLetter, rotar3, reflector, rotar3Index);
        let rot2Ref = substitutionCiphers(rot3Ref, rotar2, rotar3, rotar2Index);
        let rot1Ref = substitutionCiphers(rot2Ref, rotar1, rotar2, rotar1Index);
        
        // plugboard again
        let plugEKWLetter = passPlugboard(rot1Ref);

        // finally lightboard and UI display
        let cipherLetter = passLightboard(plugEKWLetter);
        toggleLightboard(cipherLetter);
        reflectorHit = false;
        setCiphertextState(ciphertextState + " " + cipherLetter);

        // shift / "step" the rotars
        shiftRotars();
        return;    
    };

    // push the plug options to the plugboardOptions array and remove if duplicate
    const handlePlugboardClick = (plug) => {
        // check for duplicate letters
        let checkExists = plugboardOptions.indexOf(plug);
        
        // ensure that user doesnt choose more than 10 pairs and add / remove options to array
        if (plugboardOptions.length >= 20 && checkExists === -1) {
            alert('Max Plugboard Options chosen! Please deselect most recent choice.');
            return;
        } else if (checkExists == -1) {
            setPlugboardOptions([...plugboardOptions, plug]);
        } else if (checkExists !== -1 && plugboardOptions.length <= 20) {
            setPlugboardOptions(plugboardOptions.filter((p) => p !== plug));
        }
    }

    // empty plaintext and plugboard states
    function clearState() {
        setPlaintextState('');
        setCiphertextState('');
        setRotar1Index(rotarStartingIndex);
        setRotar2Index(rotar2StartingIndex);
        setRotar3Index(rotar3StartingIndex);
        setRotar1(rotarArray[1].combination);
        setRotar2(rotarArray[2].combination);
        setRotar3(rotarArray[3].combination);
    }


    return (
        <>
            <div className="absolute z-20 ml-60 mt-20 border-8 border-violet-500 rounded-3xl w-4/5 h-4/5 bg-violet-200 bg-opacity-90 grid grid-cols-4 grid-rows-5 font-mono">

                <div id="explanation-rotar-selection" className="border-2 row-span-2 mt-10 mr-10 ml-10 p-2 bg-slate-200 rounded-md shadow-lg">
                    <h2 className="underline underline-offset-2">The Enigma Machine</h2>
                    <p className="text-sm">Choose your rotars here and starting positions when slotted</p>
                    <div id="rotar-select" className="grid grid-cols-2 grid-rows-5 border-2 border-black">
                        {/* <input id="rotar1-selector" type="radio" className="m-2 row-start-1"></input>
                        <p>Rotar 1</p>
                        <input id="rotar2-selector" type="radio" className="m-2 row-start-2"></input>
                        <p>Rotar 2</p>
                        <input id="rotar3-selector" type="radio" className="m-2 row-start-3"></input>
                        <p>Rotar 3</p>
                        <input id="rotar4-selector" type="radio" className="m-2 row-start-4"></input>
                        <p>Rotar 4</p>
                        <input id="rotar5-selector" type="radio" className="m-2 row-start-5"></input>
                        <p>Rotar 5</p> 
                        
                        Honestly I dont like how this is set up, can I redesign a better way for the user to select rotars?
                        Or could I have them appear as buttons? select one and it disappears, once all 3 are chosen, they all disappear?

                        Reset button would be easier to use that way. I also need to make sure that I put in a way for the user to select the rotar positions
                        this can be done easily enough by changing the display to an input rather than just a <p> element

                        So steps for next login:- 
                            Create Lightup function for the lightboard, create a separate function and call it within the lightboard "rotar" function
                            Add 5 buttons / divs, to represent the rotars. 
                                Onclick, these need to disappear from the screen - might be worth using components for these.
                                onclick they also need to set the rotar1, rotar2 and rotar3 variables with the corresponding values of the buttons
                            Change the rotar index boxes to be inputs. 
                                do I actually need this feature? ideally yes but I could also just put a footnote in to say that it could be done.
                                would save me fucking about with index testing again. KISS
                        
                        Following that, if time allows, I need to also attempt to render and derender this component with the clicks, render is easy enough 
                            (i think) its the derender I need to look into. rendering would be with the enigma card component, onclick(render)
                            then to derender, little box display onclick(derender function) -- would need to look into this cause react is a bit of a headache
                            otherwise I think I have my  next steps. 
                        */}

                    </div>
                </div>

                <div id="plaintext-display" className="row-span-3 row-start-3 m-2 col-start-1 p-10">
                    <button id="resetCipher" className="h-12 -translate-y-10 bg-white font-mono shadow-3xl rounded-xl text-center underline underline-offset-2 p-2 border-4 border-slate-400" onClick={clearState}>Clear Cipher</button>
                    <p id="plaintext" className="w-full h-full -translate-y-10 rounded-xl resize-none p-10 shadow-lg bg-white text-center" >{plaintextState}</p>
                </div>

                <div id="enigma-css-container" className="col-span-2 col-start-2 row-span-5 border-8 p-5 border-orange-400 bg-orange-500 rounded-md my-10 grid grid-cols-5 grid-rows-5">
                    <div id="enigma-rotar-container" className="border-2 col-span-4 row-span-2 grid grid-cols-3 bg-slate-700">
                        <div id="rotar-container" className="border-2 p-20">
                            <div id="rotar" className="w-10 h-full border-2 border-black rounded-2xl grid grid-rows-3 bg-slate-400 p-1">
                                <p id="rotar3-letter" className="text-center font-mono bg-white rounded-md row-start-2 h-7">{rotar3Index}</p>
                            </div>
                        </div>
                        <div id="rotar-container" className="border-2 p-20">
                            <div id="rotar" className="w-10 h-full border-2 border-black rounded-2xl grid grid-rows-3 bg-slate-400 p-1">
                                <p id="rotar2-letter" className="text-center font-mono bg-white rounded-md row-start-2 h-7">{rotar2Index}</p>
                            </div>
                        </div>
                        <div id="rotar-container" className="border-2 p-20">
                            <div id="rotar" className="w-10 h-full border-2 border-black rounded-2xl grid grid-rows-3 bg-slate-400 p-1">
                                <p id="rotar1-letter" className="text-center font-mono bg-white rounded-md row-start-2 h-7">{rotar1Index}</p>
                            </div>
                        </div>
                    </div>

                    <div id="enigma-logo" className="col-span-1 border-2 row-span-2 bg-slate-500 grid grid-rows-3">
                        <h2 className="text-center row-start-2 mt-5 bg-black border-2 rounded-full h-16 m-2 shadow-lg p-2 uppercase font-mono font-bold text-3xl text-slate-200">Enigma</h2>
                    </div>

                    <div id="lightboard-container" className="border-2 col-span-5 bg-slate-600 grid grid-cols-5">
                        <div id="plugboardDecals" className="col-span-1 text-center text-white my-auto p-2">
                            <p className=" underline underline-offset-2">Lightboard</p>
                            <p>This will show your cipher</p>
                        </div>
                        <KeyboardElements boardName="lightboard" keyOrder={rotarArray[0].combination} />
                    </div>

                    <div id="keyboard-container" className="border-2 col-span-5 bg-slate-600 grid grid-cols-5">
                        <div id="plugboardDecals" className="col-span-1 text-center text-white my-auto p-2">
                            <p className=" underline underline-offset-2">Keyboard</p>
                            <p>Type Here!</p>
                        </div>
                        <KeyboardElements boardName="keyboard" keyOrder={rotarArray[0].combination} handleClick={handleKeyboardClick} />
                    </div>

                    <div id="plugboard-container" className="border-2 col-span-5 bg-slate-600 grid grid-cols-5">
                        <div id="plugboardDecals" className="col-span-1 text-center text-white my-auto p-2">
                            <p className=" underline underline-offset-2">Plugboard</p>
                            <p>Choose up to 10 pairs!</p>
                        </div>
                        <KeyboardElements boardName="plugboard" keyOrder={rotarArray[0].combination} handlePlug={handlePlugboardClick} />
                        
                    </div>
                </div>
                <div id="ciphertext-display" className="row-span-3 row-start-3 m-2 col-start-4 p-10">
                    <p id="ciphertext" className="w-full h-full rounded-xl resize-none p-10 shadow-lg bg-white">{ciphertextState}</p>
                </div>
            </div>
        </>
    );
}