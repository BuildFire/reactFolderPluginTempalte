import React from 'react';
import { render } from 'react-dom';
import Design from './design';
import '../../../../../styles/helper.css';
import '../../../../../styles/bootstrap.css';
import '../../../../../styles/siteIcons.css';
import '../../../../../styles/siteStyle.css';

const target = document.getElementById('mount');
render(<Design />, target);
