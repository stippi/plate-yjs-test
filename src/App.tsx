// Import React dependencies.
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
// Import Plate stuff
import { Plate, withPlate } from '@udecode/plate'
// Import the Slate editor factory.
import {createEditor, Editor, Descendant, Node, Transforms, Range} from 'slate'
// Import the Slate components and React plugin.
import {Slate, Editable, RenderLeafProps, ReactEditor} from 'slate-react'
// Import the core Slate-Yjs binding
import {
  withCursors,
  withYjs,
  withYHistory,
  slateNodesToInsertDelta,
  YjsEditor
} from '@slate-yjs/core'
// Import Yjs
import * as Y from 'yjs'
// Import web socket stuff
import { WebsocketProvider } from 'y-websocket'
import randomColor from 'randomcolor'
// Local resources
import { AutoScaling } from './AutoScaling'
import { RemoteCursorOverlay } from './RemoteCursorOverlay'

const WEBSOCKET_ENDPOINT = 'ws://localhost:1234'

function App() {
  const editableProps = {
    placeholder: 'Type…',
    style: {
      padding: '15px',
    },
  };

  const initialValue = [
    {
      children: [
        {
          text:
            'This is editable plain text with react and history plugins, just like a <textarea>!',
        },
      ],
    },
  ];

  const [value, setValue] = useState<Descendant[]>([]);

  const name = 'Stephan'
  const color = useMemo(
    () =>
      randomColor({
        luminosity: "dark",
        format: "rgba",
        alpha: 0.8,
      }),
    []
  );

  // Create the Yjs doc and fetch if it's available from the server
  const [sharedTypeContent, provider] = useMemo(() => {
    const doc = new Y.Doc();
    const sharedTypeContent = doc.get('content', Y.XmlText) as Y.XmlText;
    const provider = new WebsocketProvider(WEBSOCKET_ENDPOINT, 'slug', doc, {
      connect: false,
    });

    return [sharedTypeContent, provider];
  }, []);

  // Setup the binding
  const editor = useMemo(() => {
    const cursorData = {
      color: color,
      name: name,
    };

    return withPlate(
      withYHistory(
        withCursors(
          withYjs(createEditor(), sharedTypeContent),
          provider.awareness, {
            data: cursorData,
          }
        )
      )
    );
  }, [provider.awareness, sharedTypeContent]);

  // Disconnect the binding on component unmount in order to free up resources
  useEffect(() => () => YjsEditor.disconnect(editor), [editor]);
  useEffect(() => {
    /*provider.on("status", ({ status }: { status: string }) => {
      setOnlineState(status === "connected");
    });*/

    provider.awareness.setLocalState({
      alphaColor: color.slice(0, -2) + "0.2)",
      color,
      name,
    });

    provider.on("sync", (isSynced: boolean) => {
      if (isSynced) {
        if (sharedTypeContent.length === 0) {
          const insertDelta = slateNodesToInsertDelta(initialValue);
          sharedTypeContent.applyDelta(insertDelta);
        }
      }
    });

    provider.connect();

    return () => {
      provider.disconnect();
    };
  }, [color, sharedTypeContent, provider]);

  const toolBarHeight = 50
  const documentWidth = 8.5 * 96

  return (
        <Plate
          id="1"
          editor={editor}
          value={value}
          onChange={setValue}
          editableProps={editableProps}
          initialValue={initialValue}
        />
  );
}

export default App;
