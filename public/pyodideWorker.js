

importScripts("https://cdn.jsdelivr.net/pyodide/v0.18.0/full/pyodide.js");

let initialised = false;
async function initPyodide() {
    pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.18.0/full/",
        stdout:sendConsole
    });
}

onmessage = async message => {
    console.log("Pyodide - " + message.data.type);

    // Switch behavior depending on received command
    switch(message.data.type){
        case "initialise":
            initPyodide().then(() => {
                postMessage({"type":"init complete"});
                initialised = true;
            })
            
            break;
        case "code":
            if(initialised){
                pyodide.loadPackagesFromImports(message.data.data);
                pyodide.runPythonAsync(message.data.data)
            }
            break;
    }
    
}

sendConsole = (text) => {
    if(text !== ""){
        postMessage({"type":"console","data":text + "\n"});
    }
    else{
        postMessage({"type":"console","data":"\n"});
    }
    
}