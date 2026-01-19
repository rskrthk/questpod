// src/components/BulletOnPeriod.js
// Or wherever you prefer to store your custom extensions

import { Extension } from "@tiptap/core";
import { TextSelection } from "@tiptap/pm/state";
import { InputRule } from "@tiptap/core";

const BulletOnPeriod = Extension.create({
  name: "bulletOnPeriod",

  addInputRules() {
    return [
      new InputRule({
        find: new RegExp(`^(.+)\\.$`),
        handler: ({ state, range, match }) => {
          const { tr } = state;
          const end = range.to;
          const $end = state.doc.resolve(end);

          // Get the parent node, which should be a paragraph
          const parent = $end.parent;

          // If the parent is not a paragraph, do nothing
          if (parent.type.name !== "paragraph") {
            return null;
          }

          // Check if the period is the last character of the paragraph
          if ($end.parentOffset !== parent.content.size) {
            return null;
          }

          // Delete the period character and any trailing whitespace
          tr.delete(end - 1, end);

          const from = tr.selection.from - 1;
          const to = tr.selection.to;
          const $from = tr.doc.resolve(from);
          const $to = tr.doc.resolve(to);

          // Wrap the paragraph in a bullet list
          if (
            !tr.doc.canReplaceWith(
              $from.before(),
              $to.after(),
              state.schema.nodes.bulletList
            )
          ) {
            return null;
          }

          tr.wrap($from.blockRange($to), [
            { type: state.schema.nodes.bulletList },
            { type: state.schema.nodes.listItem },
          ]);

          // Move the cursor to the newly created list item
          tr.setSelection(TextSelection.near(tr.doc.resolve(end + 1)));

          return tr;
        },
      }),
    ];
  },
});

export default BulletOnPeriod;