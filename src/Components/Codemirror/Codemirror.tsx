/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable max-classes-per-file */
// TODO FIX

import React from 'react';
import { EditorState, basicSetup } from '@codemirror/basic-setup';
import { python } from '@codemirror/lang-python';
import { ChangeSet, TransactionSpec } from '@codemirror/state';
import {
  ViewPlugin, ViewUpdate, EditorView, keymap,
} from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentWithTab } from '@codemirror/commands';

let changes: ChangeSet[] = [];

const runExtension = () => {
  const plugin = ViewPlugin.fromClass(class {
    // eslint-disable-next-line no-useless-constructor, no-empty-function, no-unused-vars
    constructor(private view: EditorView) { }

    // Save the update to a list of updates
    // eslint-disable-next-line class-methods-use-this
    update(u: ViewUpdate) {
      if (u.docChanged) {
        changes.push(u.changes);
      }
    }
  });
  return plugin;
};

const createState = (doc: string, disabled: boolean) => (EditorState.create({
  doc,
  extensions: [
    basicSetup,
    python(),
    runExtension(),
    oneDark,
    keymap.of([indentWithTab]),
    EditorView.editable.of(!disabled),
  ],
}));

interface CodemirrorProps {
  initialCode?: string,
  disabled: boolean,
}

class Codemirror extends React.Component<CodemirrorProps> {
  view: EditorView | undefined;

  componentDidMount() {
    changes = [];
    const parent = document.getElementById('code-window');
    const { initialCode, disabled } = this.props;

    // Create Code Mirror state and view
    if (parent) {
      const state = createState(initialCode || '', disabled);

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
    if (this.view) {
      return (this.view.state.doc.toJSON());
    }
    return (['']);
  }

  // Clears the document and sets it to the value passed
  setEditorState(doc: string) {
    if (this.view) {
      const { disabled } = this.props;
      this.view.setState(createState(doc, disabled));
    }
  }

  getChanges(version: number) {
    return (changes.slice(version));
  }

  clearChanges() {
    changes = [];
  }

  // Dispatch each transaction spec
  applyChanges(newChanges: TransactionSpec[]) {
    newChanges.forEach((change) => {
      if (this.view) {
        this.view.dispatch(change);
      }
    });
  }

  // Focus editor
  focusEditor() {
    this.view?.focus();
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
