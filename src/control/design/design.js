import React, { Fragment } from 'react';
import { hot } from 'react-hot-loader';
import LayoutStyleField from './components/LayoutStyleField/LayoutStyleField';
import BackgroundStyleField from './components/BackgroundStyleField/BackgroundStyleField';

const Design = () => (
  <div>
    <LayoutStyleField />
    <hr />
    <BackgroundStyleField />
    <hr />
  </div>
);

export default hot(module)(Design);
