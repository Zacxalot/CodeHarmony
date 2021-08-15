import React from 'react';
import Codemirror from './Components/Codemirror/Codemirror';
import CHButton from './Components/Basic UI/CHButton/CHButton';
import Console from './Components/Console/Console';

interface AppState {
  stdout: string;
}

class App extends React.Component<{},AppState> {
  codemirrorRef: React.RefObject<Codemirror>;

  constructor(props:any){
    super(props);
    this.codemirrorRef = React.createRef();
    this.state = {
      stdout: ""
    }
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
    loadPyodide({ indexURL : "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/" });
    
  }

  runCode= () => {
    if (this.codemirrorRef.current !== null){
      let data = this.codemirrorRef.current.getEditorState();
      
      if (data){
        this.setState({
          stdout: data.sliceString(0,data.length)
        });
      }
      
    }
  }
}

export default App;
