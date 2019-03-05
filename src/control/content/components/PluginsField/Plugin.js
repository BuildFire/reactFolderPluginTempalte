import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import './Plugin.css';

const DragHandle = SortableHandle(() =>
  <span className="Plugin__sort-handle" />
);

const Plugin = ({ plugin, onRemoveItem, onClickTitle }) => (
  <div className="Plugin__row">
    <DragHandle />
    <div className="Plugin__icon-image">
      {plugin.data.iconUrl && 
        <img
          className="Plugin__icon-image__image"
          src={plugin.data.iconUrl}
          alt=""
        /> 
      }
      {plugin.data.iconClassName && 
        <i className={`Plugin__icon-image__icon glyphicon ${plugin.data.iconClassName}`} />
      }
    </div>
    <div className="Plugin__info">
      <a
        onClick={(event) => {
          event.preventDefault();
          onClickTitle(plugin);
        }}
        className="Plugin__title"
        href="/open-preview"
      >
        {plugin.data.title}
      </a>
      <div>
        <span 
          onClick={(event) => onRemoveItem(event, plugin)}
          className="Plugin__delete-button"
        />
      </div>
    </div>
  </div>
);

export default Plugin;
