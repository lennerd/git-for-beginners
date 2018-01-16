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
      <p>The repository is the version database of your project.</p>
    </Fragment>
  )),
});
