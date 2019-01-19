import React from 'react';
import { hot } from 'react-hot-loader';
import { datastore, messaging, notifications } from './buildfire';
import PluginsField from './components/PluginsField';

class Content extends React.Component {
  state = {
    _buildfire: {
      plugins: {
        dataType: 'pluginInstance',
        data: []
      }
    },
    content: {
      title: 'With the Folder plugin you can categorize existing plugins so that you can easily direct your users to the proper content.',
      loadAllPlugins: false
    },
    design: {
      backgroundImage: null,
    },
    default: true
  };

  componentDidMount() {
    datastore.getWithDynamicData()
    .then((result) => {
      if (!Object.keys(result.data).length) {
        datastore.save(this.state);
      } else {
        this.setState(() => result.data);
      }
    })
    .catch((err) => {
      console.error(`Error saving data: ${err}`);
    });
  }

  handleOnChangeTitle = (newTitle) => {
    return datastore.save({
      ...this.state,
      content: {
        title: newTitle
      }
    })
    .then((result) => {
      this.setState(() => result.data);
    })
    .catch((err) => {
      console.error(`Error saving data: ${err}`);
    });
  }

  handleClickTitle = (plugin) => {
    const pluginData = {
      pluginId: plugin.data.pluginTypeId,
      instanceId: plugin.data.instanceId,
      folderName: plugin.data.folderName,
      title: plugin.data.title
    };
    messaging.sendMessageToWidget({
      name: 'OPEN_PLUGIN',
      message: {
        data: pluginData
      }
    });
  }

  handleRemoveItem = (event, pluginToDelete) => {
    notifications.confirm({
      title: 'Remove Feature',
      message: '<p>Are you sure you want to do this?</p><p class="margin-zero">Note: If you would like to add it again, you can do so by clicking the button above.</p>',
      buttonLabels: ['Delete', 'Cancel'],
      target: event.currentTarget
    })
    .then(() => {
      const newState = {
        ...this.state,
        _buildfire: {
          plugins: {
            data: this.state._buildfire.plugins.data.filter(
              pluginInstanceId => (
                pluginInstanceId !== pluginToDelete.data.instanceId
              )
            ),
            dataType: 'pluginInstance'
          }
        }
      };
      return datastore.save(newState);
    })
    .then(() => {
      return datastore.getWithDynamicData();
    })
    .then((result) => {
      this.setState(() => result.data);
    })
    .catch((err) => {
      console.error(`Error saving data: ${err}`);
    });
  }

  handleChangeLoadAll = () => {
    const newState = {
      ...this.state,
      content: {
        loadAllPlugins: !this.state.content.loadAllPlugins
      }
    };
    datastore.save(newState).then(() => {
      return datastore.getWithDynamicData();
    })
    .then((result) => {
      this.setState(() => result.data);
    })
    .catch((err) => {
      console.error(`Error saving data: ${err}`);
    });
  }

  handleUpdateSort = (pluginList) => {
    const newState = {
      ...this.state,
      _buildfire: {
        plugins: {
          dataType: 'pluginInstance',
          data: pluginList.map((plugin) => (
            plugin.data.instanceId
          ))
        }
      }
    };
    datastore.save({}).then(() => {
      return datastore.save(newState);
    })
    .then(() => {
      return datastore.getWithDynamicData();
    })
    .then((result) => {
      this.setState(() => result.data);
    })
    .catch((err) => {
      console.error(`Error saving data: ${err}`);
    });
  }

  handleChangePlugins = (value) => {
    const newState = {
      ...this.state,
      _buildfire: {
        plugins: {
          data: [
            ...this.state._buildfire.plugins.data,
            ...value.pluginList.map(plugin => plugin.instanceId)
          ],
          dataType: 'pluginInstance'
        }
      }
    };
    datastore.save(newState).then(() => {
      return datastore.getWithDynamicData();
    })
    .then((result) => {
      this.setState(() => result.data);
    })
    .catch((err) => {
      console.error(`Error saving data: ${err}`);
    });
  }

  render() {
    const {
      content: {
        title,
        loadAllPlugins
      },
      _buildfire: {
        plugins: {
          result: pluginList
        }
      }
    } = this.state;

    return (
      <div>
        <div className="item clearfix row">
          <div className="col-md-12 section-title">
            <span className="top-line"></span>
            <h4 className="h4">Section 1</h4>
          </div>
        </div>
        <div className="item clearfix row">
          <div className="col-md-3 pull-left">
            <span className="field-name">Title</span>
          </div>
          <div className="col-md-9 pull-left">
            <input
              value={title}
              onChange={this.handleOnChangeTitle}
              type="text"
              className="form-control"
            />
          </div>
        </div>
        <hr className="none" />
        <div className="margin-top-30">
          <PluginsField
            value={{
              loadAllPlugins,
              pluginList
            }}
            onClickTitle={this.handleClickTitle}
            onRemoveItem={this.handleRemoveItem}
            onChangeLoadAll={this.handleChangeLoadAll}
            onUpdateSort={this.handleUpdateSort}
            onChangePlugins={this.handleChangePlugins}
          />
        </div>
      </div>
    );
  }
}

export default hot(module)(() => <Content />);
