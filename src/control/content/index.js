import React from 'react';
import { render } from 'react-dom';
import Content from './content';
import '../../../../../styles/helper.css';
import '../../../../../styles/bootstrap.css';
import '../../../../../styles/siteIcons.css';
import '../../../../../styles/siteStyle.css';

const target = document.getElementById('mount');
render(<Content />, target);
