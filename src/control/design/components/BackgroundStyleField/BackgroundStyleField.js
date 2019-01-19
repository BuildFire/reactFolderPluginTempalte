import React from 'react';
import { tablet, mobile } from '../../assets/icons/';
import './BackgroundStyleField.css';

class BackgroundStyleField extends React.Component {

  render() {
    return (
      <div className="item clearfix row padding-bottom-twenty">
        <div className="labels col-md-3 padding-right-zero pull-left">
          <span>Background Image</span>
        </div>
        <div className="main col-md-9 pull-right">
          <div className="screens clearfix">
            <div
              className="BackgroundStyleField__devices-screen devices-screen mobile-device text-center pull-left"
              style={{
                backgroundImage: `url(${mobile}) 100% 100% no-repeat`
              }}
            >
              <a className>
                <span className="add-icon">
                  +
                </span>{" "}
                <img
                  alt="Background Image"
                  className="hide"
                />
              </a>
              <label className="secondary">750x1334</label>
              <span
                className="icon btn-icon btn-delete-bg btn-delete-icon btn-danger transition-third ng-hide"
              />
            </div>
            <div className="devices-screen ipad-device pull-left text-center">
              <a>
                <span
                  className="add-icon"
                >
                  +
                </span>{" "}
                <img
                  alt="Background Image"
                  src={tablet}
                />
              </a>
              <label className="secondary">1536x2048</label>
              <span
                className="icon btn-icon btn-delete-bg btn-delete-icon btn-danger transition-third ng-hide"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BackgroundStyleField;
