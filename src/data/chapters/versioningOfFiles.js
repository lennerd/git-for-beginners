import {
  SECTION_TASK,
  ACTION_ADD_FILE,
  ACTION_MODIFY_FILE,
  ACTION_DELETE_FILE,
  ACTION_COPY_FILE,
  ACTION_RESTORE_FILE,
} from "../../constants";

export default {
  title: 'Versioning of Files',
  sections: [
    {
      type: SECTION_TASK,
      text: 'Create a new file.',
      action: ACTION_ADD_FILE,
    }
  ],
  commands: [
    {
      name: 'add-file',
      avilable: vis => vis.files.length === 0,
      subcommands: [
        {
          icon: '+',
          label: 'Add a new file.',
          run: () => ACTION_ADD_FILE(),
        }
      ]
    },
    {
      name: 'file',
      label: 'File',
      avilable: vis => vis.activeFile != null,
      subcommands: [
        {
          icon: '+-',
          label: 'Modify',
          run: vis => ACTION_MODIFY_FILE(vis.activeFile),
          avilable: vis => !vis.activeFile.version,
        },
        {
          icon: '×',
          label: 'Delete',
          run: vis => ACTION_DELETE_FILE(vis.activeFile),
          avilable: vis => !vis.activeFile.version,
        },
        {
          icon: '↗',
          label: 'Copy',
          run: vis => ACTION_COPY_FILE(vis.activeFile),
          avilable: vis => !vis.activeFile.version,
        },
        {
          icon: '↙',
          label: 'Restore',
          run: vis => ACTION_RESTORE_FILE(vis.activeFile),
          avilable: vis => vis.activeFile.version,
        },
      ],
    },
  ],
};
