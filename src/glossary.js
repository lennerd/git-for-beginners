import React, { Fragment } from 'react';
import Glossary, { GlossaryTerm } from "./models/Glossary";

export default new Glossary({
  version: new GlossaryTerm('Version', () => (
    <Fragment>
      <p>A version in this tutorial is a copy of a file or your whole project.</p>
      <p>It contains changes or a snapshot of your project at a certain point of time.</p>
    </Fragment>
  )),
});
