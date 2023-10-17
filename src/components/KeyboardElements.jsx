// create component which takes props for each of the keyboards
const KeyboardElements = ({ handleClick, boardName, keyOrder, handlePlug}) => {

    // props are passed when the component is called
    let board = boardName;
    let keys = keyOrder;

    // create an array to store the <p> elements
    let elementArray = [];

    // easier referencing to compare board type
    const keyboardType = ["lightboard", "keyboard", "plugboard"];

    // for each letter in the keys array create the elements and assign their value, innerText, key and ID
    keys.forEach(letter => {
        let element = document.createElement('p');
        element.innerText = letter;
        element.value = letter;
        element.type = board;
        // use this bool to set plugboard bg toggle
        element.plugLight = false;
        element.id = board + "_" + letter;
        elementArray.push(element);
    });

    // handle input paragraph clicks 
    const handleParaClick = (event) => {
        const value = event.target.innerText;
        handleClick(value);
    }

    // toggle backgrounds for plugs
    function toggleBackground(target) {
        // toggle the bg color depending on the bool value
        const currentColor = target.style.backgroundColor;
        if (target.plugLight === false) {
            target.style = currentColor;
            target.plugLight = true;
        } else {
            target.plugLight = false;
            target.style.backgroundColor = "#B3C381";
        }
    }

    // handle plugboard clicks
    const handlePlugClick = (event) => {
        const target = event.target;
        const plug = target.innerText;
        toggleBackground(target);
        handlePlug(plug);
    }


    // return a div which contains the layout and appearance of the keyboards based on the board type
    if (board === keyboardType[0]) {
        return (
            // import the ciphertext states latest update only and create animation for "light for 1 or 2 seconds per keypress"
            <div id="keys" key={keyboardType[0]} className="w-full h-full col-span-4 grid grid-cols-12 grid-rows-3 gap-1 p-1 border-slate-700 border-4 text-center text-white [&>p]:bg-slate-700 [&>p]:rounded-full [&>p]:border-2 [&>p]:border-slate-400 [&>p]:w-8 [&>p]:h-8 [&>p]:shadow-3xl">
                {elementArray.map(p => <p key={keyboardType[0] + p.innerText}>{p.innerText}</p>)}
                <div id="spacing" className="row-start-1 col-start-1 col-span-1"></div>
                <div id="spacing" className="row-start-1 col-span-2 col-start-11"></div>
                <div id="spacing" className="row-start-2 col-start-1 col-span-2"></div>
                <div id="spacing" className="row-start-2 col-span-3 col-start-10"></div>
                <div id="spacing" className="row-start-3 col-span-1 col-start-1"></div>
            </div>
        );
    } else if (board === keyboardType[1]) {
        return (
        <div id="keys" key={keyboardType[1]} className="w-full h-full col-span-4 grid grid-cols-12 grid-rows-3 gap-1 p-1 border-slate-700 border-4 text-center text-white [&>p]:bg-slate-800 [&>p]:rounded-full [&>p]:border-2 [&>p]:border-slate-200 [&>p]:w-8 [&>p]:h-8 [&>p]:shadow-3xl">
            {elementArray.map(p => <p key={keyboardType[1] + p.innerText} className="hover:cursor-pointer hover:scale-110" onClick={handleParaClick}>{p.innerText}</p>)}
            <div id="spacing" className="row-start-1 col-start-1 col-span-1"></div>
            <div id="spacing" className="row-start-1 col-span-2 col-start-11"></div>
            <div id="spacing" className="row-start-2 col-start-1 col-span-2"></div>
            <div id="spacing" className="row-start-2 col-span-3 col-start-10"></div>
            <div id="spacing" className="row-start-3 col-span-1 col-start-1"></div>
        </div>
        );
    } else if (board === keyboardType[2]) {
        return (
            <div id="keys" key={keyboardType[2]} className="w-full h-full col-span-4 grid grid-cols-12 grid-rows-3 gap-1 p-1 border-slate-700 border-4 text-center text-white [&>p]:bg-slate-800 [&>p]:rounded-sm [&>p]:border-2 [&>p]:border-slate-400 [&>p]:w-8 [&>p]:h-8 [&>p]:shadow-3xl">
                {elementArray.map(p => <p key={keyboardType[2] + p.innerText} className="hover:scale-110 hover:cursor-pointer" onClick={handlePlugClick}>{p.innerText}</p>)}
                <div id="spacing" className="row-start-1 col-start-1 col-span-1"></div>
                <div id="spacing" className="row-start-1 col-span-2 col-start-11"></div>
                <div id="spacing" className="row-start-2 col-start-1 col-span-2"></div>
                <div id="spacing" className="row-start-2 col-span-3 col-start-10"></div>
                <div id="spacing" className="row-start-3 col-span-1 col-start-1"></div>
            </div>
        );
    }
}

export default KeyboardElements;