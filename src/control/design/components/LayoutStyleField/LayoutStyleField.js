import React from 'react';
import * as layoutImages from '../../assets/layouts/';
import './LayoutStyleField.css';

class LayoutStyleField extends React.Component {

  state = {
    selectedLayout: 'layout1'
  };

  render() {
    return (
      <div className="LayoutStyleField item row margin-bottom-twenty clearfix">
        <div className="labels col-md-3 padding-right-zero pull-left">
          <span>Layout Style</span>
        </div>
        <div className="LayoutStyleField__layouts main col-md-9 pull-right">
          <div className="screens clearfix">
            <div className="screen layouticon pull-left">
              <a className="border-radius-three default-background-hover text-center">
                <img src={layoutImages[this.state.selectedLayout]} alt="" />
              </a>
            </div>
            <div className="LayoutStyleField__layouts-container screen layoutgrid pull-right margin-left-zero border-grey border-radius-three">
              {Object.keys(layoutImages).map((image) => (
                <a className="layouticon border-radius-three default-background-hover text-center ng-scope">
                  <img src={layoutImages[image]} alt="" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LayoutStyleField;
