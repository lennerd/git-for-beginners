import React, { Fragment } from 'react';

import Glossary, { GlossaryTerm } from "./models/Glossary";
import { TooltipTerm } from './components/Tooltip';

export default new Glossary({
  version: new GlossaryTerm('Version', () => (
    <Fragment>
      <p>A version in this tutorial is a copy of a file or your whole project.</p>
      <p>It contains changes or a snapshot of your project at a certain point of time.</p>
    </Fragment>
  )),
  commit: new GlossaryTerm('Commit', () => (
    <Fragment>
      <p>A commit is a <TooltipTerm name="version">version</TooltipTerm>, a snapshot of your project at a certain point of time stored in the <TooltipTerm name="repository">repository</TooltipTerm>.</p>
      <p>It contains a unique identifier, the commits author, e-mail and creation date.</p>
    </Fragment>
  )),
  repository: new GlossaryTerm('Repository', () => (
    <Fragment>
      <p>The repository is the version database storing all the versions of your project as <TooltipTerm name="commit">commits</TooltipTerm>.</p>
      <p>At it's core it's a very simple object database initialised in your project folder.</p>
    </Fragment>
  )),
  stagingArea: new GlossaryTerm('Staging Area', () => (
    <Fragment>
      <p>The staging area can be used to collect changes in your file you want to be part of your next version.</p>
      <p>This way you are able to group changes into seperate version, e.g. by feature or topic.</p>
    </Fragment>
  )),
  workingDirectory: new GlossaryTerm('Working Directory', () => (
    <Fragment>
      <p>The working directory is essentially the folder on your computer where all the files of your project are stored in.</p>
      <p>Here you add, modify or delete files with other software like you are used to.</p>
    </Fragment>
  )),
});
