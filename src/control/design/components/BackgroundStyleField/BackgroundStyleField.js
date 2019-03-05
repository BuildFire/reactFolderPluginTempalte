import React from 'react';
import { tablet, mobile } from '../../assets/icons/';
import './BackgroundStyleField.css';

const BackgroundStyleField = ({
  removeLargeBackground,
  removeSmallBackground,
  smallBackground,
  largeBackground,
  changeBackgroundSmallSize,
  changeBackgroundLargeSize
}) => (
  <div className="item clearfix row padding-bottom-twenty">
    <div className="labels col-md-3 padding-right-zero pull-left">
      <span>Background Image</span>
    </div>
    <div className="main col-md-9 pull-right">
      <div className="screens clearfix">
        <div style={{
          background: `url(${mobile}) 100% 100% no-repeat`
        }} className="devices-screen mobile-device text-center pull-left">
          <a className="" onClick={changeBackgroundSmallSize}>
            {!smallBackground && <span className="add-icon">+</span>}
            {smallBackground && <img src={smallBackground} alt="Background Image" />}
          </a>
          <label className="secondary">750x1334</label>
          {smallBackground
            && <span
            onClick={removeSmallBackground}
              className="icon
                btn-icon
                btn-delete-bg
                btn-delete-icon
                btn-danger
                transition-third"
            ></span>
          }
        </div>
        <div style={{
            background: `url(${tablet}) 100% 100% no-repeat`
          }} className="devices-screen ipad-device pull-left text-center">
          <a className="" onClick={changeBackgroundLargeSize}>
            {!largeBackground && <span className="add-icon">+</span>}
            {largeBackground &&<img src={largeBackground} alt="Background Image" />}
          </a>
          <label className="secondary">1536x2048</label>
          {largeBackground
            && <span
            onClick={removeLargeBackground}
              className="icon
                btn-icon
                btn-delete-bg
                btn-delete-icon
                btn-danger
                transition-third"
            ></span>
          }
        </div>
      </div>
    </div>
  </div>
);

export default BackgroundStyleField;
