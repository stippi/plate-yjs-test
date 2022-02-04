// These types are for an Editor with `CursorEditor`, `YjsEditor` and `YHistoryEditor` mixed in
import { ReactEditor } from 'slate-react'
import { PlateEditor } from '@udecode/plate'
import { CursorEditor, YHistoryEditor, YjsEditor } from '@slate-yjs/core'

export type CursorData = {
  name: string
  color: string
}

export type CustomEditor = ReactEditor &
  YjsEditor &
  YHistoryEditor &
  CursorEditor<CursorData>;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
  }
}
