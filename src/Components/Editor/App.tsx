import React from 'react';
import Codemirror from "../Codemirror/Codemirror"
import CHButton from '../Basic UI/CHButton/CHButton';
import Console from '../Console/Console';


interface AppState {
  stdout: string;
}

class App extends React.Component<{},AppState> {
  codemirrorRef: React.RefObject<Codemirror>;
  pyWorker: Worker;
  pyWorkerInitialised: Boolean;

  constructor(props:any){
    super(props);
    this.codemirrorRef = React.createRef();
    this.state = {
      stdout: ""
    }
    
    // Setup pyodide worker
    this.pyWorker = new Worker("./pyodideWorker.js")
    this.pyWorkerInitialised = false;
  }

  render() {
    return (
      <div>
        <Codemirror ref={this.codemirrorRef}/>
        <Console stdout={this.state.stdout}/>
        <CHButton callback={this.runCode} text="Run"/>
      </div>
    );
  }

  componentDidMount() {
    // Add listener for pyodide web worker messages
    this.pyWorker.addEventListener("message", this.handlePyWorkerMessage);

    this.pyWorker.postMessage({"type":"initialise"});
  }

  handlePyWorkerMessage = (message:MessageEvent) => {
    switch(message.data.type){
      case "init complete":
        console.log("Pyodide init complete");
        this.pyWorkerInitialised = true;
        break;
      case "console":
        this.setState({stdout: this.state.stdout + message.data.data})
        // console.log(this.state.stdout)
        break;
    }
  }

  runCode = () => {
    if (this.codemirrorRef.current !== null){
      let data = this.codemirrorRef.current.getEditorState();
      
      if (data && this.pyWorkerInitialised){
        this.pyWorker.postMessage({"type":"code","data":data.sliceString(0,data.length)})

      }
    }
  }
}

export default App;
