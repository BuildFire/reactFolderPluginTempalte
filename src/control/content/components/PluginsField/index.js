import React from 'react';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import Plugin from './Plugin';
import './PluginsField.css';

class PluginsField extends React.Component {

  onAddNewfeature = (event) => {
    const { onChangePlugins } = this.props;
    event.preventDefault();
    buildfire.pluginInstance.showDialog({}, (err, pluginList) => {
      onChangePlugins({ pluginList });
    });
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { onUpdateSort, value: { pluginList = [] } } = this.props;
    const pluginOrderedList = arrayMove(pluginList, oldIndex, newIndex);
    pluginOrderedList.forEach((plugin, index) => {
      plugin.sort = index;
    });
    onUpdateSort(pluginOrderedList);
  }

  render() {
    const {
      onChange,
      onRemoveItem,
      onClickTitle,
      onChangeLoadAll,
      value: {
        loadAllPlugins,
        pluginList = []
      }} = this.props;

    const SortableItem = SortableElement(Plugin);

    const SortableList = SortableContainer(({ items }) => {
      const manualSort = (a, b) => {
        if (a.sort < 0 || b.sort < 0) return 1;
        if(a.sort < b.sort)
          return -1;
        if(a.sort > b.sort)
          return 1;
        return 0;
      };
      return (
        <div>
          {items
            .sort(manualSort)
            .map((plugin, index) => (
              <SortableItem
                key={index}
                index={index}
                onChange={onChange}
                onRemoveItem={onRemoveItem}
                onClickTitle={onClickTitle}
                plugin={plugin}
              />
          ))}
        </div>
      );
    });

    return (
      <div id="plugins">
        <div className="item clearfix row margin-bottom-fifteen">
          <div className="labels col-md-3 padding-right-zero pull-left">
            Features
          </div>
          <div className="main col-md-9 pull-right">
            <div className="clearfix">
              <a href=""
                onClick={this.onAddNewfeature}
                disabled={loadAllPlugins}
                class="btn btn-success pull-left add-new-carousel"
              >
                Add Feature
              </a>
            </div>
            <div className="checkbox checkbox-primary">
              <input
                onChange={onChangeLoadAll}
                type="checkbox"
                checked={loadAllPlugins}
                id="loadAllPlugins585"
              />
              <label htmlFor="loadAllPlugins585">Load all features</label>
            </div>
            {!loadAllPlugins && <div className="PluginsField__plugin-list">
              <SortableList
                lockAxis='y'
                useDragHandle={true}
                onSortEnd={this.onSortEnd}
                items={pluginList.map((item, index) => ({ ...item, sort: index}))}
              />
            </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default PluginsField;
