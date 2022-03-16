// TODO FIX
/* eslint-disable max-classes-per-file */

import React from 'react';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { python } from '@codemirror/lang-python';
import './Codemirror.scss';
import { ViewPlugin, ViewUpdate } from '@codemirror/view';

const darkMode = EditorView.theme({}, { dark: true });

const runExtension = () => {
  const plugin = ViewPlugin.fromClass(class {
    timerRunning = false;

    // Run when a change is made to the document.
    // Sets a timer to send the changes, calls send bundle
    // when timer finishes.
    update(update: ViewUpdate) {
      if (update.docChanged) {
        if (this.timerRunning === false) {
          this.timerRunning = true;
          setTimeout(this.sendBundle, 1000);
        }
      }
    }

    sendBundle = () => {
      this.timerRunning = false;
    }
  });
  return plugin;
};

class Codemirror extends React.Component {
  view: EditorView | undefined;

  componentDidMount() {
    const parent = document.getElementById('code-window');

    // Create Code Mirror state and view
    if (parent) {
      const state = EditorState.create({
        extensions: [basicSetup, python(), runExtension(), darkMode],
      });

      this.view = new EditorView({
        state,
        parent,
      });
    } else {
      console.log('Could not find parent element');
    }
  }

  // Destroys the Code Mirror state when the component is unmounted
  componentWillUnmount() {
    if (this.view) {
      this.view.destroy();
    }
  }

  // Returns the code in the editor
  // eslint-disable-next-line react/no-unused-class-component-methods
  getEditorState() {
    return (this.view?.state.doc.toJSON());
  }

  render() {
    return (
      <div
        id="code-window"
      />
    );
  }
}

export default Codemirror;
